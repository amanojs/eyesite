import $ from 'jquery'; //jqueryの適用
import { Chart } from './chart'; //chartの適用

export class Eye {
  //左目の配列
  left: number[];
  //右目の配列
  right: number[];
  constructor(left: number[], right: number[]) {
    this.left = left;
    this.right = right;
  }

  //左目の傾向
  leftTrend(): number {
    //今回の値 popで配列の後ろの値からとってくる
    const nowLeft: number = this.left.pop() as number;
    //前回の値
    const backLeft: number = this.left.pop() as number;
    //最新の値と前回の値を比べる処理
    const leftResult = nowLeft - backLeft;
    if (leftResult >= 0) {
      //値が0以上の場合値の表示のみ
      $('#left_result').html(`<p>${leftResult}</p>`); //デバック用の処理
      console.log('正常です');
    } else if (leftResult < 0 && leftResult >= -0.49) {
      //値が0未満及び-0.49(仮)以上の場合(トレーニング)
      $('#left_result').html(`<p>${leftResult}</p>`); //デバック用の処理
      //トレーニングページへ飛ばすaタグをid=training_hrefとなっているタグに表示される
      $('#training_href').html('<a href="traning.html">トレーニングページへ</a>');
      console.log('視力が下がっています');
    } else {
      //値が-0.5(仮)以下の場合(病院紹介)
      $('#left_result').html(`<p>${leftResult}</p>`); //デバック用の処理
      console.log('視力が大幅に下がっています');
    }
    return leftResult;
  }
  //右目の傾向
  rightTrend(): number {
    //今回の値 popで配列の後ろの値からとってくる
    const nowRight: number = this.right.pop() as number;
    //前回の値
    const backRight: number = this.right.pop() as number;
    //最新の値と前回の値を比べる処理
    const rightResult = nowRight - backRight;
    if (rightResult >= 0) {
      //値が0以上の場合
      $('#right_result').html(`<p>${rightResult}</p>`); //デバック用の処理
    } else if (rightResult < 0 && rightResult >= -0.49) {
      //値が0未満及び-0.49(仮)以上の場合(トレーニング)
      $('#right_result').html(`<p>${rightResult}</p>`); //デバック用の処理
    } else {
      //値が-0.5(仮)以下の場合(病院紹介)
      $('#right_result').html(`<p>${rightResult}</p>`); //デバック用の処理
    }
    return rightResult;
  }
  //グラフ化
}

//上のクラスに組み込む予定、傾向計算の処理ができるまでとりあえずここに放置
//グラフ描画
function graph(): void {
  //グラフに入れるデータ
  const data = {
    //日付
    labels: ['6/1', '6/2', '6/3', '6/4', '6/5', '6/6', '6/7'],
    datasets: [
      //左目のデータ
      {
        label: '左目',
        data: [1, 0.9, 0.8, 0.9, 1, 0.75, 1],
        borderColor: '#00AECA',
        lineTension: 0,
        fill: false,
        borderWidth: 3
      },

      //右目のデータ
      {
        label: '右目',
        data: [0.6, 0.5, 0.7, 0.5, 0.6, 0.75, 0.5],
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
graph();
