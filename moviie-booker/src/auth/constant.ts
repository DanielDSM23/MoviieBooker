import * as dotenv from 'dotenv';
import * as process from "process";
dotenv.config();
export const jwtConstants = {
    secret: process.env.JWT_SECRET,
};