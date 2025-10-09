const express = require('express');
const app = express();
const mysql = require('mysql2');
const { engine } = require('express-handlebars');
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

const conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2025',
    port: 3306,
    database: 'psicologia'
});

conexao.connect((erro) => {
    if(erro) {
        console.error('Erro ao conectar ao banco de dados:', erro);
        return;
    }
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
});

app.get("/", (req, res) => {
    res.render('teste');    
}
);

app.listen(8080);