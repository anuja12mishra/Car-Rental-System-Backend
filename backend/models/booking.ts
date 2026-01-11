import { NeonQueryFunction } from "@neondatabase/serverless";

export const createBookingsTable = async (sql: NeonQueryFunction<any, any>) => {
    // 1. Create Table
    await sql`
        CREATE TABLE IF NOT EXISTS bookings (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            car_name VARCHAR(100) NOT NULL,
            days INTEGER NOT NULL CHECK (days > 0),
            rent_per_day DECIMAL(10,2) NOT NULL CHECK (rent_per_day >= 0),
            status VARCHAR(20) NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'completed', 'cancelled')),
            created_at TIMESTAMPTZ DEFAULT NOW()
        )
    `;

    // 2. Create Indexes (Split for safety)
    await sql`CREATE INDEX IF NOT EXISTS idx_user_bookings ON bookings(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_status_date ON bookings(status, created_at)`;
}