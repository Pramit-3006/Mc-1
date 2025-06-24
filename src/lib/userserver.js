// userServer.js

import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express();
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Enable JSON body parsing

// Database Pool Configuration
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test DB connection (optional, but good for startup)
db.getConnection()
  .then(connection => {
    console.log('Connected to MySQL database successfully!');
    connection.release(); // Release the connection
  })
  .catch(err => {
    console.error('Failed to connect to MySQL database:', err);
    process.exit(1); // Exit the process if DB connection fails
  });

// --- Authentication Endpoints ---

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
    // In a real application, you should hash passwords and compare them using bcrypt
    if (user.password !== password) { // Assuming plain text password for now as per original code
      return res.status(401).json({ error: 'Incorrect password' });
    }

    delete user.password; // 🔐 Never expose password
    return res.json(user);
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Database error', details: err.message });
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
    // In a real application, hash the password before storing
    await db.query(
      'INSERT INTO students (name, email, password, department, year, interests, createdAt) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [name, email, password, department, year, interestsString],
    );

    return res.status(201).json({ message: 'Student registered' });
  } catch (err) {
    console.error('Error registering student:', err);
    return res.status(500).json({ error: 'Error registering student', details: err.message });
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

    // In a real application, hash the password before storing
    await db.query(
      'INSERT INTO faculty (name, email, password, department, position, specialization, experience, bio, researchAreas, publications, activeProjects, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())',
      [
        name,
        email,
        password,
        department,
        position,
        JSON.stringify(specialization || []),
        experience,
        bio,
        JSON.stringify(researchAreas || []),
        publications,
        activeProjects,
      ],
    );

    return res.status(201).json({ message: 'Faculty registered' });
  } catch (err) {
    console.error('Error registering faculty:', err);
    return res.status(500).json({ error: 'Error registering faculty', details: err.message });
  }
});

// --- User Profile & Faculty Endpoints ---

// GET user data by ID (general user, student, or faculty)
app.get("/api/users/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    // This assumes a 'users' table that stores common user info and role
    // If 'users' table doesn't exist, you'd need to check 'students' and 'faculty' tables
    const [rows] = await db.query("SELECT id, name, email, role FROM users WHERE id = ?", [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error fetching user", details: err.message });
  }
});

// 📚 Get All Faculty (from 'faculty' table)
app.get('/api/faculty', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM faculty');
    return res.json(rows.map(f => ({
      ...f,
      specialization: JSON.parse(f.specialization || '[]'),
      researchAreas: JSON.parse(f.researchAreas || '[]')
    })));
  } catch (err) {
    console.error('Error fetching all faculty:', err);
    return res.status(500).json({ error: 'Error fetching faculty', details: err.message });
  }
});

// 🔍 Get Faculty by ID (from 'faculty' table)
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
    console.error('Error fetching faculty by ID:', err);
    return res.status(500).json({ error: 'Error fetching faculty by ID', details: err.message });
  }
});

