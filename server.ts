import express from 'express';
import * as mysql from 'promise-mysql';
import session from 'express-session';
import cors from 'cors';

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
app.use(cors());

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

//ログイン
app.get('/login', async (req, res) => {
  const connection = await getConnection();
  const sql = 'SELECT user_id, nickname FROM t_user WHERE mail_address = ? AND password = ?;';
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
    return false;
    //res.render('/login');
  }
  res.status(200).send(result[0].user_id.toString());
  console.log(req.session.name, req.session.user);
  connection.end();
  sessionCheck(req, res);
});

//ログインpost:ver
app.post('/loginpost', async (req, res) => {
  const connection = await getConnection();
  const sql = 'SELECT user_id, nickname FROM t_user WHERE mail_address = ? AND password = ?;';
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
    return false;
    //res.render('/login');
  }
  res.status(200).send(result[0].user_id.toString());
  console.log(req.session.name, req.session.user);
  connection.end();
  sessionCheck(req, res);
});

//新規登録
app.post('/newuser', async (req, res) => {
  const connection = await getConnection();
  const sql =
    'INSERT INTO t_user(mail_address, password, nickname, secret_id, secret_answer, birthday, address) VALUES(?, ?, ?, ?, ?, ?, ?)';
  const mailAddress = req.body.mailaddress;
  const password = req.body.password;
  const nickname = req.body.nickname;
  const secret_id = req.body.secret_id;
  const secret_answer = req.body.secret_answer;
  const birthday = req.body.birthday;
  const address = req.body.address;
  const data = [mailAddress, password, nickname, secret_id, secret_answer, birthday, address];
  const result = await connection.query(sql, data);
  console.log(data);
  res.send(result);
  connection.end();
});

app.get('/logout', (req, res) => {
  delete req.session.user;
  delete req.session.name;
  const session = req.session.user;
  const session2 = req.session.name;
  const data = [session, session2];
  console.log(req.session.user, req.session.name);
  res.send(data);
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
  res.send(result);
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

// パスワード変更の処理１
app.post('/checkMailaddress', async (req, res) => {
  const connection = await getConnection();
  const sql = 'SELECT mail_address FROM t_user WHERE mail_address = ?';
  const mailAddress = req.body.mail_address;

  const result = await connection.query(sql, mailAddress);
  connection.end();

  if (result.length > 0) {
    // 個々の中でどこかのページに遷移して、秘密の質問を入力する。
    console.log('メールアドレスが存在します。');
  } else {
    // メールアドレスが間違っている可能性があるので、もう一度入力してもらう。
    console.log('メールアドレスが存在しません。');
  }
  console.log(result);
  res.send(result);
});

// パスワード変更の処理2
app.post('/checkSecretAnswer', async (req, res) => {
  const connection = await getConnection();
  const sql = 'SELECT user_id FROM t_user WHERE secret_id = ? AND secret_answer = ? AND mail_address = ?';
  const secretId = req.body.secret_id;
  const secretAnswer = req.body.secret_answer;
  // 最終的にはさっき入力したメールアドレスを使って参照する
  const mailAddress = req.body.mail_address;
  const data = [secretId, secretAnswer, mailAddress];
  const result = await connection.query(sql, data);

  if (result.length > 0) {
    // 秘密の質問が一致した場合
    console.log('新しいパスワードを入力してください。');
  } else {
    // 秘密の質問が一致しない場合
    console.log('秘密の質問か、答えが間違っています。');
  }

  connection.end();
  console.log(result);
  res.send(result);
});

// パスワード変更の処理3
// 新しいパスワードを入力する段階
app.post('/updatePassword', async (req, res) => {
  const connection = await getConnection();
  const sql = 'UPDATE t_user SET password = ? WHERE user_id = ?';
  const password = req.body.password;

  // 現状ではページがないので、ログインした想定で、セッションに値を入れておく。
  req.session.user = 1;
  const userId = req.session.user;
  const data = [password, userId];
  await connection.query(sql, data);

  console.log('パスワードを変更しました。');

  connection.end();
});
