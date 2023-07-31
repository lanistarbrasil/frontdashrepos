const express = require("express");
const mysql = require("mysql2");
const app = express();
const cors = require("cors");

app.use(cors());

// Configurações de conexão com o banco de dados MySQL
/*
const connection = mysql.createConnection({
  host: "database-1.cxpaobbrsntr.us-east-2.rds.amazonaws.com",
  port: 3306,
  user: "admin",
  password: "Tunado98",
  database: "project",
  autoReconnect: true, // Ativa a reconexão automática
  reconnectDelay: 2000 
});
*/


// Conectar ao banco de dados MySQL
// Conectar ao banco de dados MySQL
const pool = mysql.createPool({
    host: "database-1.cxpaobbrsntr.us-east-2.rds.amazonaws.com",
    port: 3306,
    user: "admin",
    password: "Tunado98",
    database: "datagtm",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
// Defina suas rotas aqui

app.listen("3000", () => {
    console.log("Servidor iniciado na porta 3000.");
  });

// Middleware para adicionar o cabeçalho 'Access-Control-Allow-Origin'
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// Middleware para fazer o parse do corpo das requisições como JSON
app.use(express.json());

app.route("/cadastro").post((req, res) => {
  const { email, senha } = req.body;
  const query = "INSERT INTO cadastro (email, senha) VALUES (?, ?)";
  pool.query(query, [email, senha], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Erro ao cadastrar usuário.");
    } else {
      res.status(200).send("Usuário cadastrado com sucesso.");
      console.log(req.body)
    }
  });
});
app.route("/login").post((req, res) => {
    const { email, senha } = req.body;
    const query = "SELECT * FROM cadastro WHERE email = ? AND senha = ?";
    pool.query(query, [email, senha], (err, results) => {
        if (err){
            console.log(err)
            res.status(500).send("Usuário não encontrado")
        } else if(results.length > 0) {

            const token = generateRandomToken(); // Função para gerar um token aleatório (implementação abaixo)
            res.cookie("authToken", token, { httpOnly: true }); // Configura o cookie com o token
            res.status(200).send("Logado com sucesso!")
            console.log(req.body)
        } else {
            res.status(401).send("Credenciais inválidas.");
        }
    })

})

function generateRandomToken() {
  // Essa função pode gerar um token aleatório usando uma biblioteca de criptografia
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}