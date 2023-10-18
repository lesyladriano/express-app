
import { NextFunction, Request, Response } from "express"

export function validateId(
    request: Request, 
    response: Response, 
    next: NextFunction
) {
    const id = request.params.id
    if(isNaN(id)){
    return response.status(400).send({error:'Id must be a number'});
}
next();
}