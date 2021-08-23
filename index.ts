import Express, { text } from 'express'
import * as mysql from 'promise-mysql'
import cors from 'cors'
import axios from 'axios'
import { View } from '../types/api'

require('dotenv').config({ debug: false })

// Express Serverの起動
const app = Express()

// CORS対応
app.use(cors())

//DB連携クラス
async function getConnection(): Promise<mysql.Connection> {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
        timezone: process.env.DB_TIMEZONE,
        debug: true
    })
    console.log(connection)
    return connection
}

// SQL SELECTのテスト
// 基本的にSQL文の変数にちゃんとしたSQL文を入れて実行するだけ
// axiosとcorsの通信はpost通信
app.get('/selectEyeresult', async (req, res) => {
    // 表示用変数
    let view
    // データベースからデータを取得する配列
    const userId: string[] = []
    const nickName: string[] = []
    const leftEyeDate: string[] = []
    const leftEyeWay: number[] = []
    const leftEyeScore: number[] = []
    const rightEyeDate: string[] = []
    const rightEyeWay: string[] = []
    const rightEyeScore: string[] = []
   
    // データベース接続メソッド
    const connection = await getConnection()
    // 登録ユーザーのデータベース問い合わせクエリー
    // (req.paramsからwhere句でユーザーを絞る方法にチャレンジしましたが、、
    // form→action→ページ遷移での表示方法が分かりませんでした。
    // 登録ユーザーが全てクライアント側に読み込まれてしまいます・・・)
    const sql = 'select ?? from ??'
    const columns = ['user_id', 'nickname']
    const id = [columns, 't_user']
    // クエリーの戻り値を取得
    const patient = await connection.query(sql, id)
    // データを取り出した時の配列の要素
    let i = 0
    // クエリーの戻り値から表示したい部分を取り出す
    patient.forEach((v:string) => {
        // JSON形式でデータを１件ずつにする
        view = (JSON.parse(JSON.stringify(v)))
        // JSON形式のデータを配列に納める
        userId[i] = view.user_id
        nickName[i] = view.nickname
        // データの確認コンソール
        console.log('ユーザーID：' + view.user_id + '　ユーザー名：' + view.nickname)
        // 配列の添え字
        i++
    })
    // axiosで通信するときのデータ型変数
    let moji: View = { name: "", history: "" }
    // axiosで通信する変数に取得データの文字列を代入
    for (i = 0; i < userId.length; i++) {
        // 配列データを１つの文字列に区切り文字をつけて、axiosのinterface変数に代入
        moji.name += userId[i] + "\n" + nickName[i] + "\n"
    }
    
    // 検査結果データベース問い合わせクエリー
    // 問い合わせユーザーが無ければ処理をしない
    if (userId[0] != null) {
        for (i = 0; i < userId.length; i++) {
            // eye_way = 0で左目の検査結果をデータベースから取得する 
            const l_sql = 'select ?? from ?? where user_id = ? and eye_way = ?'
            const l_columns = ['eye_test_date', 'eye_test_score', 'eye_way']
            const l_id = [l_columns, 't_eye_test_result', userId[i], 0]
            
            // クエリーの戻り値を取得
            const l_result = await connection.query(l_sql, l_id)
            console.log(l_result)
            // データ取得数用変数の初期化
            let s = 0
            let d = 0
            // クエリーの戻り値から表示したい部分を取り出す
            l_result.forEach((v:string) => {
                // JSON形式でデータを１件ずつにする
                view = (JSON.parse(JSON.stringify(v)))
                // JSON形式のデータを配列に納める
                leftEyeDate[d] = view.eye_test_date
                leftEyeScore[d] = view.eye_test_score
                leftEyeWay[d] = view.eye_way
                d++               
            })
            // 配列データの区切り文字付けて１つの文字列へ変換（区切り文字→"\n")
            view = ""
            for (s = 0; s < d; s++) {
                view += leftEyeWay[s] + "\n"
                view += leftEyeDate[s] + "\n"
                view += leftEyeScore[s] + "\n"
            }
            // axiosで通信するinterface変数に取得データの文字列を代入
            moji.history += view
            
            // eye_way = 1で右目の検査結果を取得する
            const r_sql = 'select ?? from ?? where user_id = ? and eye_way = ?'
            const r_columns = ['eye_test_date', 'eye_test_score', 'eye_way']
            const r_id = [r_columns, 't_eye_test_result', userId[i], 1]
            // クエリーの戻り値を取得
            const r_result = await connection.query(r_sql, r_id)
            // 取得数用変数の初期化
            d = 0
            // クエリーの戻り値から表示したい部分を取り出す
            r_result.forEach((v:string) => {
                // JSON形式でデータを１件ずつにする
                view = (JSON.parse(JSON.stringify(v)))
                // JSON形式のデータを配列に納める
                rightEyeDate[d] = view.eye_test_date
                rightEyeScore[d] = view.eye_test_score
                rightEyeWay[d] = view.eye_way
                d++              
            })

            // 配列データの区切り文字付けて１つの文字列へ変換（区切り文字→"\n")
            view = ""
            for (s = 0; s < d; s++) {
                view += rightEyeWay[s] + "\n"
                view += rightEyeDate[s] + "\n"
                view += rightEyeScore[s] + "\n"
            }

            // axiosで通信するinterface変数に取得データの文字列を代入し、データの終端である"e"を入れておきました。
            moji.history += view + "e\n"
        }
    }
    console.log(moji)
    
    // データベース接続切断
    connection.end()
    // 取り出したデータを表示
    res.send(moji)
})

// Route
app.get('/', (req, res) => {
    const data: View = { name: 'サーバー側', history: '履歴' }
    res.send(data)
})

// Routeに一致しないRequest
app.use((req, res, next) => {
    res.sendStatus(404)
    next({ statusCode: 404 })
})

// Error Route
app.use(
    (
        err: { statusCode: number },
        req: Express.Request,
        res: Express.Response,
        next: Express.NextFunction
    ) => {
        console.log(err.statusCode)
    }
)

// Express Serverの起動
const port = 4000
const host = 'localhost'

app.listen(port, host, () => {
    console.log(`Running on http://${host}:${port}`)
})