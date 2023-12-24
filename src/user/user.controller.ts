import { Body, Controller, Post, UsePipes, Get, Req, UseGuards, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/createUser.dto";
import { IUserResponse } from "./types/userResponse.interface";
import { LoginUserDto } from "./dto/login.dto";
import { Request } from "express";
import { IExpressRequest } from "./types/expressRequest.interface";
import { User } from "./decorators/user.decorator";
import { UserEntity } from "./user.entity";
import { AuthGuard } from "./guards/auth.guard";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { BackendValidationPipe } from "@app/shared/backendvalidation.pipe";

@Controller()
export class UserController {
    constructor(private readonly userService: UserService) { }
    @Post("users")
    @UsePipes(new BackendValidationPipe())
    async createUser(@Body("user") createUserDto: CreateUserDto): Promise<IUserResponse> {
        const user = await this.userService.createUser(createUserDto)
        return this.userService.buildUserResponse(user)
    }

    @Post('users/login')
    @UsePipes(new BackendValidationPipe())
    async login(@Body('user') loginUserDto: LoginUserDto): Promise<IUserResponse> {
        const user = await this.userService.login(loginUserDto)
        return this.userService.buildUserResponse(user)

    }

    @Get("users")
    @UseGuards(AuthGuard)
    async currentUser(@User() user: UserEntity): Promise<IUserResponse> {
        return this.userService.buildUserResponse(user)
    }

    @Put("users")
    @UseGuards(AuthGuard)
    async updateCurrentUser(@User("id") id: number, @Body("user") updateUserDto: UpdateUserDto): Promise<IUserResponse> {
        const user = await this.userService.updateUser(id, updateUserDto)
        return this.userService.buildUserResponse(user)
    }
}