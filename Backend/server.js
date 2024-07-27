// const jsonServer = require('json-server');
// const server = jsonServer.create();
// const router = jsonServer.router('db.json');
// const middlewares = jsonServer.defaults();
// const port = process.env.PORT || 3001;
// server.use(middlewares);
// server.use(router);

// server.listen(port);

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Custom login endpoint
server.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = router.db.get('users').value();
  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.status(200).json({ ...user });
  } else {
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

// Custom signup endpoint
server.post('/signup', (req, res) => {
  const { email, password, name } = req.body;
  const users = router.db.get('users').value();
  const userExists = users.find(u => u.email === email);

  if (userExists) {
    res.status(400).json({ error: 'User already exists' });
  } else {
    const newUser = { id: users.length + 1, email, password, name };
    router.db.get('users').push(newUser).write();
    res.status(201).json({ ...newUser });
  }
});

server.use(router);
server.listen(5000, () => {
  console.log('JSON Server is running on port 5000');
});


