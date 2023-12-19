import { User } from "@app/user/decorators/user.decorator";
import { Controller, Get, Param } from "@nestjs/common";
import { IProfileResponse } from "./types/profileResponse.interface";
import { ProfileService } from "./profile.service";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "@app/user/user.entity";
import { Repository } from "typeorm";
import { TProfile } from "./types/profile.types";

@Controller('profiles')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }
    @Get(':username')
    async getProfile(@User('id') currentUserId: number, @Param('username') profileUserName: string): Promise<IProfileResponse> {
        const profile = await this.profileService.getProfile(currentUserId, profileUserName);
        return this.profileService.buildProfileResponse(profile)
    }
}
