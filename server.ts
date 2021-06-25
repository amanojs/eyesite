import express from 'express';
const app: express.Express = express();
const PORT = 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => {
  res.send('Hello world');
});

app.listen(PORT, () => console.log('Start on port 4000.'));
