import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import type { Request } from "express";

import { Env } from "./env.config";
import { findByIdUserService } from "../services/user.service";
import { UnauthorizedException } from "../utils/app-error";

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req.cookies.accessToken;
          if (!token) {
            throw new UnauthorizedException("Unauthorized");
          }
          return token;
        },
      ]),
      secretOrKey: Env.JWT_SECRET,
      audience: ["user"],
      algorithms: ["HS256"],
    },
    async ({ userId }, done) => {
      try {
        const user = userId && (await findByIdUserService(userId));
        return done(null, user || false);
      } catch (error) {
        return done(null, false);
      }
    }
  )
);

export const passportAuthenticateJwt = passport.authenticate("jwt", {
  session: false,
});
