import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
  // Placeholder para cálculo real
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { origin, destination, distance, time } = req.body;
  const estimate = distance * 2.5 + time * 0.5; // Simulação
  res.status(200).json({ estimate });
});

export default router;
