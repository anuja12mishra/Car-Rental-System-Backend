import sql from "../database/neonDB_connection";

export async function createBooking(userId: string, bookingData: {
    carName: string; days: number; rentPerDay: number
}): Promise<string> {
    const { carName, days, rentPerDay } = bookingData;
    const totalCost = days * rentPerDay;
    
    const result = await sql`
        INSERT INTO bookings (user_id, car_name, days, rent_per_day, status, total_cost)
        VALUES (${userId}, ${carName}, ${days}, ${rentPerDay}, 'booked', ${totalCost})
        RETURNING id
    `;
    return result[0].id;
}

export async function getUserBookings(userId: string, bookingId?: string, summary = false) {
    if (bookingId) {
        const result = await sql`
            SELECT * FROM bookings 
            WHERE user_id = ${userId} AND id = ${bookingId} AND status IN ('booked', 'completed')
        `;
        return result[0] || null;
    }
    
    if (summary) {
        const result = await sql`
            SELECT 
                COUNT(*)::integer as totalBookings,
                COALESCE(SUM(total_cost), 0)::numeric as totalAmountSpent
            FROM bookings 
            WHERE user_id = ${userId} AND status IN ('booked', 'completed')
        `;
        return result[0];  // ✅ Now properly typed
    }
    
    const result = await sql`
        SELECT id, car_name, days, rent_per_day, status, total_cost
        FROM bookings 
        WHERE user_id = ${userId} AND status IN ('booked', 'completed')
        ORDER BY created_at DESC
    `;
    return result;
}


export async function updateBooking(
    userId: string, 
    bookingId: string, 
    updateData: any
): Promise<any | null> {
    // 1. STATUS ONLY update
    if (updateData.status !== undefined && !updateData.carName && !updateData.days && !updateData.rentPerDay) {
        const result = await sql`
            UPDATE bookings 
            SET status = ${updateData.status}
            WHERE id = ${bookingId} AND user_id = ${userId}
            RETURNING *
        `;
        return result[0] || null;
    }

    // 2. DAYS ONLY - fetch existing and recalculate total_cost
    if (updateData.days !== undefined && !updateData.carName && !updateData.rentPerDay) {
        const existing = await sql`
            SELECT rent_per_day FROM bookings 
            WHERE id = ${bookingId} AND user_id = ${userId}
        `;
        if (existing.length === 0) return null;
        
        const result = await sql`
            UPDATE bookings 
            SET days = ${updateData.days}, total_cost = ${updateData.days * existing[0].rent_per_day}
            WHERE id = ${bookingId} AND user_id = ${userId}
            RETURNING *
        `;
        return result[0] || null;
    }

    // 3. FULL UPDATE - all fields required
    if (updateData.carName && updateData.days !== undefined && updateData.rentPerDay !== undefined) {
        const result = await sql`
            UPDATE bookings 
            SET 
                car_name = ${updateData.carName},
                days = ${updateData.days},
                rent_per_day = ${updateData.rentPerDay},
                total_cost = ${updateData.days * updateData.rentPerDay}
            WHERE id = ${bookingId} AND user_id = ${userId}
            RETURNING *
        `;
        return result[0] || null;
    }

    return null; // Invalid update pattern
}


export async function deleteBooking(userId: string, bookingId: string) {
    const result = await sql`
        DELETE FROM bookings 
        WHERE id = ${bookingId} AND user_id = ${userId}
        RETURNING id
    `;
    return result.length > 0;
}
