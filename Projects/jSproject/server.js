const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(express.json());
app.use(express.static(__dirname)); // Serve frontend files (index.html, style.css, script.js)

// Helper: Load records from file
function loadRecords() {
    if (fs.existsSync(DATA_FILE)) {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
    return [];
}

// Helper: Save records to file
function saveRecords(records) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(records, null, 2));
}

// ─── ROUTES ──────────────────────────────────────────────

// GET all records
app.get('/api/records', (req, res) => {
    const records = loadRecords();
    res.json(records);
});

// POST a new record
app.post('/api/records', (req, res) => {
    const records = loadRecords();
    const newRecord = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        ...req.body
    };
    records.push(newRecord);
    saveRecords(records);
    res.status(201).json(newRecord);
});

// DELETE a record by ID
app.delete('/api/records/:id', (req, res) => {
    let records = loadRecords();
    const id = parseInt(req.params.id);
    const before = records.length;
    records = records.filter(r => r.id !== id);

    if (records.length === before) {
        return res.status(404).json({ error: 'Record not found' });
    }

    saveRecords(records);
    res.json({ message: 'Record deleted' });
});

// DELETE all records
app.delete('/api/records', (req, res) => {
    saveRecords([]);
    res.json({ message: 'All records cleared' });
});

// ─── START SERVER ─────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`✅ Dairy Manager server running at http://localhost:${PORT}`);
});
