const express = require('express')
const app = new express()
require('dotenv').config()
const jwt = require('jsonwebtoken')

app.use(express.json())

const posts = [
  {
    username: 'sairambalu',
    password: '123',
  },
  {
    username: 'balusairam',
    password: '123',
  },
]

app.get('/posts', validatetoken, (req, res) => {
  res.json(posts.filter((post) => post.username === req.user.name))
})

app.post('/login', (req, res) => {
  //Authenticate User
  const username = req.body.username
  const user = { name: username }
  const accesstoken = jwt.sign(user, process.env.TOKEN_KEY)
  res.json({ accesstoken: accesstoken })
})

function validatetoken(req, res, next) {
  const authheader = req.headers['authorisation']
  const token = authheader && authheader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`)
})
