// @ts-check

const express = require('express')
const { FB_APP_ID } = require('../fb')

const router = express.Router()

router.get('/', (req, res) => {
  // @ts-ignore
  console.log('userId', req.userId);
  res.render('index', {
    // @ts-ignore
    userId: req.userId,
    APP_CONFIG_JSON: JSON.stringify({
      FB_APP_ID,
    }).replace(/"/g, '\\"'),
  })
})

router.get('/logout', (req, res) => {

})

module.exports = router
