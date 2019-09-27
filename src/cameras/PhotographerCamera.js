export default class PhotographerCamera {
  constructor() {
    this.position = [0, 0, 0]
    this.orientation = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    this.t_V = [0, 0, 0]
    this.orienting_view = false
    this.lockToCar = false
    this.start_x = 0
    this.start_y = 0
    this.handleKey = {
      Q: () => {
        this.t_V = [0, 0.1, 0]
      },
      E: () => {
        this.t_V = [0, -0.1, 0]
      },
      L: () => {
        this.lockToCar = true
      },
      U: () => {
        this.lockToCar = false
      }
    }
  }
  keyDown(keyCode) {
    if (this.handleKey[keyCode]) {
      this.handleKey[keyCode](true)
    }
  }
  keyUp() {
    this.delta = [0, 0, 0]
  }
  mouseMove(x, y) {
    if (!this.orienting_view) {
      return
    }
    const alpha = (x - this.start_x) / 10.0
    const beta = -(y - this.start_y) / 10.0
    this.start_x = x
    this.start_y = y
    const R_alpha = SglMat4.rotationAngleAxis(sglDegToRad(alpha), [0, 1, 0])
    const R_beta = SglMat4.rotationAngleAxis(sglDegToRad(beta), [1, 0, 0])
    this.orientation = SglMat4.mul(SglMat4.mul(R_alpha, this.orientation), R_beta)
  }
  mouseButtonDown(x, y) {
    if (!this.lock_to_car) {
      this.orienting_view = true
      this.start_x = x
      this.start_y = y
    }
  }
  mouseButtonUp() {
    this.orienting_view = false
  }
  updatePosition(t_V) {
    this.position = SglVec3.add(this.position, SglMat4.mul3(this.orientation, t_V))
    if (this.position[1] > 1.8) this.position[1] = 1.8
    if (this.position[1] < 0.5) this.position[1] = 0.5
  }
  setView(stack, carFrame) {
    this.updatePosition(this.t_V)
    const car_position = SglMat4.col(carFrame, 3)
    let invV
    if (this.lockToCar) {
      invV = SglMat4.lookAt(this.position, car_position, [0, 1, 0])
    } else {
      invV = SglMat4.lookAt(
        this.position,
        SglVec3.sub(this.position, SglMat4.col(this.orientation, 2)),
        SglMat4.col(this.orientation, 1)
      )
    }
    stack.multiply(invV)
  }
}