require("dotenv").config()
//import cors from 'cors'
const cors = require('cors')
const express = require("express")
const app = express()

//consegue gerar tokens e verificar tokens
//gera apos um login sucedido levando pro usuário e verifica sempre que esse usuário enviar um token junto a requisição
//caso nao envie o token com a requisição nao vai permitir ter acesso aquela rota
const jwt = require("jsonwebtoken")

app.use(express.json())
app.use(cors({ origin: '*' }))
const page = 'Página autorizada!'


app.get("/page", authenticateToken, (req, res) => {
  res.json(page)
})

app.post("/login", (req, res) => {

  const user = { email: req.body.email, password: req.body.password }
  const userAdmin = { email: 'ju@gmail.com', password: 1234 }

  if (user.email == userAdmin.email && user.password == userAdmin.password) {
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    return res.json({ accessToken: accessToken })
  }

  return res.json({ message: 'usuário inválido' })
  //autenticacao é garantir que vocÊ é vocÊ mesmo
  //autorização é garantir que vocÊ tem permissao para fazer alguma coisa dentro da aplicação 

  //envia no body da requisiçao os dados 

  //se o login bateu, vai ser "assinado" um JWT em três partes
  //algumas informações do JWT
  //payload que são algumas informações que permite identificar alguas informações desse usuário depois
  // assinatura digital que é algo que somente o servido vai conseguir fazer com a secret que é a senha para fazer a assinatura digital
  //essa assinatura digital que garante a autenticidade do token
  //1º passa o payload: alguma informação que permite identificar o usuário qual é o usuário que ta fazendo requisição, ideal é nao colocar muitos dados e nem dados sensíveis para nao expor informações da sua aplicação
  //depois de verificar no banco de dados que existe, retorna um ID e coloca dentro do token para que quando novas requições forem feitas poder pegar o token jwt  e verificar que essa pessoa quer acessar 
  //passa a secret que é a senha utilizada para assinatura digital essa senha pode guardar numa variavel de ambiente onde quiser 
  //retorna um objeto token

  // na resposta da requisição passa a variavel token que o front ou usuario vai ter que guardar porque toda requição vai ter uqe mandar esse token de novo


})

// vai esperar por parametro req ou res 
//funciona como um middlewere 
function authenticateToken(req, res, next) {

  //vai pegar um token que ta no req.headers e passar o cabeçalho que quer 
  //qualquer cabeçalho funciona (authorization ou x-acess-token)
  const authHeader = req.headers["authorization"]

  const token = authHeader && authHeader.split(" ")[1]
  if (token === null) return res.sendStatus(401)

  //usar verify para verificar o token passando o secret, usa para assinar e verificar a validade de um token
  //terceiro parametro é uma callback que pode ter erro ou o token decodificado
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {

    if (err) return res.sendStatus(401) //se der erro retorna token invalido ou ausente
    //req.user.email = decoded.email
    //caso contrario  o objeto user vem preenchido com o payload do jwt informaçoes do usuario 
    next() // executa a proxima funcao das camadas de middlewere do express
  })
}

app.listen(9000)
