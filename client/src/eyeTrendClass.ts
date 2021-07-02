export class Eye {
  left: number;
  right: number;
  constructor(left: number, right: number) {
    this.left = left;
    this.right = right;
  }

  //左目の傾向
  leftTrend(backLeft: number): number {
    //最新の値と前回の値を比べる処理
    const leftResult = this.left - backLeft;
    if (leftResult >= 0) {
      //値が0以上の場合
    } else if (leftResult < 0 && leftResult <= -0.49) {
      //値が0未満及び-0.49(仮)以上の場合(トレーニング)
    } else {
      //値が-0.5(仮)以下の場合(病院紹介)
    }
    return leftResult;
  }
  //右目の傾向
  rightTrend(backRight: number): number {
    //最新の値と前回の値を比べる処理
    const rightResult = this.right - backRight;
    if (rightResult >= 0) {
      //値が0以上の場合
    } else if (rightResult < 0 && rightResult <= -0.49) {
      //値が0未満及び-0.49(仮)以上の場合(トレーニング)
    } else {
      //値が-0.5(仮)以下の場合(病院紹介)
    }
    return rightResult;
  }
  //グラフ化
}
