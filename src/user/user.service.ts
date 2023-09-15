import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { CreateUserDto } from "./dto/createUser.dto";
import { UserEntity } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { sign } from "jsonwebtoken"
import { JWT_SECRET, salt } from "@app/config";
import { IUserResponse } from "./types/userResponse.interface";
import { LoginUserDto } from "./dto/login.dto";
import { createHashWithSalt } from "@app/utils/createHashWithSalt";
import { UpdateUserDto } from "./dto/updateUser.dto";


@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {

    }
    async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
        const userByEmail = await this.userRepository.findOne({ where: { email: createUserDto.email } })
        const userByUsername = await this.userRepository.findOne({ where: { username: createUserDto.email } })

        if (userByEmail || userByUsername) {
            throw new HttpException('Email or username are taken', HttpStatus.UNPROCESSABLE_ENTITY)
        }
        const newUser = new UserEntity();
        Object.assign(newUser, createUserDto)
        return await this.userRepository.save(newUser)
    }

    async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        const user = await this.userRepository.findOne({ where: { email: loginUserDto.email }, select: ['id', 'username', 'email', 'bio', 'image', 'password'] })
        if (!user)
            throw new HttpException('Credential are not valid', HttpStatus.UNPROCESSABLE_ENTITY)

        const isPasswordCorrect = createHashWithSalt(loginUserDto.password, salt) === user.password
        if (!isPasswordCorrect)
            throw new HttpException('Credential are not valid', HttpStatus.UNPROCESSABLE_ENTITY)

        delete user.password

        return user
    }

    generateJwt(user: UserEntity): string {
        return sign({
            id: user.id,
            username: user.username,
            email: user.email
        }, JWT_SECRET)
    }
    buildUserResponse(user: UserEntity): IUserResponse {
        return {
            user: {
                ...user,
                token: this.generateJwt(user)
            }
        }
    }

    async findById(id: number): Promise<UserEntity> {
        return this.userRepository.findOne({ where: { id: id } })
    }

    async updateUser(userId: number, updateUserDto: UpdateUserDto): Promise<UserEntity> {
        const user = await this.findById(userId)
        Object.assign(user, updateUserDto)
        return await this.userRepository.save(user)
    }

}