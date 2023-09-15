import { Body, Controller, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUser.dto";
import { IUserResponse } from "./types/userResponse.interface";
import { LoginUserDto } from "./dto/login.dto";

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Post("users")
    @UsePipes(new ValidationPipe())
    async createUser(@Body("user") createUserDto: CreateUserDto): Promise<IUserResponse> {
        console.log(createUserDto)
        const user = await this.userService.createUser(createUserDto)
        return this.userService.buildUserResponse(user)
    }

    @Post('users/login')
    @UsePipes(new ValidationPipe())
    async login(@Body('user') loginUserDto: LoginUserDto): Promise<IUserResponse> {
        const user = await this.userService.login(loginUserDto)
        return this.userService.buildUserResponse(user)

    }
}