/**
 * 驾驶员观察视图
 */
export default class ChaseCamera {
  constructor() {
    this.position = [0.0, 0.0, 0.0]
  }
  keyDown(keyCode) { }
  keyUp(keyCode) { }
  mouseMove(event) { }
  mouseButtonDown(event) { }
  mouseButtonUp(event) { }
  setView(stack, F_0) {
    const Rx = SglMat4.rotationAngleAxis(sglDegToRad(-20), [1.0, 0.0, 0.0])
    const T = SglMat4.translation([0.0, 3.0, 1.5])
    const Vc_0 = SglMat4.mul(T, Rx)
    const V_0 = SglMat4.mul(F_0, Vc_0)
    this.position = SglMat4.col(V_0, 3) // 获取V_0矩阵第四列，即新框架坐标原点
    const invV = SglMat4.inverse(V_0)
    stack.multiply(invV)
  }
}