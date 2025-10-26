import express from 'express';
import path from 'path';

const __dirname = import.meta.dirname;
const router = express.Router();

router.get(/^\/$|\/index(.html)?/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

export default router;
