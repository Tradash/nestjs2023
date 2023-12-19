import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TProfile } from "./types/profile.types";
import { IProfileResponse } from "./types/profileResponse.interface";
import { UserEntity } from "@app/user/user.entity";
import { Repository } from "typeorm";
import { FollowEntity } from "./follow.entity";

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        @InjectRepository(FollowEntity)
        private readonly followRepository: Repository<FollowEntity>
    ) { }

    async getProfile(currentUserId: number, profileUsername: string): Promise<TProfile> {
        const user = await this.userRepository.findOne({ where: { username: profileUsername } })
        if (!user) {
            throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND)
        }

        const follow = currentUserId ? await this.followRepository.findOne({ where: { followerId: currentUserId, followingId: user.id } }) : false

        return { ...user, following: Boolean(follow) }
    }

    async followProfile(currentUserId: number, profileUsername: string): Promise<TProfile> {
        const user = await this.userRepository.findOne({ where: { username: profileUsername } })
        if (!user) {
            throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND)
        }

        if (currentUserId === user.id) {
            throw new HttpException('Follower and followng cant be equal', HttpStatus.BAD_REQUEST)
        }

        const follow = await this.followRepository.findOne({ where: { followerId: currentUserId, followingId: user.id } })

        if (!follow) {
            const followToCreate = new FollowEntity()
            followToCreate.followerId = currentUserId
            followToCreate.followingId = user.id
            await this.followRepository.save(followToCreate)
        }

        return { ...user, following: true }

    }

    async unfollowProfile(currentUserId: number, profileUsername: string): Promise<TProfile> {
        const user = await this.userRepository.findOne({ where: { username: profileUsername } })
        if (!user) {
            throw new HttpException('Profile does not exist', HttpStatus.NOT_FOUND)
        }

        if (currentUserId === user.id) {
            throw new HttpException('Follower and followng cant be equal', HttpStatus.BAD_REQUEST)
        }

        await this.followRepository.delete({ followerId: currentUserId, followingId: user.id })


        return { ...user, following: false }

    }

    buildProfileResponse(profile: TProfile): IProfileResponse {
        delete profile.email
        return { profile }
    }
}