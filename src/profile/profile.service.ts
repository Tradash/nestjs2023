import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TProfile } from "./types/profile.types";
import { IProfileResponse } from "./types/profileResponse.interface";
import { UserEntity } from "@app/user/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }
    async getProfile(currentUserId: number, profileUserName: string): Promise<TProfile> {
        const user = await this.userRepository.findOne({ where: { username: profileUserName } })
        if (!user) {
            throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND)
        }

        return { ...user, following: false }
    }
    buildProfileResponse(profile: TProfile): IProfileResponse {
        delete profile.email
        return { profile }
    }
}