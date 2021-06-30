import './top.css'; //cssの適用
import { Chart } from './chart'; //chartの適用

//ログアウトボタンを押したときの処理
const logout = document.getElementById('logout');

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
  const ctx = document.querySelector<HTMLCanvasElement>('#graph');
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
