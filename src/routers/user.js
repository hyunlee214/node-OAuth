// @ts-check

const express = require('express')
const { getUserAccessTokenForFacebookAccessToken } = require('../fb')

const router = express.Router()

router.post('/auth/facebook', async (req, res) => {
  const { access_token: fbUserAccessToken } = req.query

  if (typeof fbUserAccessToken !== 'string') {
    res.sendStatus(400)
    return
  }

  // facebook 액세스 토큰에 해당하는 우리 서비스 유저의 액세스 토큰을 가져옴
  const userAccessToken = await getUserAccessTokenForFacebookAccessToken(
    fbUserAccessToken
  )

  res.cookie('access_token', userAccessToken, {
    httpOnly: true,
    secure: true,
  })
  res.sendStatus(200)
})

module.exports = router
