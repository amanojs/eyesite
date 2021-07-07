import { Eye } from './eyeTrendClass'; //視力傾向クラスの適用

//デバック用 これしないとグラフが出力されない
const Eye1 = new Eye([1, 0.5], [1, 0.6]);
console.log(Eye1.leftTrend());
console.log(Eye1.rightTrend());
