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
// projects and requests endpoints

// Get requests for a faculty
app.get('/api/faculty/:id/requests', async (req, res) => {
  const facultyId = req.params.id;
  const sql = `
    SELECT r.*, s.name as studentName, s.email, s.year, s.department, s.interests
      FROM project_requests r
      JOIN projects p ON r.project_id = p.id
      JOIN students s ON r.student_id = s.id
     WHERE p.faculty_id = ? AND r.status = 'pending'
     ORDER BY r.createdAt DESC`;
  const [rows] = await db.query(sql, [facultyId]);
  res.json(rows);
});

// Get faculty's own projects
app.get('/api/faculty/:id/projects', async (req, res) => {
  const facultyId = req.params.id;
  const sql = `
    SELECT *, COUNT(r.id) AS currentStudents
      FROM projects p
 LEFT JOIN project_requests r ON p.id = r.project_id AND r.status = 'accepted'
     WHERE p.faculty_id = ?
  GROUP BY p.id ORDER BY p.createdAt DESC`;
  const [rows] = await db.query(sql, [facultyId]);
  res.json(rows);
});

// Get active collaborations
app.get('/api/faculty/:id/active-collaborations', async (req, res) => {
  const facultyId = req.params.id;
  const sql = `
    SELECT r.*, s.name as studentName, s.email, r.respondedAt
      FROM project_requests r
      JOIN projects p ON r.project_id = p.id
      JOIN students s ON r.student_id = s.id
     WHERE p.faculty_id = ? AND r.status = 'accepted'
     ORDER BY r.respondedAt DESC`;
  const [rows] = await db.query(sql, [facultyId]);
  res.json(rows);
});

// Accept or reject requests
app.post('/api/faculty/requests/:reqId/accept', async (req, res) => {
  await db.query(
    "UPDATE project_requests SET status='accepted', respondedAt=NOW() WHERE id = ?",
    [req.params.reqId]
  );
  res.sendStatus(200);
});
app.post('/api/faculty/requests/:reqId/reject', async (req, res) => {
  await db.query(
    "UPDATE project_requests SET status='rejected', respondedAt=NOW() WHERE id = ?",
    [req.params.reqId]
  );
  res.sendStatus(200);
});
// POST: student submits an abstract
app.post("/api/student/abstracts", async (req, res) => {
  const { studentId, title, abstract, keywords, methodology, expectedOutcomes } = req.body;
  try {
    await db.query(
      `INSERT INTO student_abstracts
        (student_id, title, abstract, keywords, methodology, expected_outcomes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [studentId, title, abstract, keywords, methodology, expectedOutcomes]
    );
    return res.status(201).json({ message: "Abstract submitted successfully" });
  } catch (err) {
    console.error("Abstract submission error:", err);
    return res.status(500).json({ error: "Failed to submit abstract" });
  }
});

// GET: student views own abstracts
app.get("/api/student/:id/abstracts", async (req, res) => {
  const studentId = req.params.id;
  try {
    const [rows] = await db.query(
      "SELECT * FROM student_abstracts WHERE student_id = ? ORDER BY created_at DESC",
      [studentId]
    );
    return res.json(rows);
  } catch (err) {
    console.error("Fetch abstracts error:", err);
    return res.status(500).json({ error: "Failed to fetch abstracts" });
  }
});
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const app = express();

app.use(cors());
app.use(express.json());
// GET user data by ID
app.get("/api/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error fetching user" });
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
