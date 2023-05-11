import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-vkontakte';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class VKStrategy extends PassportStrategy(Strategy, 'vk') {

    constructor() {
        super({
            clientID: process.env.VK_CLIENT_ID,
            clientSecret: process.env.VK_SECRET,
            callbackURL: 'http://localhost:3006/auth/vk/redirect',
            scope: ['email', 'profile'],
        }, function (accessToken: string, refreshToken: string, params: any, profile: any, done: any) {
            const { displayName, emails } = profile;
            const user = { login: displayName, email: emails[0].value};
            done(null, user)
        });
    }
}