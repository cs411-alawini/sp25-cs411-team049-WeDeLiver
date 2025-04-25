import { pool } from '../db/db';
import { User } from '../models/user';
import {data} from "../../data/testdata";


export const getAllUsers = async (): Promise<User[]> => {
    try {
        const [rows] = await pool.query('SELECT * FROM Users');
        return rows as User[];
    } catch (error) {
        console.error('Error getting all USERS:', error);
        throw error;
    }
};
export const checkUserExists = async (id: number): Promise<boolean> => {
    const [rows] = await pool.query('SELECT * FROM Users WHERE id = ?', [id]);
    return (rows as User[]).length > 0;
};

export const getUserByName = async (name: string): Promise<User | null> => {
    const [rows] = await pool.query('SELECT * FROM Users WHERE name = ?', [name]);
    const users = rows as User[];
    return users.length ? users[0] : null;
};

export const getUserById = async (id: number): Promise<User | null> => {
    const [rows] = await pool.query('SELECT * FROM Users WHERE id = ?', [id]);
    const users = rows as User[];
    return users.length ? users[0] : null;
};

export const createUser = async (user: User): Promise<User> => {
    try {
        let randomId: number;
        let userExists = true;

        randomId = Math.floor(Math.random() * 1000000);
        while (userExists) {
            randomId = Math.floor(Math.random() * 1000000);
            userExists = await checkUserExists(randomId); 
        }
        console.log(user);
        const [result] = await pool.query(
            'INSERT INTO Users (id, name, consecutivedays, Country, LastLoginDate) VALUES (?, ?, ?, ?, CURRENT_DATE())',
            [randomId, user.name, 0, user.country, null]
        );

        const [rows] = await pool.query('SELECT * FROM Users WHERE id = ?', [randomId]);
        const users = rows as User[];
        console.log('Created user:', users[0]); // Log the created user for debugging
        return users[0];

    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Internal server error while creating user');
    }
};


export const deleteUserById = async (id: number): Promise<void> => {
    await pool.query('DELETE FROM Users WHERE id = ?', [id]);
};