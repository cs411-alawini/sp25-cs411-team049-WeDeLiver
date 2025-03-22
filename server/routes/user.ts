// filepath: /Users/niniyu0127/Code/sp25-cs411-team049-WeDeLiver/server/routes/user.ts
import express, { Request, Response, Router } from 'express';
import { getAllUsers, getUserByName, getUserById, createUser, deleteUserById } from '../controller/user';

const router = Router();

// Get all users or get user by name
router.get('/', async (req: Request, res: Response) => {
    if (!req.query.name) {
        try {
            const allUsers = await getAllUsers();
            res.status(200).send(allUsers);
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    } else {
        try {
            const user = await getUserByName(req.query.name as string);
            if (user) {
                res.status(200).send(user);
            } else {
                res.status(404).json({ message: "User not found" });
            }
        } catch (error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
});

// Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        const user = await getUserById(id);
        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Create a new user
router.post('/', async (req: Request, res: Response) => {
    const newUser = req.body;
    try {
        const createdUser = await createUser(newUser);
        res.status(201).send(createdUser);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete a user
router.delete('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    try {
        await deleteUserById(id);
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;