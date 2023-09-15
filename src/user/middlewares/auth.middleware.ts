import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { IExpressRequest } from "../types/expressRequest.interface";
import { verify } from 'jsonwebtoken'
import { JWT_SECRET } from "@app/config";
import { UserService } from "../user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly userService: UserService) { }
    async use(req: IExpressRequest, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            req.user = null
            next()
            return
        }

        const token = req.headers.authorization.split(" ")[1]
        console.log('token', token)

        try {
            const decode = verify(token, JWT_SECRET)
            console.log('decode', decode)
            const user = await this.userService.findById(decode.id)
            req.user = user
        } catch (err) {
            req.user = null

        }
        next()


    }
}