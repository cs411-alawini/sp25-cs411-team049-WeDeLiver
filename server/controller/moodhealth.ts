import { pool } from "../db/db";
import { MoodHealth } from "../models/moodhealth";

const calculateMoodScore = (stressLevel: number, anxietyLevel: number, sleepHours: number): number => {
    return parseFloat(
        (
            0.4 * (100 - stressLevel * 10) +
            0.3 * (100 - anxietyLevel * 10) +
            0.3 * Math.min(100, (sleepHours / 8.0) * 100)
        ).toFixed(2)
    );
};

export const getMoodHealthByUserId = async (userId: number): Promise<MoodHealth[]> => {
    try {
        const [rows] = await pool.query('SELECT * FROM MoodHealth WHERE UserID = ?', [userId]);
        return rows as MoodHealth[];
    } catch (error) {
        console.error('Error getting mood health data:', error);
        throw error;
    }
};


export const addMoodHealth = async (moodHealth: MoodHealth): Promise<void> => {
    try { 
        const moodScore = calculateMoodScore(moodHealth.stressLevel, moodHealth.anxietyLevel, moodHealth.sleepHours);
        await pool.query(
            'INSERT INTO MoodHealth (UserID, Date, StressLevel, AnxietyLevel, SleepHours, MoodScore) VALUES (?, ?, ?, ?, ?, ?)',
            [moodHealth.userId, moodHealth.date, moodHealth.stressLevel, moodHealth.anxietyLevel, moodHealth.sleepHours, moodScore]
        );
    } catch (error) {
        console.error('Error adding mood health data:', error);
        throw error;
    }
}

export const deleteMoodHealthData = async (id: number, date: string): Promise<void> => {
    try {
        await pool.query('DELETE FROM MoodHealth WHERE UserID = ? AND Date = ?', [id, date]);
    } catch (error) {
        console.error('Error deleting mood health data:', error);
        throw error;
    }
}   