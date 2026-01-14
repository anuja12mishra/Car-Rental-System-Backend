import express from 'express';
import type { Request,Response } from 'express';
import bodyParser from 'body-parser'
const BaseUrl:string ='/api/v1'; 
//App import
import {initDatabase} from './database/neonDB_connection';
import AuthRouter from './route/AuthRoute';


const app = express();
const PORT = 3000;

//middleware
app.use(bodyParser);

//running initial database query
initDatabase();


//Routes
app.use(BaseUrl,AuthRouter);
app.get('/', (req:Request, res:Response) => {
    res.send('Car Rental System Backend is running!');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});