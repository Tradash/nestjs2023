import { UserEntity } from "../user.entity";

export type TUser = Omit<UserEntity, "hashPassword">