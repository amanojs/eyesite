import $ from 'jquery'; //jqueryの適用
import { Chart } from './chart'; //chartの適用 グラフ描画
import moment from 'moment';

export class EyeTrend {
  //左目の配列
  public left: number[];
  //右目の配列
  public right: number[];
  public leftResult: number;
  public rightResult: number;
  //グラフで使う左目の配列
  public leftGraph: number[];
  //グラフで使う左目の配列
  public rightGraph: number[];
  //グラフの日付
  //public dataGraph: string[]; 引数で入手する場合
  //public date: string; そうじゃない場合
  constructor(left: number[], right: number[], leftGraph: number[], rightGraph: number[]) {
    this.left = left;
    this.right = right;
    this.leftResult = 0;
    this.rightResult = 0;
    this.leftGraph = leftGraph;
    this.rightGraph = rightGraph;
    //this.dataGraph = dataGraph; 引数で入手する場合
    //this.date = date; そうじゃない場合
  }
  //値の取得
  //get(): void {}
  //左目の傾向
  leftTrend(): void {
    //今回の値 popで配列の後ろの値からとってくる
    const nowLeft: number = this.left.pop() as number;
    //前回の値
    const backLeft: number = this.left.pop() as number;
    //最新の値と前回の値の差を計算する処理
    this.leftResult = nowLeft - backLeft;
  }
  //右目の傾向
  rightTrend(): void {
    //今回の値 popで配列の後ろの値からとってくる
    const nowRight: number = this.right.pop() as number;
    //前回の値
    const backRight: number = this.right.pop() as number;
    //最新の値と前回の値の差を計算する処理
    this.rightResult = nowRight - backRight;
  }
  //傾向の値によって表示する物の変更 返す値はとりあえずフラグ処理風
  //左目のアップダウンの矢印表示(検査結果のデザイン参照)
  leftDisplay(): number {
    if (this.leftResult < 0) {
      //視力が上がっていた場合
      return 0;
    } else if (this.leftResult == 0) {
      //視力が変わっていなかった場合
      return 1;
    } else {
      //視力が下がっていた場合
      return 2;
    }
  }
  //右目のアップダウンの矢印表示(検査結果のデザイン参照)
  rightDisplay(): number {
    if (this.rightResult < 0) {
      //視力が上がっていた場合
      return 0;
    } else if (this.rightResult == 0) {
      //視力が変わっていなかった場合
      return 1;
    } else {
      //視力が下がっていた場合
      return 2;
    }
  }
  //トレーニングや病院紹介のボタン表示
  buttonDisplay(): number {
    if (this.leftResult <= -0.5 || this.rightResult <= -0.5) {
      //視力が大幅に下がっていた場合 病院紹介
      return 2;
    } else if (
      (this.leftResult < 0 && this.leftResult >= -0.49) ||
      (this.rightResult < 0 && this.rightResult >= -0.49)
    ) {
      //視力が下がっていた場合 トレーニング
      return 1;
    } else {
      //視力が下がっていなかった場合 表示なし
      return 0;
    }
  }
  //グラフ化
  graph(): void {
    //this.date = moment().format('YYYY-MM-DD');
    //console.log(this.date);
    //グラフに入れるデータ
    const data = {
      //日付
      labels: ['6/1', '6/2', '6/3', '6/4', '6/5', '6/6', '6/7'], //for文で入れる
      datasets: [
        //左目のデータ
        {
          label: '左目',
          data: this.leftGraph,
          borderColor: '#00AECA',
          lineTension: 0,
          fill: false,
          borderWidth: 3
        },

        //右目のデータ
        {
          label: '右目',
          data: this.rightGraph,
          borderColor: '#FF6B6B',
          lineTension: 0,
          fill: false,
          borderWidth: 3
        }
      ]
    };
    //グラフを描画
    const ctx = document.querySelector<HTMLCanvasElement>('#graph'); //ctxをコンストラクタの引数にする
    if (!ctx) return; //ctxがnullだったら処理を終了する
    new Chart(ctx, {
      type: 'line', //グラフの種類 type: 'グラフの種別'
      data: data, //データ data: 値
      options: {
        scales: {
          //Y軸の設定
          y: {
            //Y軸に表示する値の最小値設定、消すと代入された値の最小値がY軸の最小値になります
            beginAtZero: true,
            //Y軸の名前設定
            title: {
              text: '視力', //Y軸の名前
              display: true //trueで名前表示
            }
          },
          //X軸の設定
          x: {
            //X軸の名前設定
            title: {
              text: '日付', //X軸の名前
              display: true
            }
          }
        }
      }
    });
  }
}
