import { Repository } from "typeorm"
import { User } from "../entity/User"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { changePassword, resetPassword } from "../interface";
import { resetEmailTemplate } from "../mailer/resetPasswordTemplate";
import { transporter } from "../mailer/transporter";
import https from 'https'; // Import the 'https' module

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
    async logout(refreshToken:string){
        const user = await this.userRepository.findOne({where: {refreshToken:refreshToken}})
        const foundUser = user?.refreshToken === refreshToken

        if(!foundUser){
            return{
                error: 'You are not logged in',
                statusCode: 400,
                success: false,
            };
        }
        const clearRefreshToken = {...user, refreshToken: ''}
        await this.userRepository.save(clearRefreshToken)
        return{
            success: true,
        };
    } 

    //current password, new password, confirm password, email
    async changePassword(args: changePassword) {
        const user = await this.userRepository.findOne({where:{ email: args.email }});
        if(!user){
            return {
                error: "No Record Found with this email",
                statusCode: 400,
                success: false,
            };
        }

        const verifyPassword = await bcrypt.compare(args.currentPassword, user.password)
        if(!verifyPassword){
            return {
                error: "Incorrect current password ",
                statusCode: 400,
                success: false,
            };
        }
        if (args.newPassword !== args.confirmPassword) {
            return {
                error: "new password and confirm password does not match ",
                statusCode: 400,
                success: false,
            };
        }
        const hashedPassword = await bcrypt.hash(args.newPassword, 10);
        user.password = hashedPassword
        await this.userRepository.save(user);
        return {
                message: "paassword changed successfully ",
                statusCode: 200,
                success: true,
            };
    }
    //email -> send code
    //handle send code
    //handle resert password -> code 
    //setup email to accept node mailer -> password

    async passwordResetEmail(email: string) {
        try {
            const user = await this.userRepository.findOne({ where: { email } });
            
            if (!user) {
                return {
                    error: "No record found for the provided email address.",
                    statusCode: 400,
                    success: false,
                };
            }
    
            const passwordResetToken = Math.random().toString(36).substring(2);
            user.passwordResetToken = passwordResetToken;
            user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 Hour
            await this.userRepository.save(user);
    
            const mailOption = {
                from: 'Lesyl <no-reply@lesyl.com>',
                to: email,
                subject: 'Password Reset Code',
                token: passwordResetToken,
                html: resetEmailTemplate(passwordResetToken),
            };
    
            const httpsOptions = {
                rejectUnauthorized: false, // Accept self-signed certificates
            };
    
            const sendResult = await transporter.sendMail(mailOption);
    
            if (sendResult.accepted.length === 0) {
                return {
                    error: "Failed to send the password reset token via email.",
                    statusCode: 400,
                    success: false,
                };
            }
    
            return {
                message: "Email sent successfully.",
                statusCode: 200,
                success: true,
            };
        } catch (error) {
            // Handle unexpected errors here
            console.error("An error occurred:", error);
            return {
                error: "An unexpected error occurred while processing your request.",
                statusCode: 500,
                success: false,
            };
        }
    }

    //token, email, password, confirmpassword
    async resetPassword(args: resetPassword){
        const {token, email, password, confirmPassword} = args
        const user = await this.userRepository.findOne({
            where: {email}, 
        });
        if (!user) {
            return {
                error: "No Record Found with this email",
                statusCode: 400,
                success: false,
            };
        }

        //password
        if(password !== confirmPassword){
            return{
                error: "Password does not match",
                statusCode: 400,
                success: false,
            };
        }
    }

}
