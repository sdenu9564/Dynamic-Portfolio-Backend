import express from 'express';
import middlewaresConfig from './config/middleware';
import ApiRoutes from './routes';

const app = express();

middlewaresConfig(app);
app.use('/api', ApiRoutes);

export default app;
