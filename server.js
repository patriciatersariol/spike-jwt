require("dotenv").config()

const cors = require("cors")
const express = require("express")
const app = express()

const jwt = require("jsonwebtoken")

app.use(express.json())
app.use(cors({ origin: "*" }))

app.post("/login", generateToken)

app.get("/hiring-process", authenticateToken, (req, res) => {
  res.json([
    {
      name: "2021/1",
      status: "Fechado"
    },
    {
      name: "2021/2",
      status: "Fechado"
    },
    {
      name: "2022/1",
      status: "Em preparação"
    }
  ])
})

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  const isAuthenticated = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err) => {
      return !err
    }
  )
  if (isAuthenticated) {
    next()
  } else {
    return res.sendStatus(401).json({ auth: "failed" })
  }
}

function generateToken(req, res) {
  const userAdmin = {
    name: "Juliane Martins",
    email: "ju@gmail.com",
    password: 1234
  }
  const user = { email: req.body.email, password: req.body.password }

  if (user.email != userAdmin.email || user.password != userAdmin.password) {
    return res.sendStatus(401).json({
      auth: false,
      message: "Usuário inválido"
    })
  }

  const payload = { name: userAdmin.name, email: userAdmin.email }
  const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
  return res.json({
    auth: true,
    accessToken: accessToken,
    user: payload
  })
}

app.listen(9000)
