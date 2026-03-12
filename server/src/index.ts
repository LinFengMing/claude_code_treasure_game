import express from 'express';
import authRoutes from './routes/auth';
import scoreRoutes from './routes/scores';

const app = express();
const PORT = 3001;

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/scores', scoreRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
