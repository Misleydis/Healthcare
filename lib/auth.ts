import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { z } from "zod"
import { db } from "./db"

// Define user schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  password: z.string(), // In a real app, this would be hashed
  role: z.enum(["patient", "doctor", "admin"]).default("patient"),
  createdAt: z.string().datetime(),
})

export type User = z.infer<typeof UserSchema>
export type UserWithoutPassword = Omit<User, "password">

// Secret key for JWT
const secretKey = process.env.JWT_SECRET || "your-secret-key-for-development-only"
const key = new TextEncoder().encode(secretKey)

// JWT expiration time
const tokenExpirationTime = "7d"

// Create a JWT token
export async function createToken(user: UserWithoutPassword) {
  return await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(tokenExpirationTime)
    .sign(key)
}

// Verify a JWT token
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    return null
  }
}

// Set auth cookie
export function setAuthCookie(token: string) {
  cookies().set({
    name: "auth-token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}

// Remove auth cookie
export function removeAuthCookie() {
  cookies().delete("auth-token")
}

// Get current user from cookie
export async function getCurrentUser(): Promise<UserWithoutPassword | null> {
  const token = cookies().get("auth-token")?.value

  if (!token) {
    return null
  }

  try {
    const payload = await verifyToken(token)
    if (!payload || !payload.id) {
      return null
    }

    const user = await db.getUser(payload.id as string)
    if (!user) {
      return null
    }

    // Remove password from user object
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    return null
  }
}

// Login user
export async function loginUser(email: string, password: string) {
  try {
    const user = await db.getUserByEmail(email)

    if (!user) {
      return { success: false, message: "Invalid email or password" }
    }

    // In a real app, you would hash and compare passwords
    if (user.password !== password) {
      return { success: false, message: "Invalid email or password" }
    }

    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user

    // Create token
    const token = await createToken(userWithoutPassword)

    // Set cookie
    setAuthCookie(token)

    return { success: true, user: userWithoutPassword }
  } catch (error) {
    return { success: false, message: "An error occurred during login" }
  }
}

// Register user
export async function registerUser(userData: Omit<User, "id" | "createdAt">) {
  try {
    // Check if user already exists
    const existingUser = await db.getUserByEmail(userData.email)

    if (existingUser) {
      return { success: false, message: "Email already in use" }
    }

    // Create new user
    const newUser = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }

    // Save user
    await db.createUser(newUser)

    // Remove password from user object
    const { password, ...userWithoutPassword } = newUser

    // Create token
    const token = await createToken(userWithoutPassword)

    // Set cookie
    setAuthCookie(token)

    return { success: true, user: userWithoutPassword }
  } catch (error) {
    return { success: false, message: "An error occurred during registration" }
  }
}

// Logout user
export async function logoutUser() {
  removeAuthCookie()
  return { success: true }
}

