import express from 'express';
import type { Request, Response } from 'express';

import cookieParser from 'cookie-parser';  // For JWT cookies
import { initDatabase } from './database/neonDB_connection';
import AuthRouter from './route/AuthRoute';
import BookingRoute from './route/BookingRoute';

const BaseUrl = '/api/v1';
const app = express();
const PORT = 3000;

// ✅ Express built-in middleware (replaces body-parser)
app.use(express.json({ limit: '10kb' }));                   
app.use(express.urlencoded({ extended: true }));             
app.use(cookieParser());                                   

// Database init
initDatabase();

// Routes
app.use(BaseUrl, AuthRouter);
app.use(BaseUrl, BookingRoute); 


app.get('/', (req: Request, res: Response) => {
    res.send('Car Rental System Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
