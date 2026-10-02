export const demoPatients = [
  {
    _id: "p1001",
    patientId: "P-1001",
    name: "John Carter",
    age: 34,
    gender: "Male",
    phone: "+1 (415) 555-0134",
    email: "john.carter@email.com",
    address: "145 Harbor Lane, San Francisco, CA",
    bloodGroup: "A+",
    status: "Active",
    createdAt: "2025-01-12T10:00:00.000Z"
  },
  {
    _id: "p1002",
    patientId: "P-1002",
    name: "Alicia Gomez",
    age: 28,
    gender: "Female",
    phone: "+1 (415) 555-0187",
    email: "alicia.gomez@email.com",
    address: "78 Elm Street, Oakland, CA",
    bloodGroup: "B+",
    status: "Active",
    createdAt: "2025-02-03T09:15:00.000Z"
  },
  {
    _id: "p1003",
    patientId: "P-1003",
    name: "Michael Lee",
    age: 52,
    gender: "Male",
    phone: "+1 (415) 555-0172",
    email: "michael.lee@email.com",
    address: "220 Pine Ave, San Jose, CA",
    bloodGroup: "O-",
    status: "Discharged",
    createdAt: "2025-02-20T14:45:00.000Z"
  }
];

export const demoDepartments = [
  { _id: "d1001", name: "Cardiology", description: "Heart and vascular care", status: "Active" },
  { _id: "d1002", name: "Neurology", description: "Brain and nerve treatment", status: "Active" },
  { _id: "d1003", name: "General Medicine", description: "Primary and preventive care", status: "Active" }
];

export const demoDoctors = [
  {
    _id: "doc1001",
    doctorId: "D-101",
    name: "Dr. Ananya Sharma",
    email: "ananya.sharma@clinic.com",
    phone: "+91 98765 43210",
    specialization: "Cardiologist",
    department: "d1001",
    experience: 12,
    fee: 150,
    status: "Active"
  },
  {
    _id: "doc1002",
    doctorId: "D-102",
    name: "Dr. Rohan Mehta",
    email: "rohan.mehta@clinic.com",
    phone: "+91 99887 66554",
    specialization: "Neurologist",
    department: "d1002",
    experience: 15,
    fee: 180,
    status: "Active"
  },
  {
    _id: "doc1003",
    doctorId: "D-103",
    name: "Dr. Nisha Kapoor",
    email: "nisha.kapoor@clinic.com",
    phone: "+91 97654 11223",
    specialization: "General Physician",
    department: "d1003",
    experience: 10,
    fee: 120,
    status: "Active"
  }
];

export const demoAppointments = [
  {
    _id: "appt1001",
    patient: { _id: "p1001", patientId: "P-1001", name: "John Carter" },
    doctor: { _id: "doc1001", doctorId: "D-101", name: "Dr. Ananya Sharma", specialization: "Cardiologist" },
    department: { _id: "d1001", name: "Cardiology" },
    date: "2025-03-15T00:00:00.000Z",
    time: "09:30",
    reason: "Chest pain follow-up",
    status: "Scheduled",
    createdAt: "2025-03-10T09:30:00.000Z"
  },
  {
    _id: "appt1002",
    patient: { _id: "p1002", patientId: "P-1002", name: "Alicia Gomez" },
    doctor: { _id: "doc1002", doctorId: "D-102", name: "Dr. Rohan Mehta", specialization: "Neurologist" },
    department: { _id: "d1002", name: "Neurology" },
    date: "2025-03-16T00:00:00.000Z",
    time: "13:15",
    reason: "Migraine evaluation",
    status: "Scheduled",
    createdAt: "2025-03-11T10:00:00.000Z"
  },
  {
    _id: "appt1003",
    patient: { _id: "p1003", patientId: "P-1003", name: "Michael Lee" },
    doctor: { _id: "doc1003", doctorId: "D-103", name: "Dr. Nisha Kapoor", specialization: "General Physician" },
    department: { _id: "d1003", name: "General Medicine" },
    date: "2025-03-18T00:00:00.000Z",
    time: "11:00",
    reason: "Blood pressure review",
    status: "Completed",
    createdAt: "2025-03-13T15:00:00.000Z"
  }
];

