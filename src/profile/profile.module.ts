import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import { TProfile } from "./types/profile.types";
import { IProfileResponse } from "./types/profileResponse.interface";
import { InjectRepository, TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@app/user/user.entity";
import { Repository } from "typeorm";
import { FollowEntity } from "./follow.entity";

@Module({ controllers: [ProfileController], providers: [ProfileService], imports: [TypeOrmModule.forFeature([UserEntity, FollowEntity])] })
export class ProfileModule {

}
