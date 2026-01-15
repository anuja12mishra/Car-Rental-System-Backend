import { Request } from "express";

// Request body types
export interface CreateBookingBody {
    carName: string;
    days: number;
    rentPerDay: number;
}

export interface UpdateBookingBody {
    carName?: string;
    days?: number;
    rentPerDay?: number;
    status?: 'booked' | 'completed' | 'cancelled';
}

// Response data types
export interface Booking {
    id: string;
    car_name: string;
    days: number;
    rent_per_day: number;
    status: 'booked' | 'completed' | 'cancelled';
    total_cost: number;
    created_at: string;
}

export interface BookingActionResponse {
    success: boolean;
    data: {
        message: string;
        bookingId?: string;
        totalCost?: number;
        booking?: Booking;
    };
}

export interface BookingListResponse {
    success: boolean;
    data: Booking[];
}

export interface BookingSummaryResponse {
    success: boolean;
    data: {
        userId?: string;
        username?: string;
        totalBookings?: number;
        totalAmountSpent?: number;
    };
}

export interface AuthRequest<
    P = {}, 
    ResBody = any, 
    ReqBody = any, 
    ReqQuery = any
> extends Request<P, ResBody, ReqBody, ReqQuery> {
    user?: {
        userId: string;
        username: string;
    };
}

export interface BookingQuery {
    bookingId?: string;
    summary?: string;
}
