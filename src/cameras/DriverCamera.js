/**
 * 驾驶舱观察视图
 */
export default class DriverCamera {
  constructor() {
    this.position = []
  }
  keyDown() {}
  keyUp() {}
  mouseMove() {}
  mouseButtonDown() {}
  mouseButtonUp() {}
  setView(stack, view) {
    let driverFrame = SglMat4.dup(frame)
    let pos = SglMat4.col(driverFrame, 3)
    SglMat4.col$(driverFrame, 3, SglVec4.add(pos, [0, 1.5, 0, 0]))
    let inv =  SglMat4.inverse(driverFrame)
    stack.multiply(invV)
  }
}