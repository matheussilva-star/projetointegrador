const express = require('express');
const app = express();
const mysql = require('mysql2');
const { engine } = require('express-handlebars');
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


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
    res.render('index');    
}
);

/* Paciente */
app.get('/paciente', (req, res) => {
        res.render('paciente')    
});

app.post('/paciente', (req, res) => {
  const { nome_paciente, data_nascimento, telefone, email } = req.body;  
 
  const sql = `
  INSERT INTO Pacientes (nome_paciente, data_nascimento, telefone, email)
  VALUES (?, ?, ?, ?)  
  `;  

conexao.query(sql, [nome_paciente, data_nascimento, telefone, email], (erro, resultado) => {

    if(erro) {
        console.error('Erro ao cadastrar o paciente:', erro);
        return res.status(500).send('Erro ao cadastrar o paciente');
    }
    res.redirect('/');
});
});

/* Psicólogo */
app.get('/psicologo', (req, res) => {   
         res.render('psicologo')
});   

app.post('/psicologo', (req, res) => {
    const { nome_psicologo, crp, especialidade, telefone, email} = req.body;    

    const sql = `
    INSERT INTO Psicologo (nome_psicologo, crp, especialidade, telefone, email)
    VALUES (?, ?, ?, ?, ?)`;

conexao.query(sql, [nome_psicologo, crp, especialidade, telefone, email], (erro, resultado) => {

    if(erro) {
        console.error('Erro ao cadastrar o psicólogo:', erro);
        return res.status(500).send('Erro ao cadastrar o psicólogo');
    }
    res.redirect("/");
});
});

/* Agendamento */
app.get('/agendamento', (req, res) => {
  const sqlPacientes = 'SELECT id_paciente, nome_paciente FROM Pacientes';
  const sqlPsicologos = 'SELECT id_psicologo, nome_psicologo FROM Psicologo';

  conexao.query(sqlPacientes, (erro, pacientes) => {
    if (erro) {
      console.error('Erro ao buscar pacientes:', erro);
      return res.status(500).send('Erro ao buscar pacientes');
    }

    conexao.query(sqlPsicologos, (erro, psicologos) => {
      if (erro) {
        console.error('Erro ao buscar psicólogos:', erro);
        return res.status(500).send('Erro ao buscar psicólogos');
      }

      res.render('agendamento', { pacientes, psicologos });
    });
  });
}); 

app.post("/agendamento", (req, res) => {
    const { id_paciente, id_psicologo, data_agendamento, tipo, horario } = req.body;    

    const sql = `
    INSERT INTO Agendamento (id_paciente, id_psicologo, data_agendamento, tipo, horario)
    VALUES (?, ?, ?, ?, ?)
    `;

conexao.query(sql, [id_paciente, id_psicologo, data_agendamento, tipo, horario], (erro, resultado) => {

    if(erro) {
        console.error('Erro ao agendar a consulta:', erro);
        return res.status(500).send('Erro ao agendar a consulta');
    }
    res.redirect("/");
});
});

app.listen(8080);   
