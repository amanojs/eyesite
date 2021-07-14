import express, { response } from 'express';
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

//sessionの型の宣言
declare module 'express-session' {
  interface SessionData {
    user: number;
    name: string;
  }
}

//DB連携関数
async function getConnection(): Promise<mysql.Connection> {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
  });
  return connection;
}

//セッションチェック関数
function sessionCheck(req: express.Request, res: express.Response) {
  if (req.session.user) {
    console.log('セッションチェック中');
    //ここにはセッションチェックしたあとなにするか入れる。もともとはnext()とかいれるつもりだった。
  } else {
    res.redirect('/login');
    //ログインページに飛ぶ処理を書く。
  }
}

app.get('/', (req, res) => {
  res.send('HelloWorld');
});

// Selectのテスト
// 基本的にSQL文の変数にちゃんとしたSQL文を入れて実行するだけ
app.get('/select', async (req, res) => {
  const connection = await getConnection();
  const sql = 'select * from m_secret_question';
  const result = await connection.query(sql);
  connection.end();
  res.send(result);
});

// Insertのテスト、プリペアドステートメントは問題なく出来た
// 書き方が不細工なので、後でかっこよくしたい
app.get('/insert', async (req, res) => {
  const connection = await getConnection();
  const sql = 'INSERT INTO t_eye_test_result(eye_test_date, eye_test_score, user_id, eye_way) VALUES(?, ?, ?, ?)';

  const time = '2021-06-30-16:00:00';
  const userId = 2;
  const score = 300;
  const eyeWay = 0;
  const data = [time, score, userId, eyeWay];

  const result = await connection.query(sql, data);
  connection.end();
  res.send(result);
});

app.get('/insert', async (req, res) => {
  const connection = await getConnection();
  const sql = 'INSERT INTO t_eye_test_result(eye_test_date, eye_test_score, user_id, eye_way) VALUES(?, ?, ?, ?)';

  const time = '2021-06-30-16:00:00';
  const userId = 2;
  const score = 300;
  const eyeWay = 0;
  const data = [time, score, userId, eyeWay];

  const result = await connection.query(sql, data);
  connection.end();
  res.send(result);
});

//ログイン
app.get('/login', async (req, res) => {
  const connection = await getConnection();
  const sql = 'SELECT * FROM t_user WHERE mail_address = ? AND password = ?;';
  const mailAddress = 'yamaso@gmail.com';
  const password = 12345;
  const data = [mailAddress, password];
  const result = await connection.query(sql, data);
  // 認証出来たらちゃんとデータが取れる
  // 認証失敗したら空のデータが入っている？
  // .lengthでデータの数を調べると、データがある時はレコードの数が取得できる
  // データがない時はレコードの数が0になる
  if (result.length > 0) {
    req.session.user = result[0].user_id;
    req.session.name = result[0].nickname;
    console.log(result.length);
  } else {
    console.log('session入ってないよ');
    //res.render('/login');
  }
  console.log(req.session.name, req.session.user);
  sessionCheck(req, res);
  res.send(result);
});

//ログインpost:ver
app.post('/loginpost', async (req, res) => {
  const connection = await getConnection();
  const sql = 'SELECT * FROM t_user WHERE mail_address = ? AND password = ?;';
  const mailAddress = req.body.mailaddress;
  const password = req.body.password;
  const data = [mailAddress, password];
  const result = await connection.query(sql, data);
  console.log(req.body.mailaddress, req.body.password);
  // 認証出来たらちゃんとデータが取れる
  // 認証失敗したら空のデータが入っている？
  // .lengthでデータの数を調べると、データがある時はレコードの数が取得できる
  // データがない時はレコードの数が0になる
  if (result.length > 0) {
    req.session.user = result[0].user_id;
    req.session.name = result[0].nickname;
    console.log(result.length);
  } else {
    console.log('session入ってないよ');
    //res.render('/login');
  }
  console.log(req.session.name, req.session.user);
  sessionCheck(req, res);
  res.send(result);
});

app.get('/logout', (req, res) => {
  delete req.session.user, req.session.name;
  console.log(req.session.user, req.session.name);
  res.send();
});

// UPDATEのテスト上のSELECTとやってることは同じ
app.get('/update', async (req, res) => {
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
  res.send(result);
});

app.get('/selectEyeresult', async (req, res) => {
  const connection = await getConnection();
  // 左目のSQL文
  let sql =
    'SELECT eye_test_id, DATE_FORMAT(eye_test_date, "%Y-%m-%d") AS eye_date, eye_test_score, user_id, eye_way FROM t_eye_test_result WHERE user_id = ? AND eye_way = 0';

  const userId = req.query.id;
  const result = await connection.query(sql, userId);
  console.log(result.length);

  const leftEyeDate: string[] = [];
  const leftEyeWay: number[] = [];
  const leftEyeScore: number[] = [];

  const rightEyeDate: string[] = [];
  const rightEyeWay: string[] = [];
  const rightEyeScore: string[] = [];

  for (let i = 0; i < result.length; i++) {
    leftEyeDate[i] = result[i].eye_date;
    leftEyeWay[i] = result[i].eye_way;
    leftEyeScore[i] = result[i].eye_test_score;
  }

  console.log(leftEyeDate);
  console.log(leftEyeWay);
  console.log(leftEyeScore);

  // 右目のSQL文
  sql =
    'SELECT eye_test_id, DATE_FORMAT(eye_test_date, "%Y-%m-%d") AS eye_date, eye_test_score, user_id, eye_way FROM t_eye_test_result WHERE user_id = ? AND eye_way = 1';

  const result2 = await connection.query(sql, userId);

  for (let i = 0; i < result2.length; i++) {
    rightEyeDate[i] = result2[i].eye_date;
    rightEyeWay[i] = result2[i].eye_way;
    rightEyeScore[i] = result2[i].eye_test_score;
  }

  console.log(rightEyeDate);
  console.log(rightEyeWay);
  console.log(rightEyeScore);

  res.send(result);

  connection.end();
});

app.listen(PORT, () => console.log(`Start on port ${PORT}.`));
