// @ts-check

const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

const {
  FB_APP_ID,
  FB_CLIENT_SECRET,
  getUserAccessTokenForFacebookAccessToken,
} = require("./fb");

/**
 * @param {import('express').Express} app
 */
function setupFBAuth(app) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: FB_APP_ID,
        clientSecret: FB_CLIENT_SECRET,
        // callbackURL - 절대경로여야 함 (fullURL)
        // facebook 로그인 설정 > 클라이언트 OAuth 설정
        callbackURL:
          "https://8855-121-184-187-73.ngrok.io/passport/facebook/callback", // 유효한 OAuth redirect URI
      },
      (accessToken, refreshToken, profile, done) => {
        done(null, {
          facebook: {
            accessToken,
          },
        });
      }
    )
  );

  app.use(passport.initialize());

  // 직렬화
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  // 비직렬화
  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  app.get(
    "/passport/facebook",
    passport.authenticate("facebook", { session: false })
  );

  // 로그인 종료 시
  app.get(
    "/passport/facebook/callback",
    passport.authenticate("facebook", {
      session: false,
    }),
    async (req, res) => {
      // @ts-ignore
      const fbAccessToken = req.user?.facebook?.accessToken;
      // fbAccessToken이 있으면, 'get~Token' 함수 호출
      if (fbAccessToken) {
        const accessToken = await getUserAccessTokenForFacebookAccessToken(
          fbAccessToken
        );
        res.cookie("access_token", accessToken, {
          httpOnly: true,
          secure: true,
        });
        // 로그인 완료 시, 최종 redirect
        res.redirect("/");
      }
    }
  );
}

module.exports = setupFBAuth;
