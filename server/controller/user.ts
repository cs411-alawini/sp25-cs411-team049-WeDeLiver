import { pool } from '../db/db';
import { User } from '../models/user';


export const getAllUsers = async (): Promise<User[]> => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        return rows as User[];
    } catch (error) {
        console.error('Error getting all users:', error);
        throw error;
    }
};
export const getUserByName = async (name: string): Promise<User | null> => {
    const [rows] = await pool.query('SELECT * FROM users WHERE name = ?', [name]);
    const users = rows as User[];
    return users.length ? users[0] : null;
};

export const getUserById = async (id: number): Promise<User | null> => {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    const users = rows as User[];
    return users.length ? users[0] : null;
};

export const createUser = async (user: User): Promise<User> => {
    const [result] = await pool.query(
        'INSERT INTO users (name, consecutivedays) VALUES (?, ?)',
        [user.name, user.consecutivedays]
    );
    const insertId = (result as any).insertId;
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [insertId]);
    const users = rows as User[];
    return users[0];
};

export const deleteUserById = async (id: number): Promise<void> => {
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
};