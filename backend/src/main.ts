import express, { Express } from 'express';
import dotenv from 'dotenv'
import { routesConf } from './utils/route-utils';
import { urlPatterns } from './routes';
import { initializeDatabase } from './database';

dotenv.config()

const app: Express = express();

// App configs
app.use(express.json());
routesConf(app, urlPatterns); // Routes registerer util

// Initialize database
initializeDatabase()

// Setting server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
