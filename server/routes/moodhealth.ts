import express, { Request, Response, Router } from 'express';
import { pool } from '../db/db';
import { getMoodHealthByUserId, addMoodHealth, getMoodHealthByText } from '../controller/moodhealth';
import axios from 'axios';
import OpenAI from 'openai';

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // use from your .env file
});

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


//delete mood health data for a user
router.delete('/:id/:date', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const date = req.params.date;
    try {
        await pool.query('DELETE FROM MoodHealth WHERE UserID = ? AND Date = ?', [id, date]);
        res.status(200).json({ message: "Mood health data deleted" });
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

router.post('/text/:id', async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const { text } = req.body;

  if (!text) {
    res.status(400).json({ message: "Text parameter is required" });
  }
  else {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0125", // or "gpt-3.5-turbo"
        messages: [
          {
            role: "system",
            content: "You are a psychologist analyzing mood based on user input.",
          },
          {
            role: "user",
            content: `Based on this description: "${text}", analyze the person's mood and provide these metrics:

    - Stress level (1-10 scale, where 10 is most stressed): [number]
    - Anxiety level (1-10 scale, where 10 is most anxious): [number]
    - Sleep quality or hours (0-14 scale, where higher is better sleep): [number]

    Format your response as a JSON object with keys: stressLevel, anxietyLevel, sleepHours.`,
          },
        ],
        temperature: 0.2,
      });

      const message = completion.choices[0].message.content || '';
      const moodMetrics = await getMoodHealthByText(message);

      res.status(200).json(moodMetrics);
    } catch (error) {
      console.error('Error analyzing mood with ChatGPT:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
});
export default router;