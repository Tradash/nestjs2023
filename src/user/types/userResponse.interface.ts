import { UserEntity } from "../user.entity";
import { TUser } from "./user.type";

export interface IUserResponse {
    user: TUser & { token: string }
}