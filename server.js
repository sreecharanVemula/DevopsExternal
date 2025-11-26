const express = require('express');
const bodyParser = require('body-parser');

const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;

const app = express();
const PORT = 3000;

// Collect default metrics (CPU, memory, etc.)
collectDefaultMetrics();

// Create a custom counter metric
const httpRequestCounter = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'endpoint']
});

// Middleware to count requests
app.use((req, res, next) => {
    httpRequestCounter.labels(req.method, req.path).inc();
    next();
});

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});


app.use(bodyParser.json());

// Pre-filled student data
let students = [
    { id: 1, name: "Alice Johnson", age: 21, course: "Computer Science" },
    { id: 2, name: "Rahul Mehta", age: 22, course: "Mechanical Engineering" },
    { id: 3, name: "Priya Sharma", age: 20, course: "Biotechnology" },
    { id: 4, name: "Daniel Carter", age: 23, course: "Information Technology" }
];

let idCounter = 5;

// GET all students
app.get('/students', (req, res) => {
    res.json(students);
});

// GET a student by ID
app.get('/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (student) {
        res.json(student);
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
});

// POST - Add a new student
app.post('/students', (req, res) => {
    const { name, age, course } = req.body;
    const newStudent = { id: idCounter++, name, age, course };
    students.push(newStudent);
    res.status(201).json(newStudent);
});

// PATCH - Update student details
app.patch('/students/:id', (req, res) => {
    const student = students.find(s => s.id === parseInt(req.params.id));
    if (student) {
        const { name, age, course } = req.body;
        if (name) student.name = name;
        if (age) student.age = age;
        if (course) student.course = course;
        res.json(student);
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
});

// DELETE - Remove a student
app.delete('/students/:id', (req, res) => {
    const index = students.findIndex(s => s.id === parseInt(req.params.id));
    if (index !== -1) {
        const removedStudent = students.splice(index, 1);
        res.json(removedStudent[0]);
    } else {
        res.status(404).json({ message: 'Student not found' });
    }
});





// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// added comment

module.exports = app; // Export app for testing