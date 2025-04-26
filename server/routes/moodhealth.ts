import express, { Request, Response, Router } from 'express';
import { pool } from '../db/db';
import { getMoodHealthByUserId, addMoodHealth } from '../controller/moodhealth';

const router = Router();

// Get mood health data for a user
router.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const moodHealthData = await getMoodHealthByUserId(id);
        res.status(200).send(moodHealthData);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Add mood health data for a user
router.post('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { date, stressLevel, anxietyLevel, sleepHours } = req.body;
    const newMoodHealth = { userId: id, date, stressLevel, anxietyLevel, sleepHours, moodScore: 0 }; // moodScore will be calculated in the controller
    try {
        await addMoodHealth(newMoodHealth);
        res.status(201).json({ message: "Mood health data added" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Get average of latest 7 mood entries for a user
router.get('/average/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
  
    try {
      const [result] = await pool.query('CALL GetWeeklyMoodAverages(?)', [id]);
      res.status(200).json(result); // Stored procedure returns nested arrays
    } catch (error) {
      console.error('Error calling stored procedure:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

export default router;