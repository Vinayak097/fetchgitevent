import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
export const generateToken=(email)=>{
    return jwt.sign({email},process.env.JWT_SECRET);    
}   

