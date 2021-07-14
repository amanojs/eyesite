import { EyeTrend } from './eyeTrendClass'; //視力傾向クラスの適用

//左から順にleft,right,leftGraph,rightGraph
//データ取得できるようになりしだいthis.~~に変えます
const Eye1 = new EyeTrend([1, 0.5], [1, 0.6], [1, 1, 1, 1, 1, 1, 0.5], [0.1, 0.1, 0.1, 0.1, 0.1, 1, 0.6]);
console.log(Eye1.leftTrend());
console.log(Eye1.rightTrend());
//警告の出力
Eye1.alert();
console.log(Eye1.alert());
//グラフの出力
Eye1.graph();
