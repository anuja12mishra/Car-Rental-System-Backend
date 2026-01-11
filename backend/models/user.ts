import { NeonQueryFunction } from "@neondatabase/serverless";

export const createUsersTable = async (sql: NeonQueryFunction<any, any>) => {
    // 1. Create Extension (if needed)
    await sql`CREATE EXTENSION IF NOT EXISTS pgcrypto`;

    // 2. Create Table
    await sql`
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            username VARCHAR(100) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
        )
    `;

    // 3. Create Index (Removed CONCURRENTLY to prevent transaction errors)
    await sql`CREATE INDEX IF NOT EXISTS idx_user_name ON users(username)`;
}