export const demoBills = [
  {
    _id: "bill1001",
    patient: { _id: "p1001", patientId: "P-1001", name: "John Carter" },
    doctorFee: 1200,
    medicineFee: 320,
    otherCharges: 150,
    discount: 100,
    totalAmount: 1570,
    paidAmount: 1000,
    dueAmount: 570,
    status: "Partial",
    createdAt: "2025-03-05T11:20:00.000Z"
  },
  {
    _id: "bill1002",
    patient: { _id: "p1002", patientId: "P-1002", name: "Alicia Gomez" },
    doctorFee: 950,
    medicineFee: 280,
    otherCharges: 120,
    discount: 50,
    totalAmount: 1300,
    paidAmount: 1300,
    dueAmount: 0,
    status: "Paid",
    createdAt: "2025-03-12T15:05:00.000Z"
  },
  {
    _id: "bill1003",
    patient: { _id: "p1003", patientId: "P-1003", name: "Michael Lee" },
    doctorFee: 1600,
    medicineFee: 470,
    otherCharges: 210,
    discount: 0,
    totalAmount: 2280,
    paidAmount: 0,
    dueAmount: 2280,
    status: "Unpaid",
    createdAt: "2025-03-18T09:30:00.000Z"
  }
];

export const demoPrescriptions = [
  {
    _id: "pres1001",
    patient: { _id: "p1001", patientId: "P-1001", name: "John Carter" },
    doctor: { _id: "doc1002", doctorId: "D-102", name: "Dr. Rohan Mehta", specialization: "Neurologist" },
    diagnosis: "Migraine with tension symptoms",
    medicine: "Sumatriptan",
    dosage: "50 mg",
    duration: "7 days",
    instructions: "Take one tablet at the onset of pain and repeat if needed after 2 hours.",
    date: "2025-03-05T10:40:00.000Z"
  },
  {
    _id: "pres1002",
    patient: { _id: "p1002", patientId: "P-1002", name: "Alicia Gomez" },
    doctor: { _id: "doc1003", doctorId: "D-103", name: "Dr. Nisha Kapoor", specialization: "General Physician" },
    diagnosis: "Seasonal flu and mild fever",
    medicine: "Azithromycin",
    dosage: "500 mg",
    duration: "3 days",
    instructions: "Take once daily after food and drink plenty of water.",
    date: "2025-03-11T08:20:00.000Z"
  },
  {
    _id: "pres1003",
    patient: { _id: "p1003", patientId: "P-1003", name: "Michael Lee" },
    doctor: { _id: "doc1001", doctorId: "D-101", name: "Dr. Ananya Sharma", specialization: "Cardiologist" },
    diagnosis: "Mild hypertension review",
    medicine: "Amlodipine",
    dosage: "5 mg",
    duration: "30 days",
    instructions: "Take every morning with breakfast.",
    date: "2025-03-17T13:50:00.000Z"
  }
];

export const demoLabTests = [
  {
    _id: "lab1001",
    patient: { _id: "p1001", patientId: "P-1001", name: "John Carter" },
    doctor: { _id: "doc1002", doctorId: "D-102", name: "Dr. Rohan Mehta", specialization: "Neurologist" },
    testName: "MRI Brain Scan",
    testDate: "2025-03-06T09:00:00.000Z",
    result: "No major abnormal findings reported.",
    status: "Completed"
  },
  {
    _id: "lab1002",
    patient: { _id: "p1002", patientId: "P-1002", name: "Alicia Gomez" },
    doctor: { _id: "doc1003", doctorId: "D-103", name: "Dr. Nisha Kapoor", specialization: "General Physician" },
    testName: "CBC Test",
    testDate: "2025-03-12T11:45:00.000Z",
    result: "Pending lab review",
    status: "Pending"
  },
  {
    _id: "lab1003",
    patient: { _id: "p1003", patientId: "P-1003", name: "Michael Lee" },
    doctor: { _id: "doc1001", doctorId: "D-101", name: "Dr. Ananya Sharma", specialization: "Cardiologist" },
    testName: "ECG",
    testDate: "2025-03-18T14:00:00.000Z",
    result: "Normal sinus rhythm observed.",
    status: "Completed"
  }
];
