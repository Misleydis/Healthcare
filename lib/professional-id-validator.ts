// Professional ID Validation Service
// This is a completely separate module that doesn't touch existing modules

export interface ProfessionalIdData {
  id: string
  professionalId: string
  role: "doctor" | "nurse"
}

class ProfessionalIdValidator {
  private static instance: ProfessionalIdValidator
  private professionalIds: ProfessionalIdData[] = []

  private constructor() {}

  public static getInstance(): ProfessionalIdValidator {
    if (!ProfessionalIdValidator.instance) {
      ProfessionalIdValidator.instance = new ProfessionalIdValidator()
    }
    return ProfessionalIdValidator.instance
  }

  // Add a professional ID to the registry
  public addProfessionalId(id: string, professionalId: string, role: "doctor" | "nurse"): void {
    this.professionalIds.push({ id, professionalId, role })
  }

  // Remove a professional ID from the registry
  public removeProfessionalId(id: string): void {
    this.professionalIds = this.professionalIds.filter(item => item.id !== id)
  }

  // Check if a professional ID is duplicate
  public isDuplicate(professionalId: string, role: "doctor" | "nurse", excludeId?: string): boolean {
    return this.professionalIds.some(item => 
      item.professionalId === professionalId && 
      item.role === role && 
      item.id !== excludeId
    )
  }

  // Get all professional IDs for a specific role
  public getProfessionalIdsByRole(role: "doctor" | "nurse"): string[] {
    return this.professionalIds
      .filter(item => item.role === role)
      .map(item => item.professionalId)
  }

  // Validate professional ID format
  public validateFormat(professionalId: string, role: "doctor" | "nurse"): boolean {
    if (role === "doctor") {
      const doctorPattern = /^MJD\d{3}$/
      return doctorPattern.test(professionalId)
    } else if (role === "nurse") {
      const nursePattern = /^MJN\d{3}$/
      return nursePattern.test(professionalId)
    }
    return false
  }

  // Get validation error message
  public getValidationMessage(professionalId: string, role: "doctor" | "nurse"): string | null {
    if (!this.validateFormat(professionalId, role)) {
      if (role === "doctor") {
        return "Doctor ID must be in format MJD001, MJD002, etc."
      } else {
        return "Nurse ID must be in format MJN001, MJN002, etc."
      }
    }

    if (this.isDuplicate(professionalId, role)) {
      return "This Professional ID is already in use. Please use a different ID."
    }

    return null
  }

  // Clear all professional IDs (useful for testing)
  public clearAll(): void {
    this.professionalIds = []
  }

  // Get all professional IDs
  public getAllProfessionalIds(): ProfessionalIdData[] {
    return [...this.professionalIds]
  }
}

// Export singleton instance
export const professionalIdValidator = ProfessionalIdValidator.getInstance()

// Export utility functions for easy use
export const validateProfessionalId = (
  professionalId: string, 
  role: "doctor" | "nurse", 
  excludeId?: string
): { isValid: boolean; message: string | null } => {
  const validator = ProfessionalIdValidator.getInstance()
  
  if (!validator.validateFormat(professionalId, role)) {
    return {
      isValid: false,
      message: role === "doctor" 
        ? "Doctor ID must be in format MJD001, MJD002, etc."
        : "Nurse ID must be in format MJN001, MJN002, etc."
    }
  }

  if (validator.isDuplicate(professionalId, role, excludeId)) {
    return {
      isValid: false,
      message: "This Professional ID is already in use. Please use a different ID."
    }
  }

  return { isValid: true, message: null }
}

export const registerProfessionalId = (
  id: string, 
  professionalId: string, 
  role: "doctor" | "nurse"
): void => {
  const validator = ProfessionalIdValidator.getInstance()
  validator.addProfessionalId(id, professionalId, role)
}

export const unregisterProfessionalId = (id: string): void => {
  const validator = ProfessionalIdValidator.getInstance()
  validator.removeProfessionalId(id)
} 