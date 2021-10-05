/* eslint-disable prefer-destructuring */

const { default: fetch } = require("node-fetch");
const { v4: uuidv4 } = require("uuid");
const { getAccessTokenForUserId } = require("./auth");
const { getUsersCollection } = require("./mongo");

/** @type {string} */
const FB_APP_ID = process.env.FB_APP_ID;
/** @type {string} */
const FB_CLIENT_SECRET = process.env.FB_CLIENT_SECRET;

/**
 * @param {string} facebookId
 * @param {string} name
 * @returns {Promise<string>}
 */
async function createUserWithFacebookProfileAndGetId({
  id: facebookId,
  name,
  picture,
}) {
  const users = await getUsersCollection();
  const userId = uuidv4();
  await users.insertOne({
    id: userId,
    facebookId,
    name,
    picture,
  });
  return userId;
}

/**
 * @param {string} accessToken
 * @returns {Promise<string>}
 */
async function getFacebookProfileFromAccessToken(accessToken) {
  // facebook API를 사용하여 기능 구현
  // https://developers.facebook.com/docs/facebook-login/access-tokens/#generating-an-app-access-token
  // https://developers.facebook.com/docs/graph-api/reference/v10.0/debug_token
  const appAccessTokenReq = await fetch(
    `https://graph.facebook.com/oauth/access_token?client_id=${FB_APP_ID}&client_secret=${FB_CLIENT_SECRET}&grant_type=client_credentials`
  );
  const appAccessToken = (await appAccessTokenReq.json()).access_token;

  const debugReq = await fetch(
    `https://graph.facebook.com/debug_token?input_token=${accessToken}&access_token=${appAccessToken}`
  );
  const debugResult = await debugReq.json();

  if (debugResult.data.app_id !== FB_APP_ID) {
    throw new Error("Not a vaild access token");
  }

  // https://developers.facebook.com/docs/graph-api/overview 참고
  const facebookId = debugResult.data.user_id;

  const profileRes = await fetch(
    `https://graph.facebook.com/${facebookId}?fields=id,name,picture&access_token=${accessToken}`
  );
  return profileRes.json();
}

/**
 * @param {string} facebookId
 * @returns {Promise<string | undefined>}
 */
async function getUserIdWithFacebookId(facebookId) {
  // 2번 경우
  const users = await getUsersCollection();
  const user = await users.findOne({
    id: facebookId,
  });

  if (user) {
    return user.id;
  }
  return undefined;
}

/**
 * facebook 액세스 토큰을 검증하고, 해당 검증 결과로부터 우리 서비스의 유저를 만들거나,
 * 혹은 이미 있는 유저를 가져와서, 그 유저의 액세스 토큰을 돌려줌.
 * @param {string} token
 */
async function getUserAccessTokenForFacebookAccessToken(token) {
  const fbProfile = await getFacebookProfileFromAccessToken(token);
  const { facebookId } = fbProfile;

  // console창 test

  const existingUserId = await getUserIdWithFacebookId(facebookId);

  // 2. 해당 facebook ID에 해당하는 유저가 데이터베이스에 있는 경우
  if (existingUserId) {
    return getAccessTokenForUserId(existingUserId);
  }

  // 1. 해당 facebook ID에 해당하는 유저가 데이터베이스에 없는 경우
  const userId = await createUserWithFacebookProfileAndGetId(fbProfile);
  return getAccessTokenForUserId(userId);
}

module.exports = {
  FB_APP_ID,
  FB_CLIENT_SECRET,
  getFacebookProfileFromAccessToken,
  getUserIdWithFacebookId,
  getUserAccessTokenForFacebookAccessToken,
};
