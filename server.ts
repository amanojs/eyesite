import express from 'express';
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
  //sessionCheck(next);
  res.send(result);
  console.log(req.session.name, req.session.user);
  sessionCheck(req, res);
  res.send(result);
});

app.get('/logout', (req) => {
  delete req.session.user;
  console.log('ログアウト');
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

// 視力の結果を右目と左目でそれぞれ取得
app.get('/selectEyeresult', async (req, res) => {
  const connection = await getConnection();
  const userId = req.query.id;
  // ユーザーIDを元に視力検査の結果を取得
  const sql =
    'SELECT eye_test_id, DATE_FORMAT(eye_test_date, "%Y-%m-%d") AS eye_date, eye_test_score, user_id, eye_way FROM t_eye_test_result WHERE user_id = ?';
  const result = await connection.query(sql, userId);
  connection.end();

  // インスタンス化
  const eyeresult = new EyeResult(result);
  await eyeresult.SelectResult();
  // eyeresultの中に視力の結果が左目と右目に分けて保存してある。
  console.log(eyeresult);
});

app.listen(PORT, () => console.log(`Start on port ${PORT}.`));

// 視力の結果をわかりやすくまとめるクラス
class EyeResult {
  leftEyeDate: Date[] = [];
  leftEyeWay: number[] = [];
  leftEyeScore: number[] = [];

  rightEyeDate: Date[] = [];
  rightEyeWay: number[] = [];
  rightEyeScore: number[] = [];

  result: any;

  constructor(result: any) {
    this.result = result;
  }

  async SelectResult() {
    let left = 0;
    let right = 0;

    // データの件数だけ繰り返し
    for (let i = 0; i < this.result.length; i++) {
      if (this.result[i].eye_way === 0) {
        this.leftEyeDate[left] = this.result[i].eye_date;
        this.leftEyeWay[left] = this.result[i].eye_way;
        this.leftEyeScore[left] = this.result[i].eye_test_score;
        left = left + 1;
      } else {
        this.rightEyeDate[right] = this.result[i].eye_date;
        this.rightEyeWay[right] = this.result[i].eye_way;
        this.rightEyeScore[right] = this.result[i].eye_test_score;
        right = right + 1;
      }
    }
  }
}

app.listen(PORT, () => console.log(`Start on port ${PORT}.`));
