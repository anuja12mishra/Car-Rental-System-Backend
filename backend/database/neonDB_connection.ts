import 'dotenv/config'; 
import { neon } from "@neondatabase/serverless";

// Import the functions instead of strings
import { createUsersTable } from '../models/user';
import { createBookingsTable } from '../models/booking';

const sql = neon(process.env.DATABASE_URL as string);
console.log("Connected to Neon DB");

export const initDatabase = async () => {
    try {
        console.log('Initializing database...');

        const result = await sql`SELECT version()`;
        console.log('Neon Postgres version:', result[0].version);

        // Execute the imported functions
        await createUsersTable(sql);
        await createBookingsTable(sql);

        console.log('✅ Database tables ready!');
    } catch (error) {
        console.error('❌ Database init failed:', error);
        throw error;
    }
};

export default sql;