import { Repository } from "typeorm"
import { User } from "../entity/User"
import * as bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken';
import "dotenv/config";
export class AuthService{
    
    constructor (private readonly userRepository:Repository<User>){}

    async register(newuser:User){

        const hashPassword =await bcrypt.hash(newuser.password,10);
        const user=this.userRepository.create(newuser)
        user.password=hashPassword;
        await this.userRepository.save(user);
        delete user.password;
        const accessToken = jwt.sign(
            {id: user.id, email: user.email}, 
            process.env.JWT_SECRET, 
            {
                expiresIn: '15m',
            });
            const refreshToken = jwt.sign(
                {id: user.id, email: user.email}, 
                process.env.JWT_SECRET, 
                {
                    expiresIn: 24 * 60 * 60 * 1000,
                });
                return{
                    accessToken,
                    refreshToken,
                    statusCode: 201,
                    success: true,
        
                };
    }

    async findByEmail(email: string) {
        const user = await this.userRepository.findOne({where:{ email }});
        
        return user;
    }

    async login(credentials: Partial<User> ){
        const {email, password} = credentials
        const user = await this.userRepository.findOne({where:{ email }});
        if(!user) {
            return {
                error: "No Record Found",
                statusCode: 404,
                success: false
            }
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return {
            error: "Invalid Credentials",
            statusCode: 400,
            success: false
        }
    }
   //generate jwt
   const accessToken = jwt.sign(
    {id: user.id, email: user.email}, 
    process.env.JWT_SECRET, 
    {
        expiresIn: '15m',
    });
    const refreshToken = jwt.sign(
        {id: user.id, email: user.email}, 
        process.env.JWT_SECRET, 
        {
            expiresIn: 24 * 60 * 60 * 1000,
        });

        return{
            accessToken,
            refreshToken,
            statusCode: 200,
            success: true,

        };
    }
}