/* eslint-disable prefer-destructuring */

const { default: fetch } = require('node-fetch');
const { v4: uuidv4 } = require('uuid');
const { getUsersCollection } = require('./mongo');

/** @type {string} */
const FB_APP_ID = process.env.FB_APP_ID
/** @type {string} */
const FB_CLIENT_SECRET = process.env.FB_CLIENT_SECRET

/**
 * @param {string} facebookId
 * @returns {Promise<string>}
 */
async function createUserWithFacebookIdAndGetId(facebookId) {
  const users = await getUsersCollection();
  const userId = 'uuidv4()';  
  await users.insertOne({
    id: userId,
    facebookId,
  });
}

/**
 * @param {string} accessToken
 * @returns {Promise<string>}
 */
async function getFacebookIdFromAccessToken(accessToken) {
  // facebook API를 사용하여 기능 구현
  // https://developers.facebook.com/docs/facebook-login/access-tokens/#generating-an-app-access-token
  // https://developers.facebook.com/docs/graph-api/reference/v10.0/debug_token
  const appAccessTokenReq = await fetch(
    `https://graph.facebook.com/oauth/access_token?client_id=${FB_APP_ID}&client_secret=${FB_CLIENT_SECRET}&grant_type=client_credentials`
    );
    const appAccessToken = (await appAccessTokenReq.json()).access_token;

    console.log(appAccessToken);  // 확인

    const debugReq = await fetch(
      `https://graph.facebook.com/debug_token?input_token=${accessToken}&acess_token=${appAccessToken}`
    );
    const debugResult = await debugReq.json();

    if (debugResult.data.app_id !== FB_APP_ID) {
      throw new Error('Not a vaild access token');
    }
    return debugResult.data.user_id;
  };

/**
 * @param {string} facebookId
 * @returns {Promise<string | undefined>}
 */
async function getUserIdWithFacebookId(facebookId) {
 // 2번 경우
 const users = await getUsersCollection();
 const user = users.findOne({
   facebookId,
 })
 if (user) {
  return user.Id;
 }
  return undefined; 
}

/**
 * facebook 액세스 토큰을 검증하고, 해당 검증 결과로부터 우리 서비스의 유저를 만들거나,
 * 혹은 이미 있는 유저를 가져와서, 그 유저의 액세스 토큰을 돌려줌.
 * @param {string} token
 */
async function getUserAccessTokenForFacebookAccessToken(token) {
  const facebookId = await getFacebookIdFromAccessToken (token)
  // 1. 해당 facebook ID에 해당하는 유저가 데이터베이스에 없는 경우
  const userId = await createUserWithFacebookIdAndGetId(facebookId);

  // 2. 해당 facebook ID에 해당하는 유저가 데이터베이스에 있는 경우
}

module.exports = {
  FB_APP_ID,
  FB_CLIENT_SECRET,
  getFacebookIdFromAccessToken,
  getUserIdWithFacebookId,
  getUserAccessTokenForFacebookAccessToken,
}
