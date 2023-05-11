import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            callbackURL: 'http://localhost:3006/auth/google/redirect',
            scope: ['email', 'profile'],
        });
    }

    async validate (accessToken: string, refreshToken: string, profile: any): Promise<any> {
        const { displayName, emails } = profile;
        const user = { login: displayName, email: emails[0].value};
        return user;
    }
}