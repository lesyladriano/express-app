import e from 'cors';
import {body} from 'express-validator';
import { userRepository } from '../repositories';

export const userSchema =  [
    body('firstName').isAlpha().withMessage('First name must contain only alphabetic character'),
    body('middleName').isAlpha().withMessage('Middle name must contain only alphabetic character'),
    body('lastName').isAlpha().withMessage('Last name must contain only alphabetic character'),
    body('age').isInt().withMessage('Age must be a number').custom(value => {
        if (value  < 18 || value > 59) throw new Error('Age must be between 18 and 59');
    return true;
    }), 

    body('email')
        .isEmail()
        .withMessage('Email must be a valid email')
        .custom(async (value)=>{
            const user = await userRepository.findByEmail(value);
            console.log(user);

            if (user) {
            throw new Error('Email is taken');
               
        }
    }),
    body('password').isLength({min:6}).withMessage('Password must be atleast 6 characters long'),
    body("confirmPassword").custom((value, {req})=>{
        if(value !== req.body.password){
            throw new Error('Password does not match');
        }
        return true;
    }),
        
]; 