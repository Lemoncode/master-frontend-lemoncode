import passportGoogle from 'passport-google-oauth20';
import passportFacebook from 'passport-facebook';
import { envConstants } from '../env.constants';
import { User, profileRepository } from '../dals';

const googleStrategy = passportGoogle.Strategy;
const facebookStrategy = passportFacebook.Strategy;

export const configPassport = function (passport) {
  passport.use(
    new googleStrategy(
      {
        clientID: envConstants.GOOGLE_CLIENT_ID,
        clientSecret: envConstants.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const sessionExists = await profileRepository.userProfileExists(
          profile.id
        );
        if (sessionExists) {
          // Extract user logged in session from repository
          const user = await profileRepository.getUserByGoogleId(profile.id);
          done(null, user);
        } else {
          let user: User = {
            id: -1,
            googleId: profile.id,
            facebookId: undefined,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value,
            email: profile.emails[0].value,
          };

          // Create new session an store it into the repo
          user = await profileRepository.addNewUser(user);

          done(null, user);
        }
      }
    )
  );
  passport.use(
    new facebookStrategy(
      {
        clientID: envConstants.FACEBOOK_APP_ID,
        clientSecret: envConstants.FACEBOOK_APP_SECRET,
        callbackURL: '/api/facebook/callback'
      },
      async (accessToken, refreshToken, profile, done) => {
        const sessionExists = await profileRepository.userProfileExists(
          profile.id
        );
        if (sessionExists) {
          // Extract user logged in session from repository
          const user = await profileRepository.getUserByFacebookId(profile.id);
          done(null, user);
        } else {
          let user: User = {
            id: -1,
            googleId: undefined,
            facebookId: profile.id,
            displayName: profile.displayName,
            firstName: profile.displayName.split(' ')[0],
            lastName: profile.displayName.split(' ')[1],
            image: undefined,
            email: undefined,
          };

          // Create new session an store it into the repo
          user = await profileRepository.addNewUser(user);

          done(null, user);
        }
      }
    )
  );
};
