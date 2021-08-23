import axios from 'axios'
import { View } from '../types/api'

// データ取得の相手先ポート情報
const port = 4000
// データ取得の相手先ホスト名
const host = 'localhost'

// データ取得先ポートを決めたaxiosインスタンス生成
export const axiosInstance = axios.create({
    baseURL: `http://${host}:${port}`,
    headers: {
        'Content-Type': 'application/json',
        xsrfHeaderName: 'X-CSRF-Token'
    },
    responseType: 'json'
})

// ページタイトル
const title = document.getElementById('app')
if (title != null)
    title.innerHTML = '<h1>検査履歴</h1>'

/* ソースコード引用元 → https://watermargin.net/programming/typescript/typescript-input-%E8%A6%81%E7%B4%A0%E3%81%AE%E5%85%A5%E5%8A%9B%E5%80%A4%E3%82%92-div-%E8%A6%81%E7%B4%A0%E3%81%AB%E5%8F%8D%E6%98%A0%E3%81%99%E3%82%8B/ */
let dataModel: DataModel;

// 入力フォームの場所やメッセージ出力のためのクラス
class DataModel{

    // 表示メッセージ用の変数
    private _title: string
    // 表示メッセージのゲッター
    get Title(): string {
        return this._title
    }

    // 表示メッセージのセッター
    set Title(newTitle: string) {
        this._title = newTitle

        //notification to UI element（表示には<div id="titleArea">を使用する）
        let elem: HTMLElement | null = document.getElementById("titleArea")
        if (elem !== null && elem !== undefined && elem.tagName == "DIV") {
            elem.textContent = this._title
        }
    }

    // 入力フォームの値を取得（notificationをしないため）
    private _value: string
    // 入力フォーム値のゲッター
    get Value(): string {
        return this._value
    }

    // 入力フォーム値のセッター
    set Value(newValue: string) {
        this._value = newValue
    }

    // どの入力フォームかを取得する変数
    private _titleSelector: string;
    // 入力フォーム名のゲッター
    get TitleSelector(): string {
        return this._titleSelector
    }

    // 入力フォーム名のセッター
    set TitleSelector(titleSelector: string) {
        this._titleSelector = titleSelector
    }

    // 各変数を初期化するコンストラクター
    constructor() {
        this._title = ''
        this._titleSelector = ''
        this._value = ''
    }
}

// ユーザーIDとユーザー名を表示するための値を保存クラス
class FormInput{

    // ユーザーＩＤの変数
    private _id: string
    // ユーザー名の変数
    private _name: string

    // ユーザーＩＤのゲッター
    getId(): string {
        return this._id
    }

    // ユーザーＩＤのセッター
    setId(newId: string) {
        this._id = newId
    }

    // ユーザー名のゲッター
    getName(): string {
        return this._name
    }

    // ユーザー名のセッター
    setName(newName: string) {
        this._name = newName
    }

    //　ユーザーＩＤとユーザー名の初期化をするコンストラクタ―
    constructor() {
        this._id = ''
        this._name = ''
    }
}

// 履歴表示ボタンを取得
const send = document.getElementById('send')
// 入力フォームとデータベースの値を照合したり、値を一時的に保持するクラス
let _form = new FormInput()

let formId: string = ''
// Mozillaマニュアル文（HTMLの初期文書が完全に読み込まれ解釈された時点で発生）
document.addEventListener("DOMContentLoaded", function (args) {
    dataModel = new DataModel();
});

// 入力フォームのフォーカス場所を取得
document.addEventListener("focus", function (args) {
    // 入力フォームの型定義
    let target: HTMLInputElement = <HTMLInputElement>args.target
    // 入力フォームの定義を判定
    if (target !== undefined && target.id !== "") {
        // 動作はしますがFirefoxで何故か出てしまうエラー
        //（Uncaught TypeError: target.getAttribute is not a function）
        // 入力フォームの属性（場所）を取得
        let placement: any = target.getAttribute("data-placement")
        // 入力フォームのnull判定
        if (placement !== null) {
            // 入力フォームの場所名をデータモデルに取得
            dataModel.TitleSelector = placement.toString()
            //console.log(dataModel.TitleSelector)
        }
    }
// 入力フォームのフォーカスを可にする
},true);