// Save/Update Faculty Profile (from 'faculty_profiles' table)
// This endpoint seems to manage a more detailed faculty profile separate from the basic 'faculty' table.
app.post('/api/profile/faculty', async (req, res) => {
  const {
    userId,
    name,
    department,
    position,
    experience,
    bio,
    specialization,
    researchAreas,
    publications,
    currentProjects,
    office,
    phone,
    website,
  } = req.body;

  if (!userId || !department || !position || !experience || !specialization?.length) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [existing] = await db.query(
      'SELECT id FROM faculty_profiles WHERE user_id = ?',
      [userId]
    );

    const values = [
      name, department, position, experience, bio,
      JSON.stringify(specialization || []),
      JSON.stringify(researchAreas || []),
      publications || 0,
      currentProjects || 0,
      office || '',
      phone || '',
      website || '',
      userId
    ];

    if (existing.length > 0) {
      await db.query(
        `UPDATE faculty_profiles SET
          name=?, department=?, position=?, experience=?, bio=?,
          specialization=?, research_areas=?, publications=?, current_projects=?,
          office=?, phone=?, website=?
        WHERE user_id=?`,
        values
      );
    } else {
      await db.query(
        `INSERT INTO faculty_profiles (
          name, department, position, experience, bio,
          specialization, research_areas, publications, current_projects,
          office, phone, website, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        values
      );
    }

    res.json({ message: 'Faculty profile saved successfully' });
  } catch (err) {
    console.error('Error saving faculty profile:', err);
    res.status(500).json({ error: 'Server error while saving profile', details: err.message });
  }
});

// GET /api/profile/:id (General user profile with projects)
app.get('/api/profile/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    // Assuming a 'users' table with 'role' column
    const [users] = await db.query(`SELECT id, name, email, role FROM users WHERE id = ?`, [userId]);

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    let projects = [];

    if (user.role === 'faculty') {
      [projects] = await db.query(`SELECT * FROM projects WHERE faculty_id = ?`, [user.id]);
    } else if (user.role === 'student') {
      [projects] = await db.query(`SELECT * FROM projects WHERE student_id = ?`, [user.id]);
    }

    res.json({ profile: user, projects });
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ error: 'Server error fetching profile', details: err.message });
  }
});


// --- Project & Request Endpoints ---

// Handle new project requests by students (simplified version)
app.post("/api/project-requests", async (req, res) => {
  const { studentId, facultyId, projectType, ideaType } = req.body;
  try {
    await db.query(
      `INSERT INTO project_requests
       (student_id, faculty_id, project_type, idea_type, status, createdAt)
       VALUES (?, ?, ?, ?, 'pending', NOW())`, // Added status and createdAt
      [studentId, facultyId, projectType, ideaType]
    );
    res.status(201).json({ message: "Project request sent" });
  } catch (err) {
    console.error('Error sending project request:', err);
    res.status(500).json({ error: "Failed to send project request", details: err.message });
  }
});

// Submit a new project request from a student (detailed version)
app.post("/api/project-request", async (req, res) => {
  const {
    studentId,
    facultyId,
    projectType,
    ideaType,
    title,
    description,
    objectives,
    methodology,
    timeline,
    expectedOutcomes,
    personalMotivation,
    relevantExperience,
    questions,
  } = req.body;

  if (!studentId || !facultyId || !projectType || !title || !description || !personalMotivation) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  try {
    await db.query(
      `INSERT INTO project_requests (
        student_id, faculty_id, project_type, idea_type,
        title, description, objectives, methodology, timeline,
        expected_outcomes, personal_motivation, relevant_experience,
        questions, status, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [
        studentId,
        facultyId,
        projectType,
        ideaType || null, // Allow null for ideaType
        title,
        description,
        objectives || null,
        methodology || null,
        timeline || null,
        expectedOutcomes || null,
        personalMotivation,
        relevantExperience || null,
        questions || null,
      ]
    );
    res.status(201).json({ message: "Project request submitted successfully" });
  } catch (err) {
    console.error("Error submitting detailed project request:", err);
    res.status(500).json({ error: "Server error while submitting request", details: err.message });
  }
});

// Get requests for a faculty
app.get('/api/faculty/:id/requests', async (req, res) => {
  const facultyId = req.params.id;
  try {
    const sql = `
      SELECT r.*, s.name as studentName, s.email, s.year, s.department, s.interests
        FROM project_requests r
        JOIN students s ON r.student_id = s.id
       WHERE r.faculty_id = ? AND r.status = 'pending'
       ORDER BY r.createdAt DESC`; // Assuming project_requests directly links to faculty_id
    const [rows] = await db.query(sql, [facultyId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching faculty requests:', err);
    res.status(500).json({ error: 'Error fetching requests', details: err.message });
  }
});

// Get faculty's own projects
app.get('/api/faculty/:id/projects', async (req, res) => {
  const facultyId = req.params.id;
  try {
    const sql = `
      SELECT p.*, COUNT(r.id) AS currentStudents
        FROM projects p
   LEFT JOIN project_requests r ON p.id = r.project_id AND r.status = 'accepted'
       WHERE p.faculty_id = ?
    GROUP BY p.id ORDER BY p.createdAt DESC`;
    const [rows] = await db.query(sql, [facultyId]);
    res.json(rows.map(p => ({
      ...p,
      requiredSkills: p.requiredSkills ? JSON.parse(p.requiredSkills) : [] // Parse skills if present
    })));
  } catch (err) {
    console.error('Error fetching faculty projects:', err);
    res.status(500).json({ error: 'Error fetching projects', details: err.message });
  }
});

// Delete a project
app.delete("/api/projects/:projectId", async (req, res) => {
  const { projectId } = req.params;
  try {
    const [result] = await db.query("DELETE FROM projects WHERE id = ?", [projectId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// Get active collaborations for faculty
app.get('/api/faculty/:id/active-collaborations', async (req, res) => {
  const facultyId = req.params.id;
  try {
    const sql = `
      SELECT r.*, s.name as studentName, s.email, r.respondedAt
        FROM project_requests r
        JOIN projects p ON r.project_id = p.id
        JOIN students s ON r.student_id = s.id
       WHERE p.faculty_id = ? AND r.status = 'accepted'
       ORDER BY r.respondedAt DESC`;
    const [rows] = await db.query(sql, [facultyId]);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching active collaborations:', err);
    res.status(500).json({ error: 'Error fetching active collaborations', details: err.message });
  }
});

// Accept a project request
app.post('/api/faculty/requests/:reqId/accept', async (req, res) => {
  try {
    await db.query(
      "UPDATE project_requests SET status='accepted', respondedAt=NOW() WHERE id = ?",
      [req.params.reqId]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error('Error accepting request:', err);
    res.status(500).json({ error: 'Error accepting request', details: err.message });
  }
});

// Reject a project request
app.post('/api/faculty/requests/:reqId/reject', async (req, res) => {
  try {
    await db.query(
      "UPDATE project_requests SET status='rejected', respondedAt=NOW() WHERE id = ?",
      [req.params.reqId]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error('Error rejecting request:', err);
    res.status(500).json({ error: 'Error rejecting request', details: err.message });
  }
});

// --- Student Specific Endpoints ---

// POST: student submits an abstract
app.post("/api/student/abstracts", async (req, res) => {
  const { studentId, title, abstract, keywords, methodology, expectedOutcomes } = req.body;
  try {
    await db.query(
      `INSERT INTO student_abstracts
        (student_id, title, abstract, keywords, methodology, expected_outcomes, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [studentId, title, abstract, keywords, methodology, expectedOutcomes]
    );
    return res.status(201).json({ message: "Abstract submitted successfully" });
  } catch (err) {
    console.error("Abstract submission error:", err);
    return res.status(500).json({ error: "Failed to submit abstract", details: err.message });
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
    return res.status(500).json({ error: "Failed to fetch abstracts", details: err.message });
  }
});

// Get student project selection
app.get("/api/student-project-selection/:studentId", async (req, res) => {
  const studentId = req.params.studentId;
  try {
    const [rows] = await db.query("SELECT * FROM student_project_selection WHERE student_id = ?", [studentId]);
    if (rows.length === 0) return res.json({ projectTypes: [], ideaType: "" });

    const row = rows[0];
    return res.json({
      projectTypes: JSON.parse(row.project_types || "[]"),
      ideaType: row.idea_type || "",
    });
  } catch (err) {
    console.error("Error fetching student project selection:", err);
    res.status(500).json({ error: "Failed to fetch student selection", details: err.message });
  }
});

// Save/update student project selection
app.post("/api/student-project-selection", async (req, res) => {
  const { studentId, projectTypes, ideaType } = req.body;
  if (!studentId || !ideaType || !Array.isArray(projectTypes)) {
    return res.status(400).json({ error: "Invalid request" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM student_project_selection WHERE student_id = ?", [studentId]);
    const jsonTypes = JSON.stringify(projectTypes);

    if (rows.length > 0) {
      await db.query(
        "UPDATE student_project_selection SET project_types = ?, idea_type = ? WHERE student_id = ?",
        [jsonTypes, ideaType, studentId]
      );
    } else {
      await db.query(
        "INSERT INTO student_project_selection (student_id, project_types, idea_type) VALUES (?, ?, ?)",
        [studentId, jsonTypes, ideaType]
      );
    }
    res.status(200).json({ message: "Selection saved" });
  } catch (err) {
    console.error("Error saving student project selection:", err);
    res.status(500).json({ error: "Failed to save selection", details: err.message });
  }
});

// Student Dashboard Data
app.get('/api/dashboard/student/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Fetch student's project requests
    const [projectRequests] = await db.query(`
      SELECT pr.*, f.name as facultyName, f.department
      FROM project_requests pr
      LEFT JOIN faculty f ON pr.faculty_id = f.id
      WHERE pr.student_id = ?
      ORDER BY pr.createdAt DESC
    `, [userId]);

    // Fetch featured project ideas (limit 4) - Assuming 'project_ideas' table exists
    const [featuredProjects] = await db.query(`
      SELECT pi.*, f.name as facultyName, f.department
      FROM project_ideas pi
      LEFT JOIN faculty f ON pi.faculty_id = f.id
      ORDER BY pi.created_at DESC
      LIMIT 4
    `);

    // Fetch top faculty (limit 3) - Assuming 'faculty' table has relevant data for 'top'
    const [topFaculty] = await db.query(`
      SELECT id, name, department, position, experience, specialization, researchAreas
      FROM faculty
      ORDER BY experience DESC
      LIMIT 3
    `);

    res.json({
      myProjects: projectRequests,
      featuredProjects,
      topFaculty: topFaculty.map(f => ({
        ...f,
        specialization: JSON.parse(f.specialization || '[]'),
        researchAreas: JSON.parse(f.researchAreas || '[]')
      })),
    });
  } catch (err) {
    console.error('Dashboard fetch error:', err);
    res.status(500).json({ error: 'Server error loading dashboard', details: err.message });
  }
});

// --- Project Types Endpoints ---

// Get all available project types
app.get('/api/project-types', async (req, res) => {
  try {
    const [types] = await db.query('SELECT * FROM project_types');
    res.json(types);
  } catch (err) {
    console.error('Error fetching project types:', err);
    res.status(500).json({ error: 'Failed to fetch project types', details: err.message });
  }
});

// Save user-selected project types
app.post('/api/project-selection', async (req, res) => {
  const { userId, selectedTypes } = req.body;

  if (!userId || !Array.isArray(selectedTypes)) {
    return res.status(400).json({ error: 'Invalid data' });
  }

  try {
    // Clear existing selections for the user
    await db.query('DELETE FROM user_project_types WHERE user_id = ?', [userId]);

    // Insert new selections
    if (selectedTypes.length > 0) {
      const values = selectedTypes.map(type => [userId, type]);
      await db.query(
        'INSERT INTO user_project_types (user_id, project_type) VALUES ?',
        [values]
      );
    }

    res.json({ message: 'Project types saved successfully' });
  } catch (err) {
    console.error('Error saving project types:', err);
    res.status(500).json({ error: 'Failed to save project types', details: err.message });
  }
});

// --- Resume Endpoints ---

// Utility to calculate score (moved inside the file for clarity)
const calculateScore = (analysis) => {
  let score = 0;
  const maxScore = 100;

  // Research (5 points)
  if (analysis.research?.patents?.length > 0) score += 5;

  // Achievements (10 points)
  if (analysis.achievements?.length > 0) score += 10;

  return Math.min(score, maxScore);
};

// API: Upload and score resume
app.post("/api/resume", async (req, res) => {
  const { name, email, research, achievements } = req.body;

  const analysis = { research, achievements };
  const score = calculateScore(analysis);

  try {
    const sql =
      "INSERT INTO resumes (name, email, research_patents, achievements, score, created_at) VALUES (?, ?, ?, ?, ?, NOW())";
    await db.query(
      sql,
      [
        name,
        email,
        JSON.stringify(research?.patents || []),
        JSON.stringify(achievements || []),
        score,
      ],
    );
    res.status(200).json({ message: "Resume saved", score });
  } catch (err) {
    console.error("Resume insert error:", err);
    res.status(500).json({ error: "Failed to save resume", details: err.message });
  }
});

// API: Get all resumes
app.get("/api/resumes", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM resumes");
    res.status(200).json(results);
  } catch (err) {
    console.error("Fetch resumes error:", err);
    res.status(500).json({ error: "Failed to fetch resumes", details: err.message });
  }
});

// --- Server Start ---

const PORT = process.env.PORT || 3306; // Use environment variable or default to 3001
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
