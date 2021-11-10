require("dotenv").config()

const cors = require("cors")
const express = require("express")
const app = express()

const jwt = require("jsonwebtoken")

app.use(express.json())
app.use(cors({ origin: "*" }))

// const page = "Página autorizada!"
// app.get("/page", authenticateTokenMid, (req, res) => {
//   res.json(userAdmin)
// })

app.post("/login", generateToken)
app.get("/hiring-process", authenticateToken, (req, res) => {
  res.json(["banana", "maçã"])
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  const verified = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.json(err)
      return !err
    }
  )
  if (verified) {
    next()
  }
  return res.sendStatus(401).json({ auth: "failed" })
}

function generateToken(req, res) {
  const userAdmin = { email: "ju@gmail.com", password: 1234 }

  const user = { email: req.body.email, password: req.body.password }

  if (user.email != userAdmin.email || user.password != userAdmin.password) {
    return res.sendStatus(401).json({
      auth: false,
      message: "Usuário inválido"
    })
  }

  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  return res.json({
    auth: true,
    accessToken: accessToken
  })
}

app.listen(9000)
