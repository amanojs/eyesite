import { EyeTrend } from './eyeTrendClass'; //視力傾向クラスの適用

//左から順にleft,right,leftGraph,rightGraph
//データ取得できるようになりしだいthis.~~に変えます
const Eye1 = new EyeTrend([0.9, 0.9], [1, 1], [1, 1, 1, 1, 1, 0.8, 0.5], [0.1, 0.1, 0.1, 0.1, 0.1, 0.3, 0.6]);
console.log(Eye1.leftResult);
console.log(Eye1.rightResult);
Eye1.leftTrend();
Eye1.rightTrend();
console.log(Eye1.leftResult);
console.log(Eye1.rightResult);
//左目結果の傾向
Eye1.leftDisplay();
//右目結果の傾向
Eye1.rightDisplay();
//ボタン(トレーニングor病院紹介)の表示
Eye1.buttonDisplay();
console.log(Eye1.buttonDisplay());
//グラフの出力
Eye1.graph();
