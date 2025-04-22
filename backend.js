const express = require("express")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
require("dotenv").config()

const app = express()

// Configure CORS to allow specific origin and include necessary headers
app.use(
  cors({
    origin: [
      "https://breastcancer-frontend.vercel.app",
      "https://mjshealth-hub.vercel.app",
      "https://auth-backend-qyna.onrender.com",
      "http://localhost:5173",
      "https://v0-breast-cancer-detection.vercel.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
)

app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err))

// User schema and model with roles
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "doctor", "nurse", "patient"], default: "patient" },
  fullName: { type: String },
  phone: { type: String },
  bio: { type: String },
  specialization: { type: String },
  profileImage: { type: String },
  createdAt: { type: Date, default: Date.now },
})

const User = mongoose.model("User", userSchema)

// Patient schema and model
const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  fullName: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  bloodType: { type: String },
  allergies: [{ type: String }],
  medicalHistory: { type: String },
  insuranceInfo: { type: String },
  emergencyContact: {
    name: { type: String },
    relationship: { type: String },
    phone: { type: String },
  },
  status: { type: String, enum: ["active", "inactive", "pending"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const Patient = mongoose.model("Patient", patientSchema)

// Health Record schema and model
const healthRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  recordType: { type: String, enum: ["general", "lab", "prescription", "imaging", "vaccination"], required: true },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  attachments: [{ type: String }],
  notes: { type: String },
  status: { type: String, enum: ["draft", "final", "amended"], default: "final" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const HealthRecord = mongoose.model("HealthRecord", healthRecordSchema)

// Appointment schema and model
const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: Number, default: 30 }, // in minutes
  type: { type: String, enum: ["in-person", "telehealth"], default: "telehealth" },
  status: { type: String, enum: ["scheduled", "completed", "cancelled", "no-show"], default: "scheduled" },
  notes: { type: String },
  reason: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

const Appointment = mongoose.model("Appointment", appointmentSchema)

// Notification schema and model
const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ["alert", "info", "success", "warning"], default: "info" },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

const Notification = mongoose.model("Notification", notificationSchema)

// Middleware to verify JWT token
const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "")

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" })
  }
}

// Register endpoint
app.post("/api/register", async (req, res) => {
  try {
    const { email, password, role = "patient", fullName } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      role,
      fullName,
    })

    await user.save()

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
    )

    res.status(201).json({ token, role: user.role })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Login endpoint
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" },
    )

    res.json({ token, role: user.role })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user profile
app.get("/api/users/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
app.put("/api/users/profile", auth, async (req, res) => {
  try {
    const { fullName, phone, bio, specialization } = req.body

    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (fullName) user.fullName = fullName
    if (phone) user.phone = phone
    if (bio) user.bio = bio
    if (specialization) user.specialization = specialization

    await user.save()

    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// PATIENT ENDPOINTS

// Get all patients
app.get("/api/patients", auth, async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 })
    res.json(patients)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get patient by ID
app.get("/api/patients/:id", auth, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" })
    }
    res.json(patient)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create patient
app.post("/api/patients", auth, async (req, res) => {
  try {
    const { fullName, dateOfBirth, gender, address, phone, email, bloodType, allergies, medicalHistory } = req.body

    const patient = new Patient({
      fullName,
      dateOfBirth,
      gender,
      address,
      phone,
      email,
      bloodType,
      allergies,
      medicalHistory,
    })

    await patient.save()

    res.status(201).json(patient)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update patient
app.put("/api/patients/:id", auth, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true },
    )

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" })
    }

    res.json(patient)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete patient
app.delete("/api/patients/:id", auth, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id)

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" })
    }

    res.json({ message: "Patient removed" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// HEALTH RECORD ENDPOINTS

// Get all health records for a patient
app.get("/api/patients/:patientId/records", auth, async (req, res) => {
  try {
    const records = await HealthRecord.find({ patientId: req.params.patientId }).sort({ date: -1 })
    res.json(records)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get health record by ID
app.get("/api/records/:id", auth, async (req, res) => {
  try {
    const record = await HealthRecord.findById(req.params.id)
    if (!record) {
      return res.status(404).json({ message: "Record not found" })
    }
    res.json(record)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create health record
app.post("/api/records", auth, async (req, res) => {
  try {
    const { patientId, recordType, title, description, provider, attachments, notes } = req.body

    const record = new HealthRecord({
      patientId,
      recordType,
      title,
      description,
      provider: provider || req.user.userId,
      attachments,
      notes,
    })

    await record.save()

    res.status(201).json(record)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update health record
app.put("/api/records/:id", auth, async (req, res) => {
  try {
    const record = await HealthRecord.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true },
    )

    if (!record) {
      return res.status(404).json({ message: "Record not found" })
    }

    res.json(record)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete health record
app.delete("/api/records/:id", auth, async (req, res) => {
  try {
    const record = await HealthRecord.findByIdAndDelete(req.params.id)

    if (!record) {
      return res.status(404).json({ message: "Record not found" })
    }

    res.json({ message: "Record removed" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// APPOINTMENT ENDPOINTS

// Get all appointments
app.get("/api/appointments", auth, async (req, res) => {
  try {
    const { role, userId } = req.user
    const query = {}

    // If user is a patient, only show their appointments
    if (role === "patient") {
      const patient = await Patient.findOne({ userId: req.user.userId })
      if (patient) {
        query.patientId = patient._id
      }
    } else if (role === "doctor" || role === "nurse") {
      // If user is a provider, show appointments where they are the provider
      query.providerId = userId
    }

    const appointments = await Appointment.find(query)
      .populate("patientId", "fullName")
      .populate("providerId", "fullName")
      .sort({ date: 1 })

    res.json(appointments)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get appointment by ID
app.get("/api/appointments/:id", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patientId", "fullName")
      .populate("providerId", "fullName")

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    res.json(appointment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create appointment
app.post("/api/appointments", auth, async (req, res) => {
  try {
    const { patientId, providerId, date, time, duration, type, notes, reason } = req.body

    const appointment = new Appointment({
      patientId,
      providerId,
      date,
      time,
      duration,
      type,
      notes,
      reason,
    })

    await appointment.save()

    // Create notification for patient
    const patientNotification = new Notification({
      userId: patientId,
      title: "New Appointment Scheduled",
      description: `You have a new ${type} appointment on ${new Date(date).toLocaleDateString()} at ${time}`,
      type: "info",
    })

    await patientNotification.save()

    // Create notification for provider
    const providerNotification = new Notification({
      userId: providerId,
      title: "New Appointment Scheduled",
      description: `You have a new ${type} appointment scheduled on ${new Date(date).toLocaleDateString()} at ${time}`,
      type: "info",
    })

    await providerNotification.save()

    res.status(201).json(appointment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Update appointment
app.put("/api/appointments/:id", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true },
    )

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    res.json(appointment)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete appointment
app.delete("/api/appointments/:id", auth, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id)

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" })
    }

    res.json({ message: "Appointment removed" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// NOTIFICATION ENDPOINTS

// Get all notifications for a user
app.get("/api/notifications", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId }).sort({ createdAt: -1 })
    res.json(notifications)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Mark notification as read
app.put("/api/notifications/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true })

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" })
    }

    res.json(notification)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Mark all notifications as read
app.put("/api/notifications/read-all", auth, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.userId, read: false }, { read: true })

    res.json({ message: "All notifications marked as read" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

// Delete notification
app.delete("/api/notifications/:id", auth, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id)

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" })
    }

    res.json({ message: "Notification removed" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
