import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    middleName: string 

    @Column()
    lastName: string

    @Column()
    age: number

    @Column({nullable: true})
    email: string | null;

    @Column({nullable: true})
    password: string | null;
}
