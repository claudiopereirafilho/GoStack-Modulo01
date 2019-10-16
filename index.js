const express = require('express');
const server = express();

/*
  { 
    "id":"1",
    "title":"Projeto Node.Js",
    "tasks":"Fixar no conceito"
  }
*/
//vetor de projetos
const projects = [{
  "id": "1",
  "title": "Primeiro registro",
  "tasks": ["Estudar", "Novo Emprego"]
}];

//Defino qual a porta o express irá ouvir.
server.listen('3000');

//Defino que a arquitetura dos dados será em formato JSON através do express.
server.use(express.json());

//------------ Middlewares -----------------
/*recebe o ID do projeto nos parâmetros da URL que verifica se o projeto 
com aquele ID existe. Se não existir retorne um erro, caso contrário permita 
a requisição continuar normalmente;
*/
function checkProjectId(req, res, next){

  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if(!project){
    return res.status(400).json({ error: "Project not found by id" });
  }

  return next();

}

/*Crie um middleware global chamado em todas requisições que imprime (console.log)
uma contagem de quantas requisições foram feitas na aplicação até então;
*/
let contRequest = 0;
function logRequest(req, res, next){

  contRequest++;
  console.log(`Number of requests: ${ contRequest }`);

  return next();
}

server.use(logRequest);

//------------ ROTAS -----------------------

//listar todos os projetos do Array
server.get('/projects', (req, res) => {
  
  return res.json(projects);  
  
});

//listar projetos do Array por id
/*  server.get('/project', (req, res) => {
    
    const id = req.query;
    console.log(id);

    const proj = projects.find(projeto => projeto.id == id);

    if(!proj){
      return res.status(400).json({error: `Project not found by id ${ id } ` });
    }
    return res.json(project);  
    
  });
*/

//Cadastrar novo projeto no Array
server.post('/projects', (req, res) => {
  
  const { id } = req.body;
  const { title } = req.body;
  const tasks = req.body.tasks.split(',').map(task => task.trim());

  //Para cada posição do Array, devo passar um objeto
  projects.push({
    "id":id,
    "title":title,
    "tasks":tasks, //array de tasks
  });

  return res.json(projects);  
  
});

//Alterar título do projeto por id
server.put('/projects/:id', checkProjectId, (req, res) => {
  
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(projeto => projeto.id == id);
  
  project.title = title;

  return res.json(projects);  
  
});

//Excluir um registro do array pelo Id.
server.delete('/projects/:id', checkProjectId, (req, res) => {

  const { id } = req.params;
  const indice = projects.findIndex(projeto => projeto.id == id);
  
  projects.splice(indice, 1);

  return res.send(`Project by ${id} was deleted`);  
});

//A rota deve receber um campo title e armazenar uma nova tarefa no array de tarefas
//de um projeto específico escolhido através do id presente nos parâmetros da rota;

server.post('/projects/:id/tasks', checkProjectId, (req, res)=> {

  const { id } = req.params;
  const { tasks } = req.body;

  const project = projects.find(project => project.id == id);
  
  project.tasks.push(tasks);  

  return res.json(projects);
});
