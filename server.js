const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const port = 3000;

const secretToken = process.env.WEBHOOK_SECRET;
const projectsDir = process.env.PROJECTS_DIR;

const verifyToken = (req) => {
  const token = req.query.token;
  return token === secretToken;
};

app.use(bodyParser.json());

app.post('/hook', (req, res) => {
  if (!verifyToken(req)) {
    return res.status(403).send('Token de autenticação inválido');
  }

  const project = req.query.project;

  if (!project) {
    return res.status(400).send('Faltando parâmetro "project"');
  }

  console.log(`Recebendo o webhook para o projeto: ${project}`);

  const projectPath = path.join(projectsDir, project);

  fs.readdir(projectsDir, (err, files) => {
    if (err) {
      console.error('Erro ao ler o diretório dos projetos:', err);
      return res.status(500).send('Erro interno no servidor');
    }

    if (files.includes(project)) {
      console.log(`Deploy do projeto ${project} iniciado`);
      
      execSync(`cd ${projectPath}`);
      execSync('git pull origin main');
      execSync('docker-compose up --build -d');
      
      res.status(200).send(`Deploy do projeto ${project} finalizado com sucesso`);
    } else {
      console.log(`Projeto ${project} não encontrado em ${projectsDir}`);
      return res.status(404).send(`Projeto ${project} não encontrado`);
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
