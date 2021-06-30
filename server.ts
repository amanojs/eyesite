import express, { request, response } from 'express';
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
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'eye_test'
  });
  return connection;
}

app.get('/', (request, response) => {
  response.send('HelloWorld');
});

// Selectのテスト
// 基本的にSQL文の変数にちゃんとしたSQL文を入れて実行するだけ
app.get('/select', async (request, response) => {
  const connection = await getConnection();
  const sql = 'select * from m_secret_question';
  const result = await connection.query(sql);
  connection.end();
  response.send(result);
});

// Insertのテスト、プリペアドステートメントは問題なく出来た
// 書き方が不細工なので、後でかっこよくしたい
app.get('/insert', async (request, response) => {
  const connection = await getConnection();
  const sql = 'INSERT INTO t_eye_test_result(eye_test_date, eye_test_score, user_id, eye_way) VALUES(?, ?, ?, ?)';

  const time = '2021-06-30-16:00:00';
  const userId = 2;
  const score = 300;
  const eyeWay = 0;
  const data = [time, score, userId, eyeWay];

  const result = await connection.query(sql, data);
  connection.end();
  response.send(result);
});

app.get('/insert', async (request, response) => {
  const connection = await getConnection();
  const sql = 'INSERT INTO t_eye_test_result(eye_test_date, eye_test_score, user_id, eye_way) VALUES(?, ?, ?, ?)';

  const time = '2021-06-30-16:00:00';
  const userId = 2;
  const score = 300;
  const eyeWay = 0;
  const data = [time, score, userId, eyeWay];

  const result = await connection.query(sql, data);
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
