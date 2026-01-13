import { Request } from "express";
//request method types
export interface User extends Request{
    id?:string,
    username:string,
    password:string,
    created_at?:string
}
export interface UserToken extends Request{
    id:string,
    username:string
}