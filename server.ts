import express, { response } from 'express';
import * as mysql from 'promise-mysql';

const app: express.Express = express();
const PORT = 4000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* 
app.get('/', (_, res) => {
  res.send('Hello world');
});
 */

async function getConnection(): Promise<mysql.Connection> {
  const connection = await mysql.createConnection({
    host: 'process.env.DB_HOST',
    user: 'process.env.DB_USER',
    password: 'process.env.DB_PASS',
    database: 'process.env.DB_DATABASE'
  });
  return connection;
}

app.get('/', async (request, response) => {
  const connection = await getConnection();
  const sql = 'select * from m_secret_question';
  const result = await connection.query(sql);
  connection.end();
  response.send(result);
});
/* 
function add_table(title: string): void {
  let sql = `
  INSERT INTO books (title ,createdAt ) VALUES
  ('${title}', now() )
  `;
  let connection: mysql.Connection;
  mysql
    .createConnection({
      host: 'localhost',
      user: 'db_user',
      password: 'password',
      database: 'vue1'
    })
    .then((conn) => {
      connection = conn;
      connection.query(sql);
      connection.end();
    });
}
 */
app.listen(PORT, () => console.log(`Start on port ${PORT}.`));
