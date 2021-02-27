const express = require('express')
const app = new express()
require('dotenv').config()
const jwt = require('jsonwebtoken')

app.use(express.json())

var refreshtokens = []
app.post('/token', (req, res) => {
  const refreshtoken = req.body.token
  if (refreshtoken == null) return res.sendStatus(401)
  if (!refreshtokens.includes(refreshtoken)) return res.sendStatus(403)
  jwt.verify(refreshtoken, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403)
    const accesstoken = generateAccessToken({ name: user.name })
    res.json({ accesstoken: accesstoken })
  })
})

app.post('/login', (req, res) => {
  //Authenticate User
  const username = req.body.username
  const user = { name: username }
  const accesstoken = generateAccessToken(accesstoken)
  const refreshtoken = jwt.sign(user, process.env.REFRESH_TOKEN)
  res.json({ accesstoken: accesstoken, refreshtoken: refreshtoken })
})

function generateAccessToken(user) {
  return jwt.sign(user, process.env.TOKEN_KEY, { expiresIn: '15s' })
}
const port = 4000
app.listen(port, () => {
  console.log(`Server running on ${port}`)
})
