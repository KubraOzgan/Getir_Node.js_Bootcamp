const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const fs = require('fs');

const {authenticateToken} = require('../authentication/auth');

const toDos = [
  { id: 1, title: 'Study', completed: 'false' },
  { id: 2, title: 'Market', completed: 'false' },
  { id: 3, title: 'Read', completed: 'false' },
  { id: 4, title: 'Feed the cat', completed: 'true' },
  { id: 5, title: 'Prepare for the exam', completed: 'false' },
];

let logFile = fs.createWriteStream((__dirname, 'logs.log'), { flags: 'a' });
router.use(morgan('combined', { stream: logFile }));
 
router.get('/', (req, res) => {
  res.send(toDos);
});

router.get('/:id', authenticateToken, (req, res) => {
  const toDo = toDos.find((i) => i.id === parseInt(req.params.id));
  if (!toDo) res.send('It doesnt exist!');
  res.send(toDo);
});

router.post('/post', authenticateToken, (req, res) => {
  const newtoDo = {
    id: toDos.length + 1,
    title: req.body.title,
    complated: req.body.completed,
  };
  toDos.push(newtoDo);
  res.send(toDos);
});

router.put('/put/:id', authenticateToken, (req, res) => {
  const updatetoDo = toDos.find((i) => i.id === parseInt(req.params.id));
  if (!updatetoDo) res.send('It doesnt exist!');
  updatetoDo.title = req.body.title;
  res.send(updatetoDo);
});

router.patch('/patch/:id', authenticateToken, (req, res) => {
  const updatetoDo = toDos.find((i) => i.id === parseInt(req.params.id));
  if (!updatetoDo) res.send('It doesnt exist!');
  updatetoDo.title = req.body.title;
  res.send(updatetoDo);
});

router.delete('/delete/:id', authenticateToken, (req, res) => {
  const deltoDo = toDos.find((i) => i.id === parseInt(req.params.id));
  if (!deltoDo) res.send('It doesnt exist!');
  const index = toDos.indexOf(toDos);
  toDos.splice(index, 1);
  res.send(deltoDo);
});

module.exports = router;
