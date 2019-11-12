/**
 * 跟踪球控制视图/wasd控制视图
 */
export default class ObserverCamera {
  constructor() {
    // 模式：wasd=0,trackball=1（跟踪球）
    this.currentMode = 0
    this.V = SglMat4.identity()
    SglMat4.col$(this.V, 3, [0.0, 20.0, 100.0, 1])
    this.position = []
    // wasd 模式控制量
    this.t_V = [0, 0, 0, 0.0]
    this.alpha = 0;
    this.beta = 0;

    // trackball 跟踪球模式控制量
    this.height = 0
    this.width = 0
    this.start_x = 0
    this.start_y = 0
    this.currX = 0
    this.currY = 0
    this.rad = 5
    this.orbiting = false
    this.projectionMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    this.rotMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
    this.tbMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

    this.initKeyObserver()
  }
  computeVector(x, y) {
    // in this implementation the trackball is supposed
    // to be centered 2*rad along -z
    const D = 2 * this.rad

    //find the intersection with the trackball surface
    // 1. find the vector leaving from the point of view and passing through the pixel x,y
    // 1.1 convert x and y in view coordinates
    let xf = (x - this.width / 2) / this.width * 2.0;
    let yf = (y - this.height / 2) / this.height * 2.0;

    let invProjection = SglMat4.inverse(this.projectionMatrix);
    let v = SglMat4.mul4(invProjection, [xf, yf, -1, 1]);
    v = SglVec3.muls(v, 1 / v[3]);

    let h = Math.sqrt(v[0] * v[0] + v[1] * v[1]);

    // compute the intersection with the sphere
    let a = v[0] * v[0] + v[1] * v[1] + v[2] * v[2];
    let b = 2 * D * v[2];
    let c = D * D - this.rad * this.rad;

    let discriminant = b * b - 4 * a * c;
    if (discriminant > 0) {
      let t = (-b - Math.sqrt(discriminant)) / (2 * a);
      let t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      if (t < 0) t = 100 * this.rad;
      if (t1 < 0) t1 = 100 * this.rad;
      if (t1 < t) t = t1;

      //check if th sphere must be used
      if (t * v[0] * t * v[0] + t * v[1] * t * v[1] < this.rad * this.rad / 2)
        return [t * v[0], t * v[1], t * v[2] + D];
    }

    // compute the intersection with the hyperboloid
    a = 2 * v[2] * h;
    b = 2 * D * h;
    c = -this.rad * this.rad;

    discriminant = b * b - 4 * a * c;
    let t = (-b - Math.sqrt(discriminant)) / (2 * a);
    let t1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    if (t < 0) t = 0;
    if (t1 < 0) t1 = 0;
    if (t < t1) t = t1;

    return [t * v[0], t * v[1], t * v[2] + D];
  }
  updateCamera() {
    if (this.currentMode == 1) {
      return
    }

    const dir_world = SglMat4.mul4(this.V, this.t_V)
    let newPosition = []
    newPosition = SglMat4.col(this.V, 3)
    newPosition = SglVec4.add(newPosition, dir_world)

    SglMat4.col$(this.V, 3, [0.0, 0.0, 0.0, 1.0])
    var R_alpha = SglMat4.rotationAngleAxis(sglDegToRad(this.alpha / 10), [0, 1, 0])
    var R_beta = SglMat4.rotationAngleAxis(sglDegToRad(this.beta / 10), [1, 0, 0])
    this.V = SglMat4.mul(SglMat4.mul(R_alpha, this.V), R_beta)
    SglMat4.col$(this.V, 3, newPosition)
    this.position = newPosition
    this.alpha = 0
    this.beta = 0
  }
  forward(on) {
    this.t_V = [0, 0, -on / 1.0, 0.0]
  }
  backward(on) {
    this.t_V = [0, 0, on / 1.0, 0.0]
  }
  left(on) {
    this.t_V = [-on / 1.0, 0, 0, 0.0]
  }
  right(on) {
    this.t_V = [on / 1.0, 0, 0, 0.0]
  }
  up(on) {
    this.t_V = [0.0, on / 3.0, 0, 0.0]
  }
  down(on) {
    this.t_V = [0.0, -on / 3.0, 0, 0.0]
  }
  initKeyObserver() {
    this.handleKeyObserver = {
      W: (on) => {
        this.forward(on)
      },
      S: (on) => {
        this.backward(on)
      },
      A: (on) => {
        this.left(on)
      },
      D: (on) => {
        this.right(on)
      },
      Q: (on) => {
        this.up(on)
      },
      E: (on) => {
        this.down(on)
      },
      M: () => {
        this.currentMode = 1
      },
      N: () => {
        this.currentMode = 0
      }
    }
  }
  keyDown(keyCode) {
    this.handleKeyObserver[keyCode] && this.handleKeyObserver[keyCode](true)
  }
  keyUp(keyCode) {
    this.handleKeyObserver[keyCode] && this.handleKeyObserver[keyCode](false)
  }
  mouseButtonDown(x, y) {
    if (this.currentMode === 0) {
      this.aiming = true
      this.start_x = x
      this.start_y = y
    } else {
      this.currX = x
      this.currY = y
      this.orbiting = true
    }
  }
  mouseButtonUp() {
    if (this.orbiting) {
      const invTbMatrix = SglMat4.inverse(this.tbMatrix)
      this.V = SglMat4.mul(invTbMatrix, this.V)
      this.tbMatrix = SglMat4.identity()
      this.rotMatrix = SglMat4.identity()
      this.orbiting = false
    } else {
      this.aiming = false
    }
  }
  mouseMove(x, y) {
    if (this.currentMode == 0) {
      if (this.aiming) {
        this.alpha = x - this.start_x
        this.beta = -(y - this.start_y)
        this.start_x = x
        this.start_y = y
        this.updateCamera()
      }
      return
    }
    if (!this.orbiting) {
      return
    }
    const newX = x
    const newY = y

    const p0_prime = this.computeVector(this.currX, this.currY)
    const p1_prime = this.computeVector(newX, newY)
    const axis = SglVec3.cross(p0_prime, p1_prime)
    const axis_length = SglVec3.length(SglVec3.sub(p0_prime, p1_prime))
    let angle = axis_length / this.rad
    angle = Math.acos(SglVec3.dot(p0_prime, p1_prime) / (SglVec3.length(p0_prime) * SglVec3.length(p1_prime)))
    if (angle > 0.00001) {
      this.rotMatrix = SglMat4.mul(SglMat4.rotationAngleAxis(angle, SglMat4.mul3(this.V, axis, 0.0)), this.rotMatrix)
    }
    const cz = SglVec3.length(SglMat4.col(this.V, 2))
    const dir_world = SglVec3.muls(SglMat4.col(this.V, 2), -2 * this.rad)
    const tbCenter = SglVec3.add(SglMat4.col(this.V, 3), dir_world)
    const tMatrixInv = SglMat4.translation(tbCenter)
    const tMatrix = SglMat4.translation(SglVec3.neg(tbCenter))
    this.tbMatrix = SglMat4.mul(tMatrixInv, SglMat4.mul(this.rotMatrix, tMatrix))
    this.currX = newX
    this.currY = newY
  }
  setView(stack) {
    this.updateCamera()
    const invV = SglMat4.inverse(this.V)
    stack.multiply(invV)
    stack.multiply(this.tbMatrix)
  }
}