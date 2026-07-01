const express = require('express');
const router = express.Router();
const db = require('../db/db');

// GET all projects
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM projects ORDER BY target_date ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});

// GET single project
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ error: 'Failed to fetch project' });
    }
});

// POST new project
router.post('/', async (req, res) => {
    const { project_name, client_name, target_date, stage, sub_stage, description } = req.body;
    
    // basic validation
    if (!project_name || !client_name || !target_date) {
        return res.status(400).json({ error: 'project_name, client_name, and target_date are required' });
    }

    try {
        const [result] = await db.query(
            `INSERT INTO projects (project_name, client_name, target_date, stage, sub_stage, description) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                project_name, 
                client_name, 
                target_date, 
                stage || 'start', 
                stage === 'start' ? sub_stage : null, 
                description || ''
            ]
        );
        res.status(201).json({ id: result.insertId, message: 'Project created successfully' });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// PUT update project
router.put('/:id', async (req, res) => {
    const { project_name, client_name, target_date, stage, sub_stage, description } = req.body;
    const { id } = req.params;

    try {
        // check if exists
        const [existing] = await db.query('SELECT id FROM projects WHERE id = ?', [id]);
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        await db.query(
            `UPDATE projects SET 
                project_name = ?, 
                client_name = ?, 
                target_date = ?, 
                stage = ?, 
                sub_stage = ?, 
                description = ? 
             WHERE id = ?`,
            [
                project_name, 
                client_name, 
                target_date, 
                stage, 
                stage === 'start' ? sub_stage : null, 
                description, 
                id
            ]
        );
        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

// DELETE project
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

module.exports = router;
