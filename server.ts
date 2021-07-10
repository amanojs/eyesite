import express, { request, response } from 'express';
import * as mysql from 'promise-mysql';
import session from 'express-session';

const app: express.Express = express();
const PORT = 4000;
require('dotenv').config({ debug: true });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 60 * 1000
    }
  })
);

//DB連携クラス
async function getConnection(): Promise<mysql.Connection> {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
  });
  return connection;
}

//セッションチェッククラス
//nextってコールバック引数がわからん。expressから引っ張ってこれるわけじゃないの？
function sessionCheck(next) {
  if (request.session.user && request.session.name) {
    next();
  } else {
    response.redirect('/login');
  }
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

//sessionの型の宣言
declare module 'express-session' {
  interface SessionData {
    user: number;
    name: string;
  }
}

//ログイン
app.get('/login', async (request, response, next) => {
  const connection = await getConnection();
  const sql = 'SELECT * FROM t_user WHERE mail_address = ? AND password = ?;';
  const mailAddress = 'yamaso@gmail.com';
  const password = 12345;
  const data = [mailAddress, password];
  const result = await connection.query(sql, data);
  // 認証出来たらちゃんとデータが取れる
  // 認証失敗したら空のデータが入っている？
  const resultLen = result.length;
  // .lengthでデータの数を調べると、データがある時はレコードの数が取得できる
  // データがない時はレコードの数が0になる
  if (resultLen > 0) {
    request.session.user = result[0].userid;
    request.session.name = result[0].nickname;
    console.log(resultLen);
    console.log(request.session.name, request.session.user);
  } else {
    console.log('session入ってないよ');
    //response.render('/login');
  }
  //sessionCheck(next);
  response.send(result);
});

// UPDATEのテスト上のSELECTとやってることは同じ
app.get('/update', async (request, response) => {
  const connection = await getConnection();
  const sql = 'UPDATE t_user SET mail_address = ?, password = ? , nickname = ?, address = ? WHERE user_id = ?;';
  const mailAddress = 'akikan@gmail.com';
  const password = 'akikan';
  const nickname = 'アキカン';
  const address = '東京都';
  const userId = 2;
  const data = [mailAddress, password, nickname, address, userId];

  const result = await connection.query(sql, data);
  connection.end();
  response.send(result);
});

app.listen(PORT, () => console.log(`Start on port ${PORT}.`));
