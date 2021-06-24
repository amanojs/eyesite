import express from 'express';
const app: express.Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => {
  res.send('Hello world');
});

app.listen(4000, () => console.log('Start on port 4000.'));
