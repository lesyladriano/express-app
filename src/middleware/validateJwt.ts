
import { NextFunction, Request, Response } from "express"
import { verify } from "jsonwebtoken";

export function validateJwt(
    request: Request, 
    response: Response, 
    next: NextFunction
) {
    const authHeader = request.headers.authorization
    if (!authHeader ||!authHeader.startsWith('Bearer ')) { //[Bearer, asdasfkeskdjlskflkfjdlgkjdkgl]
        return response
            .status(401)
            .send({error: "Unauthorized: Missing or invalid token"}); 
}
const token = authHeader.split(' ')[1]

try {
const decode = verify(token, process.env.JWT_SECRET);
request.user = decode;
next();
} catch (error) {
     if (error.name ==="JsonWebTokenError"){
        return response
            .status(401)
            .send({error: "Unauthorized: Missing or invalid token"}); 
     }
     else if(error.name === "TokenExpiredError"){
        return response
            .status(401)
            .send({error: "Unauthorized: Token Expired"}); 
}
return response
            .status(500)
            .send({error: "Internal Server Error: Invalid token"}); 
}

}
