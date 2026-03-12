import { Router, Response } from 'express';
import db from '../db';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', (req: AuthRequest, res: Response) => {
  const { score, result } = req.body;

  if (typeof score !== 'number' || !['win', 'tie', 'loss'].includes(result)) {
    res.status(400).json({ error: 'Invalid score or result' });
    return;
  }

  db.prepare('INSERT INTO scores (user_id, score, result) VALUES (?, ?, ?)').run(req.userId, score, result);
  res.json({ success: true });
});

router.get('/', (req: AuthRequest, res: Response) => {
  const scores = db.prepare(
    'SELECT score, result, played_at FROM scores WHERE user_id = ? ORDER BY played_at DESC LIMIT 20'
  ).all(req.userId);

  res.json({ scores });
});

export default router;
