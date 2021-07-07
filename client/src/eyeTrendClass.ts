export class Eye {
  left: number[];
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
      console.log('正常です');
    } else if (leftResult < 0 && leftResult >= -0.49) {
      //値が0未満及び-0.49(仮)以上の場合(トレーニング)
      console.log('視力が下がっています');
    } else {
      //値が-0.5(仮)以下の場合(病院紹介)
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
    } else if (rightResult < 0 && rightResult >= -0.49) {
      //値が0未満及び-0.49(仮)以上の場合(トレーニング)
    } else {
      //値が-0.5(仮)以下の場合(病院紹介)
    }
    return rightResult;
  }
  //グラフ化
}
