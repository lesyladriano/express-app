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

    @Column({ unique: true})
    email: string;

    @Column()
    password: string;

    @Column({nullable:true ,select:false})
    refreshToken: string;

    @Column({nullable:true })
    passwordResetToken: string;

    @Column({nullable:true, type: 'timestamp with time zone'})
    passwordResetExpires: Date;
}