// keyupの処理回数を制限するためのフラグを初期化
let flg: boolean = true
// 値の入力フォームは今回<form name="" action="" method="post">として作れませんでした。
// Firefoxではinputがform→actionだった時の履歴をマウスで選ぶと値を取得できません。Microsoft Edgeでは取得できます。
// フォームにキーボードから毎回値を入力すれば動作します。
document.addEventListener("keyup", function (args) {
    // キーボード入力を取得する<input>の型定義
    let target: HTMLInputElement = <HTMLInputElement>args.target;
    // キーボード入力場所の定義を判定
    if (target !== undefined && target.id !== "") {
        // カーソルフォーカスの位置が履歴ボタンの位置のときはエンターキーと処理を分ける
        if (dataModel.TitleSelector == "buttonArea") {
            // 入力フォームに文字入力があるか無いかを判定
            if (target.value != "") {
                // エンターキーで履歴ボタンを押したときの処理
                if (send?.addEventListener('keypress', historyClick)) {}
                // 履歴表示ボタンをマウスでクリックするときの処理
                else if (send) {
                         send.addEventListener('click', () => {
                            _form.setId(formId)
                            // 履歴表示処理
                            HistoryView(_form)
                         })
                　　}
            } else {
                // 入力が何もなければ履歴ボタンは機能なし
                target.disabled
            }
        } else { 
            // キーボードから入力された文字をDataModelクラスに取得する
            dataModel.Value = target.value; // TypeScript では、オブジェクトを HTMLInputElement にキャスト後、value 属性にアクセスすることができる。
            // 取得した文字データを一時的にFormInputクラスにセットする
            _form.setId(dataModel.Value)
            // フォーカス中のフォームからカーソルが外れるときに、値を一時保持する
            target.onblur = function() {
                FormBlur(_form)
            }
            // "keyup"で入力（文字数？）回数の処理が動くので、１回だけ動くようにflgを付けました。
            if (flg === true) {
                // 履歴表示ボタン押下を取得
                if (send) {
                    send.addEventListener('click', () => {
                        // 履歴表示処理
                        HistoryView(_form)
                        // 処理回数を１回したら、ボタンを再度押すまでkeyup処理をしない
                        flg = false
                        // 入力フォームを空白に戻す
                        target.value = ''
                    })       
                }
            } 
        }
    }
})

// 履歴表示ボタンをエンターキーでクリックしたときの処理
function historyClick(event: any) {
    // エンターキーのキーコードは13
    if (event.keyCode === 13) {
        _form.setId(formId)
         // 履歴表示処理
         HistoryView(_form)
    } else {
        // エンターキー以外は特に処理しない
        event.preventDefault()
    }
}

// 入力フォームが外れた時に、値をクラスに一時入れる
function FormBlur(blurForm: FormInput) {
    // 入力フォームの型定義
    formId = blurForm.getId()
}

