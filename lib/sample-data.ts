import { useDataStore } from './data-store';

// Only run in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const dataStore = useDataStore.getState();

  // Doctor user
  const doctorId = 'doctor-kuda';
  const doctor = {
    id: doctorId,
    name: 'Dr. Kudakwashe Moyo',
    email: 'kuda@gmail.com',
    specialization: 'Cardiology',
    department: 'Cardiology',
    phone: '+263771234567',
    avatar: '',
    availability: ['Monday', 'Tuesday', 'Thursday'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    patients: [],
  };
  dataStore.addDoctor(doctor);

  // Shona patients
  const patients = [
    {
      id: 'patient-munyaradzi',
      name: 'Munyaradzi Chikafu',
      email: 'munya@example.com',
      dateOfBirth: '1985-03-12',
      gender: 'male',
      phone: '+263772345678',
      address: 'Harare',
      emergencyContact: 'Tendai Chikafu',
      insuranceProvider: 'PSMAS',
      insuranceNumber: 'PSM123456',
      assignedDoctorId: doctorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'patient-tendai',
      name: 'Tendai Mutsvairo',
      email: 'tendai@example.com',
      dateOfBirth: '1992-07-25',
      gender: 'female',
      phone: '+263773456789',
      address: 'Chitungwiza',
      emergencyContact: 'Rudo Mutsvairo',
      insuranceProvider: 'CIMAS',
      insuranceNumber: 'CIM654321',
      assignedDoctorId: doctorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'patient-tawanda',
      name: 'Tawanda Nyandoro',
      email: 'tawanda@example.com',
      dateOfBirth: '1978-11-02',
      gender: 'male',
      phone: '+263774567890',
      address: 'Bulawayo',
      emergencyContact: 'Chipo Nyandoro',
      insuranceProvider: 'First Mutual',
      insuranceNumber: 'FM987654',
      assignedDoctorId: doctorId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  patients.forEach((p) => {
    dataStore.addPatient(p);
    dataStore.addPatientToDoctor(doctorId, p.id);
  });

  // Appointments (including telehealth)
  const appointments = [
    {
      id: 'appt-1',
      patientId: 'patient-munyaradzi',
      doctorId: doctorId,
      date: new Date().toISOString(),
      time: '10:00',
      duration: 30,
      status: 'scheduled',
      type: 'in-person',
      reason: 'Chest pain',
      notes: 'Patient reports chest pain for 2 days.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'appt-2',
      patientId: 'patient-tendai',
      doctorId: doctorId,
      date: new Date().toISOString(),
      time: '11:00',
      duration: 20,
      status: 'scheduled',
      type: 'telehealth',
      reason: 'Follow-up',
      notes: 'Telehealth follow-up for hypertension.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'appt-3',
      patientId: 'patient-tawanda',
      doctorId: doctorId,
      date: new Date().toISOString(),
      time: '12:00',
      duration: 40,
      status: 'completed',
      type: 'in-person',
      reason: 'Routine checkup',
      notes: 'Routine annual checkup.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  appointments.forEach((a) => dataStore.addAppointment(a));

  // Prescriptions (Medications)
  const medications = [
    {
      id: 'med-1',
      patientId: 'patient-munyaradzi',
      name: 'Atenolol',
      dosage: '50mg',
      frequency: 'Once daily',
      startDate: new Date().toISOString(),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'med-2',
      patientId: 'patient-tendai',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      startDate: new Date().toISOString(),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  medications.forEach((m) => dataStore.addMedication(m));

  // Health Records (for ML/analytics)
  const healthRecords = [
    {
      id: 'hr-1',
      patientId: 'patient-munyaradzi',
      doctorId: doctorId,
      date: new Date().toISOString(),
      type: 'visit',
      title: 'Initial Consultation',
      description: 'Patient presented with chest pain.',
      diagnosis: 'Angina',
      treatment: 'Prescribed Atenolol',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'hr-2',
      patientId: 'patient-tendai',
      doctorId: doctorId,
      date: new Date().toISOString(),
      type: 'visit',
      title: 'Telehealth Follow-up',
      description: 'Patient follow-up for hypertension.',
      diagnosis: 'Hypertension',
      treatment: 'Continue Lisinopril',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  healthRecords.forEach((hr) => dataStore.addHealthRecord(hr));

  // Optionally, add notifications or analytics mock data here if needed
} 