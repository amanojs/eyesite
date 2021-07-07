import { Eye } from './eyeTrendClass'; //視力傾向クラスの適用

//デバック用 これしないとグラフが出力されない
const Eye1 = new Eye([0.8, 0.9], [1, 0.6]);
console.log(Eye1.leftTrend());
console.log(Eye1.rightTrend());
