require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

const events = [
  { id: 1, title: 'Annual Tech Fest – TechNova 2025', description: 'Three days of hackathons, robotics, and coding competitions open to all branches.', date: '2025-08-10', venue: 'Main Auditorium', tag: 'Fest' },
  { id: 2, title: 'Guest Lecture: AI in Healthcare', description: 'Dr. Priya Nair from IIT Bombay speaks on real-world applications of AI in diagnostics.', date: '2025-07-28', venue: 'Seminar Hall A', tag: 'Lecture' },
  { id: 3, title: 'Inter-College Sports Meet', description: 'Annual sports competition featuring cricket, football, basketball and athletics.', date: '2025-08-02', venue: 'Sports Ground', tag: 'Sports' },
  { id: 4, title: 'Cultural Night – Utsav 2025', description: 'Music, dance, drama and art performances by student clubs. Open to all.', date: '2025-08-15', venue: 'Open Air Theatre', tag: 'Cultural' },
];

const jobs = [
  { id: 1, title: 'Software Engineer Intern', company: 'TCS', description: 'Summer internship for pre-final year students. Work on enterprise Java applications.', date: '2025-07-25', type: 'Internship', eligibility: 'CSE / IT · CGPA ≥ 7.0' },
  { id: 2, title: 'Campus Placement Drive', company: 'Infosys', description: 'Full-time roles for 2025 batch. Roles in development, testing and consulting.', date: '2025-07-30', type: 'Full-time', eligibility: 'All branches · CGPA ≥ 6.5' },
  { id: 3, title: 'Data Analyst – Fresher', company: 'Wipro', description: 'Entry-level data analyst role. Training provided. Work with Python and SQL.', date: '2025-08-05', type: 'Full-time', eligibility: 'CSE / IT / ECE · 2025 batch' },
  { id: 4, title: 'UI/UX Design Intern', company: 'Razorpay', description: 'Remote internship for students with a strong design portfolio. Figma skills required.', date: '2025-07-22', type: 'Internship', eligibility: 'Any branch · Portfolio required' },
];

const announcements = [
  { id: 1, title: 'Mid-Semester Exam Schedule Released', description: 'The timetable for mid-semester examinations has been published on the student portal. All students must check their hall ticket details.', date: '2025-07-15', postedBy: 'Examination Cell', tag: 'Exam' },
  { id: 2, title: 'Scholarship Application – Last Date Extended', description: 'The deadline for the merit-cum-means scholarship application has been extended to July 31, 2025. Apply via the finance portal.', date: '2025-07-12', postedBy: 'Finance Department', tag: 'Important' },
  { id: 3, title: 'Library Fine Waiver Week', description: 'All pending library fines will be waived off from July 14–18. Return overdue books to avail the benefit.', date: '2025-07-10', postedBy: 'Library Administration', tag: 'Notice' },
  { id: 4, title: 'Anti-Ragging Committee Meeting', description: 'Mandatory awareness session for all first-year students on July 20 at 10 AM in the Main Hall.', date: '2025-07-08', postedBy: 'Dean of Students', tag: 'Mandatory' },
];

app.get('/api/events', (req, res) => res.json(events));
app.get('/api/jobs', (req, res) => res.json(jobs));
app.get('/api/announcements', (req, res) => res.json(announcements));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch(err => console.error(err));
