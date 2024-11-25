import express, { Express } from 'express';
import dotenv from 'dotenv'

import { routesConf } from './utils/routeUtils';
import { routes } from './routes';

dotenv.config()


const app: Express = express();

// App configs
app.use(express.json());
routesConf(app, routes); // Routes registerer util

// Setting server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


export default app;
