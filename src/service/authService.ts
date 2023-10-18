import { Repository } from "typeorm"
import { User } from "../entity/User"

export class UserService{
    constructor (private readonly userRepository:Repository<User>){};
    async findAll(){
        //Select All from User
        const users = await this.userRepository.find();
        return users;
    }

    async createUser(newuser:User){
        const user=this.userRepository.create(newuser)
        await this.userRepository.save(user);

        return user;
    }

}