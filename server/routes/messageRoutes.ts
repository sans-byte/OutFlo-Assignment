import express from 'express';
import { generatePersonalizedMessage } from '../controllers/messageController';

const router = express.Router();

// Message generation route
router.post('/', generatePersonalizedMessage);

export default router;