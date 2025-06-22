import { User, Student, Faculty } from "./types";

// userServer.js

import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 👤 Authenticate User (Student or Faculty)
app.post('/api/auth/login', async (req, res) => {
  const { email, password, role } = req.body;

  if (!['student', 'faculty'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const table = role === 'student' ? 'students' : 'faculty';

  try {
    const [rows] = await db.query(`SELECT * FROM ${table} WHERE email = ?`, [email]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = rows[0];
    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    delete user.password; // 🔐 Never expose password
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Database error', details: err });
  }
});

// 🆕 Register Student
app.post('/api/auth/register/student', async (req, res) => {
  const { name, email, password, department, year, interests } = req.body;
  try {
    const [existing] = await db.query('SELECT * FROM students WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Student already exists' });
    }

    const interestsString = JSON.stringify(interests || []);
    await db.query(
      'INSERT INTO students (name, email, password, department, year, interests, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [name, email, password, department, year, interestsString],
    );

    return res.status(201).json({ message: 'Student registered' });
  } catch (err) {
    return res.status(500).json({ error: 'Error registering student' });
  }
});

// 🆕 Register Faculty
app.post('/api/auth/register/faculty', async (req, res) => {
  const {
    name,
    email,
    password,
    department,
    position,
    specialization,
    experience,
    bio,
    researchAreas,
    publications,
    activeProjects,
  } = req.body;

  try {
    const [existing] = await db.query('SELECT * FROM faculty WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Faculty already exists' });
    }

    await db.query(
      'INSERT INTO faculty (name, email, password, department, position, specialization, experience, bio, researchAreas, publications, activeProjects, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [
        name,
        email,
        password,
        department,
        position,
        JSON.stringify(specialization),
        experience,
        bio,
        JSON.stringify(researchAreas),
        publications,
        activeProjects,
      ],
    );

    return res.status(201).json({ message: 'Faculty registered' });
  } catch (err) {
    return res.status(500).json({ error: 'Error registering faculty', details: err });
  }
});

// 📚 Get All Faculty
app.get('/api/faculty', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM faculty');
    return res.json(rows.map(f => ({ ...f, specialization: JSON.parse(f.specialization || '[]'), researchAreas: JSON.parse(f.researchAreas || '[]') })));
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching faculty' });
  }
});

// 🔍 Get Faculty by ID
app.get('/api/faculty/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM faculty WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Faculty not found' });

    const faculty = rows[0];
    faculty.specialization = JSON.parse(faculty.specialization || '[]');
    faculty.researchAreas = JSON.parse(faculty.researchAreas || '[]');
    return res.json(faculty);
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching faculty by ID' });
  }
});

const PORT = process.env.PORT || 3306;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
