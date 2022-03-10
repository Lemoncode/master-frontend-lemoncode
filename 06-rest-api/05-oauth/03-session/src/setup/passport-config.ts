import passportGoogle from 'passport-google-oauth20';
import { envConstants } from '../env.constants';
import { User, profileRepository } from '../dals';

const googleStrategy = passportGoogle.Strategy;

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

  // used to serialize the user for the session
  // Here we just save the ID it will be store in the express session object
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // used to deserialize the user
  // We get the id of the user from the express session object (previously serialized using SerializeUser)
  // now we restore that details from a permanent storage (in this case a mock memory storage, it could be mongo or whatever...)
  passport.deserializeUser(async (id, done) => {
    // retrieve user by Id
    // ID contains session Id numeber 1 first user added !!!
    // in some case :)
    let user: User = {
      id: -1,
      displayName: 'Anonymous',
      lastName: '',
      email: '',
      firstName: 'Anonymous',
      googleId: '',
      image: '',
    };
    if (profileRepository.userProfileExists(id)) {
      user = await profileRepository.getUser(id);
    }
    done(null, user);
  });
};