// 履歴表示処理(form→action→ページ遷移と取得データの引き渡しができず、シングルページです。)
function HistoryView(historyForm: FormInput){
    // axios通信の回数が無駄に増えないようにif文で回避する
    if (historyForm.getId() != ""){
        // リスト表示が無い場合、axiosでデータベースからのデータを取得
        axiosInstance.get<View>('/selectEyeresult').then(({ data }) => {
            // 取得したデータは文字列なので、配列に直す
            const text = data.name.split('\n')
            const history = data.history.split('\n')
            // サーバーから取得したデータを確認するコンソール
            //console.log(text + '\n' + history)
            // リスト表示のペアレントノードIDを取得
            let parent = document.getElementById('result')
            // 何件目のデータかを取得する変数
            let count = null
            // 取得したユーザーが登録者全員なので入力フォームと照合する
            for (let i = 0; i < text.length; i++) {
                // 入力IDと取得データが同じかどうか照合
                if (i % 2 == 0 && text[i] == historyForm.getId()) {
                    // 取得した全データの何件目なのかを取得
                    count = i / 2 + 1
                    // 表示したいユーザーIDは何件目のデータかを確認するコンソール
                    //console.log(count + "件目のデータ")
                    // 表示する名前をFormInputクラスにセット
                    historyForm.setName(text[i + 1])
                    // FormInputクラスから表示notificationに値を入れて表示する
                    dataModel.Title = historyForm.getName() + '様の検査履歴です。'
                } 
            }
            // ペアレントノードの有無を判定
            if (parent) {
                // 事前の表示があれば消去する
                if (parent.firstChild){
                    // 子要素を全て削除する方法は → https://into-the-program.com/removechild/
                    while(parent.lastChild){
                        parent.removeChild(parent.lastChild)
                    }
                }
            }

            // サーバーから取得したデータを切り出す初めの位置用変数
            let s = 0 
            // データの終端に"e"が入れてあるので、区切り場所を取得する変数
            let e_count = 0
            // 表示するデータ：history配列の"e"の場所をデータ件数分入れておく配列
            let place: number[] = []
            // 表示するデータの最初の位置は０で初期化
            place[e_count] = 0
            // データの有無を判定
            if (count != null) {
                // 取得データの"e"をデータ件数countで数える
                while (e_count < count) {
                    // 取得データの形式から終端"e"を検出
                    while (history[s] != "e") {
                        s = s + 3
                    }
                    // データの終端"e"の数がデータ件数に満たないとき、その"e"の添え字の場所を飛ばす
                    if (e_count != count){
                        s++
                    }
                    // データ終端用の"e"の数をカウントする
                    e_count++
                    // e_count件目のデータの開始位置を配列に入れる
                    place[e_count] = s
                    // 何件目のデータが取得文字列のどの位置かを確認するコンソール
                    //console.log(place)
                }
            
                // 取得データの場所確認コンソール
                //console.log(place[e_count - 1] + "からのデータです")
            
                // データの開始位置変数
                s = place[e_count - 1]
                // データの終了位置変数
                let d = place[e_count] - place[e_count - 1] - 1

                // 取得したデータの個数分(配列の要素分)のループ
                for (let i = s; i < s + d; i++) {
                    // データ表示用の<li>をクリエイト
                    let li = document.createElement('li')
                    if ((i - (e_count - 1)) % 3 == 0){
                        if (history[i] == "0") {
                            // 検査項目が左目の値を<li>に入れる
                            li.textContent = '左目の検査：' + history[i]
                        } else if (history[i] == "1") {
                            // 検査項目が右目の値を<li>に入れる
                            li.textContent = '右目の検査：' + history[i]
                        }
                        // <li>のclass名を付ける                 
                        li.className = "resultlist"
                    } else if ((i - (e_count - 1)) % 3 == 1) {
                        // 検査日付の値を<li>に入れる
                        li.textContent = '検査日付：' + history[i]
                        // <li>のclass名を付ける                   
                        li.className = "resultlist"
                    } else if ((i - (e_count - 1)) % 3 == 2) {
                        // 検査スコアの値を<li>に入れる
                        li.textContent = '検査スコア：' + history[i]
                        // <li>のclass名を付ける                    
                        li.id = "resultlist"
                    }
                    // 表示用リストを子ノードに設定し、表示する
                    if (parent != null)
                        parent.appendChild(li)                            
                }
            } else {
                // 問い合わせユーザーIDが無いときのメッセージ
                dataModel.Title = "お問い合わせユーザーの履歴はありません。"
                // ペアレントノードの有無を判定
                if (parent) {
                    // 事前の表示があれば消去する
                    if (parent.firstChild){
                        // 子要素を全て削除する方法は → https://into-the-program.com/removechild/
                        while(parent.lastChild){
                            parent.removeChild(parent.lastChild)
                        }
                    }
                }
            }
        })
    }
}