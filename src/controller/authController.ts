import { NextFunction, Request, Response } from "express"
import { authRepository, userRepository } from "../repositories"
export class AuthController {
    static async create(request:Request, response:Response, next:NextFunction){
        const data = await authRepository.register(request.body);
        if(!data.success){
            return response.status(409).json({error:"Something Went Wrong BAKA!"})
        }
        return response.status(data.statusCode).json({
            accessToken:data.accessToken,
            refreshToken:data.refreshToken
        });
    }
    static async login(request:Request, response:Response, next:NextFunction){
        const data = await authRepository.login(request.body);
        if(!data.success){
            return  response.status(data.statusCode).json({error:data.error})
        }
        response.cookie('jwt',
        data.refreshToken, {
            httpOnly:true,
            maxAge:24 * 60 * 60 * 1000
        })
        return response.status(data.statusCode).json({
            accessToken:data.accessToken,
            refreshToken:data.refreshToken
        }); 
       
    }
    static async logout(request: Request, response: Response) {
        const refreshToken = request.cookies.jwt;
        if (!refreshToken) {
            return response.status(400).json({ error: "No JWT cookie found" });
        }
        // Attempt to clear the JWT cookie
        response.clearCookie("jwt", { httpOnly: true });
        return response.sendStatus(204);
    }
    static async changePassword(request: Request, response: Response){
        const {  
            currentPassword,
            newPassword,
            confirmPassword} = request.body;
    
    const email = request.user.email;
    
    const changePasswordData = {
        currentPassword, 
        newPassword, 
        confirmPassword, 
        email,
    };

   

    const result = await authRepository.changePassword(changePasswordData);

    if (!result.success){
    return response 
        .status(result.statusCode)
        .json({ error: result.error});
    }
    return response 
        .status(result.statusCode)
        .json({ messsage: result.message});
    }
    
    static async passwordResetEmail(request: Request, response: Response){
        const {email}=request.body
        const result = await authRepository.passwordResetEmail(email);
        console.log(email)
        console.log(result)
        
        if(!result.success){
            return response
                .status(result.statusCode)
                .json({error:result.error})
        }
        return response
                .status(result.statusCode)
                .json({message:result.message})
    }

    
}

