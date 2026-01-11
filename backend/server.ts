import express from 'express';
import type { Request,Response } from 'express';
const app = express();
const PORT = 3000;

app.get('/', (req:Request, res:Response) => {
    res.send('Car Rental System Backend is running!');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});