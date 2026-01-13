import { UserToken } from "./User"
//request method types
export interface Booking{
    id:string,
    user_id:string,
    car_name:string,
    days:number,
    rent_per_day:number,
    status:'booked'|'compeleted'|'cancelled'
    created_at?:string
}
export interface Book_A_Car extends UserToken{
    car_name:string,
    days:number,
    rent_per_day:number,
}
export interface Booking_history extends UserToken{
    id:string,
    car_name:string,
    days:number,
    rent_per_day:number,
    status:'booked'|'compeleted'|'cancelled'
    created_at?:string,
    total_cost?:number
}
export interface User_Booking_Summary{
    id:string,
    username:string,
    total_bookings:number,
    totalAmountSpent:number
}
export interface total_booking_update extends UserToken{
    car_name?:string,
    days?:number,
    rent_per_day?:number,
}
