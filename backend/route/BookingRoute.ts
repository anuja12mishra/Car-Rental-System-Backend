import { Router } from 'express';
import { 
    createBookingHandler, 
    getBookingsHandler, 
    updateBookingHandler, 
    deleteBookingHandler 
} from '../controllers/booking';

const router = Router();

router.post('/bookings', createBookingHandler);
router.get('/bookings', getBookingsHandler);
router.put('/bookings/:bookingId', updateBookingHandler);
router.delete('/bookings/:bookingId', deleteBookingHandler);

export default router;
