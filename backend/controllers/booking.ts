import { Request, Response } from "express";
import { authenticateToken, type AuthRequest } from "../middleware/Auth";
import {
    createBooking, getUserBookings, updateBooking, deleteBooking
} from "../models/booking-db-oparation";
import {
    CreateBookingBody,
    UpdateBookingBody,
    BookingActionResponse,
    BookingListResponse,
    BookingSummaryResponse,
    BookingQuery
} from "../types/booking";

export const createBookingHandler = [
    authenticateToken,
    async (
        req: AuthRequest<{}, {}, CreateBookingBody>,
        res: Response<BookingActionResponse>
    ) => {
        const userId = req.user!.userId;
        const { carName, days, rentPerDay } = req.body;

        // Business rules validation
        if (!carName || days > 365 || days < 1 || rentPerDay > 2000 || rentPerDay < 0) {
            return res.status(400).json({
                success: false,
                data: { message: "Invalid inputs" }
            });
        }

        try {
            const totalCost = days * rentPerDay;
            const bookingId = await createBooking(userId, { carName, days, rentPerDay });

            res.status(201).json({
                success: true,
                data: {
                    message: "Booking created successfully",
                    bookingId,
                    totalCost
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: { message: "Server error" }
            });
        }
    }
];

export const getBookingsHandler = [
    authenticateToken,
    async (
        req: AuthRequest<{}, {}, {}, BookingQuery>,
        res: Response<any>  // Generic response for multiple return types
    ) => {
        const userId = req.user!.userId;
        const { bookingId, summary } = req.query;

        try {
            if (bookingId) {
                const booking = await getUserBookings(userId, bookingId as string);
                if (!booking) {
                    return res.status(404).json({
                        success: false,
                        data: { message: "Booking not found" }
                    });
                }
                return res.json({ success: true, data: [booking] });
            }

            if (summary === 'true') {
                const summaryData = await getUserBookings(userId, undefined, true) as any;
                return res.json({
                    success: true,
                    data: {
                        userId,
                        username: req.user!.username,
                        totalBookings: Number(summaryData?.totalBookings || 0),
                        totalAmountSpent: Number(summaryData?.totalAmountSpent || 0)
                    }
                });
            }

            const bookings = await getUserBookings(userId);
            res.json({ success: true, data: bookings });

        } catch (error) {
            res.status(500).json({
                success: false,
                data: { message: "Server error" }
            });

        }
    }
];

export const updateBookingHandler = [
    authenticateToken,
    async (
        req: AuthRequest<{ bookingId: string }, {}, UpdateBookingBody>, 
        res: Response<BookingActionResponse>
    ) => {
        const userId = req.user!.userId;
        const { bookingId } = req.params;
        const updateData: any = { ...req.body };

        // Validate business rules
        if (updateData.days !== undefined && (updateData.days > 365 || updateData.days < 1)) {
            return res.status(400).json({
                success: false,
                data: { message: "Days must be between 1-365" }
            });
        }
        if (updateData.rentPerDay !== undefined && (updateData.rentPerDay > 2000 || updateData.rentPerDay < 0)) {
            return res.status(400).json({
                success: false,
                data: { message: "Invalid rent per day" }
            });
        }

        // Validate full update requires all fields
        if (updateData.carName || updateData.rentPerDay !== undefined) {
            if (!updateData.carName || updateData.days === undefined || updateData.rentPerDay === undefined) {
                return res.status(400).json({
                    success: false,
                    data: { message: "carName, days, and rentPerDay all required for full updates" }
                });
            }
        }

        try {
            const updatedBooking = await updateBooking(userId, bookingId, updateData);
            if (!updatedBooking) {
                return res.status(404).json({
                    success: false,
                    data: { message: "Booking not found or invalid update" }
                });
            }

            res.status(200).json({
                success: true,
                data: {
                    message: "Booking updated successfully",
                    booking: updatedBooking
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: { message: "Server error" }
            });
        }
    }
];



export const deleteBookingHandler = [
    authenticateToken,
    async (
        req: AuthRequest<{ bookingId: string }>,
        res: Response<BookingActionResponse>
    ) => {
        const userId = req.user!.userId;
        const { bookingId } = req.params;

        try {
            const deleted = await deleteBooking(userId, bookingId);
            if (!deleted) {
                return res.status(404).json({
                    success: false,
                    data: { message: "Booking not found" }
                });
            }

            res.status(200).json({
                success: true,
                data: { message: "Booking deleted successfully" }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                data: { message: "Server error" }
            });
        }
    }
];
