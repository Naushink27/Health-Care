
# 🌐 Healthcare APP

---

## 🏗️ High-Level Design (HLD)

### 👤 Major Roles:
- Patient
- Doctor
- Admin

### 💻 Tech Stack:
- **Frontend:** React.js, React Router, TailwindCSS, Axios
- **Backend:** Node.js, Express.js, Socket.io
- **Database:** MongoDB with Mongoose
- **Auth:** JWT, bcrypt

---

## 🛠️ Low-Level Design (LLD)

### 1. 📦 Database Schema

#### **User Model**
```js
{
  _id,
  name,
  email,
  password,
  role: ['patient', 'doctor', 'admin'],
  createdAt
}
```

#### **Patient Profile**
```js
{
  userId,
  age,
  gender,
  bloodGroup,
  medicalHistory: [{ disease, duration }],
  reports: [ReportID]
}
```

#### **Doctor Profile**
```js
{
  userId,
  specialization,
  qualifications,
  experience,
  availability: [{ day, slots }]
}
```

#### **Appointments**
```js
{
  _id,
  patientId,
  doctorId,
  date,
  time,
  status: ['pending', 'confirmed', 'cancelled']
}
```



---

## 🧩 API Design

### Auth:
- `POST /register`
- `POST /login`

### Patient:
- `GET /patient/profile`
- `PUT /patient/profile`
- `GET /patient/appointments`
- `POST /patient/appointments/book`
- `POST /patient/feedback`

### Doctor:
- `GET /doctor/profile`
- `PUT /doctor/profile`
- `GET /doctor/appointments`
- `POST /doctor/appointments/update`
- `GET /doctor/feedbacks`


