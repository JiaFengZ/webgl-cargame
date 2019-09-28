/**
 * 实现全局客户端
 * 基础客户端框架实现NVMC：lib/nvmc.js
 * 客户端框架基本配置：lib/nvmc-config.js
 */

import UniformShader from './shaders/shaders.js'
import Triangle from './objects/Triangle.js'
import { DefaultRace } from './objects/race.js'
import baseClient from './base'
import NVMC from '../lib/nvmc.js'

import Cube from './objects/cube.js'
import Cylinder from './objects/cylinder.js'
import Cone from './objects/cone.js'
import Quadrilateral from './objects/Quadrilateral'
import Building from './objects/building'
import Track from './objects/track'

import drawCar from './renders/Car'
import drawTree from './renders/Tree'

import ChaseCamera from './cameras/ChaseCamera'
import PhotographerCamera from './cameras/PhotographerCamera'

const SglMat4 = window.SglMat4
// 覆盖默认跑道数据
NVMC.DefaultRace = DefaultRace

export default class NVMCClient extends baseClient {
  onInitialize () {
    /**
     * onInitialize方法会被 nvmc 游戏框架在页面加载时调用
     * game实例会被挂在当前客户端对象上
     */
    NVMC.log('初始化...')

    const game = this.game
    const gl = this.ui.gl
    game.player.color = [1.0, 0.0, 0.0, 1.0]
    // 添加控制事件
    this.initMotionKeyHandlers()
    this.stack = new SglMatrixStack()
    // 初始化场景源对象
    this.initializeObjects(gl)
    // 初始化观察相机
    this.initializeCameras()
    this.uniformShader = new UniformShader(gl)

    NVMC.log('初始化成功，点击游戏区域激活控制！')
  }

  initializeObjects (gl) {
    this.createObjects()
    this.createBuffers(gl)
  }

  initializeCameras () {
    this.cameras = []
    this.cameras[0] = new ChaseCamera()
    this.cameras[1] = new PhotographerCamera()
    this.n_cameras = 2
    this.currentCamera = 0
    this.cameras[1].position = this.game.race.photoPosition
  }

  nextCamera () {
    if (this.n_cameras - 1 > this.currentCamera) {
      this.currentCamera++
    }
  }

  prevCamera () {
    if (0 < this.currentCamera) {
      this.currentCamera--
    }
  }

  onDraw () {
    // 该方法会被游戏框架定时循环调用
    const gl = this.ui.gl
    this.drawScene(gl)
  }

  myPos () {
    return this.game.state.players.me.dynamicState.position
  }

  myOri () {
    return this.game.state.players.me.dynamicState.orientation
  }

  myFrame () {
    return this.game.state.players.me.dynamicState.frame
  }

  createObjectBuffers (gl, obj) {
    obj.vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, obj.vertices, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    obj.indexBufferTriangles = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferTriangles)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, obj.triangleIndices, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

    // 边
    const edges = new Uint16Array(obj.numTriangles * 3 * 2)
    for (let i = 0; i < obj.numTriangles; i++) {
      edges[i * 6 + 0] = obj.triangleIndices[i * 3 + 0]
      edges[i * 6 + 1] = obj.triangleIndices[i * 3 + 1]
      edges[i * 6 + 2] = obj.triangleIndices[i * 3 + 0]
      edges[i * 6 + 3] = obj.triangleIndices[i * 3 + 2]
      edges[i * 6 + 4] = obj.triangleIndices[i * 3 + 1]
      edges[i * 6 + 5] = obj.triangleIndices[i * 3 + 2]
    }

    obj.indexBufferEdges = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferEdges)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, edges, gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
  }

  createObjects () {
    this.cube = new Cube(10)
    this.cylinder = new Cylinder(10)
    this.cone = new Cone(10)

    // 跑道
    this.track = new Track(this.game.race.track)
    // 场地
    const bbox = this.game.race.bbox
    const quad = [
      bbox[0], bbox[1] - 0.01, bbox[2],
      bbox[3], bbox[1] - 0.01, bbox[2],
      bbox[3], bbox[1] - 0.01, bbox[5],
      bbox[0], bbox[1] - 0.01, bbox[5]
    ]
    this.ground = new Quadrilateral(quad)
    // 建筑
    const gameBuildings = this.game.race.buildings
    this.buildings = new Array(gameBuildings.length)
    for (let i = 0; i < gameBuildings.length; ++i) {
      this.buildings[i] = new Building(gameBuildings[i])
    }
  }

  createBuffers (gl) {
    this.createObjectBuffers(gl, this.cube)
    this.createObjectBuffers(gl, this.cylinder)
    this.createObjectBuffers(gl, this.cone)
    this.createObjectBuffers(gl, this.track)
    this.createObjectBuffers(gl, this.ground)

    for (let i = 0; i < this.buildings.length; ++i) {
      this.createObjectBuffers(gl, this.buildings[i])
    }
  }

  drawObject (gl, obj, fillColor, lineColor) {
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer)
    gl.enableVertexAttribArray(this.uniformShader.aPositionIndex)
    gl.vertexAttribPointer(this.uniformShader.aPositionIndex, 3, gl.FLOAT, false, 0, 0)

    gl.enable(gl.POLYGON_OFFSET_FILL) // 开启多边形偏移
    gl.polygonOffset(1.0, 1.0)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferTriangles)
    gl.uniform4fv(this.uniformShader.uColorLocation, fillColor)
    gl.drawElements(gl.TRIANGLES, obj.triangleIndices.length, gl.UNSIGNED_SHORT, 0)

    gl.disable(gl.POLYGON_OFFSET_FILL)

    gl.uniform4fv(this.uniformShader.uColorLocation, lineColor)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferEdges)
    gl.drawElements(gl.LINES, obj.numTriangles * 3 * 2, gl.UNSIGNED_SHORT, 0)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    gl.disableVertexAttribArray(this.uniformShader.aPositionIndex)
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
  }

  drawScene (gl) {
    const pos = this.myPos()
    const width = this.ui.width
    const height = this.ui.height
    const ratio = width / height

    gl.viewport(0, 0, width, height)

    // 清除绘图环境
    gl.clearColor(0.4, 0.6, 0.8, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    // 开启深度检测
    gl.enable(gl.DEPTH_TEST)
    gl.useProgram(this.uniformShader)

    // 设置投影矩阵
    // const ratio = width / height
    // const bbox = this.game.race.bbox
    // let winW = (bbox[3] - bbox[0])
    // let winH = (bbox[5] - bbox[2])
    // winW = winW * ratio * (winH / winW)
    // const P = SglMat4.ortho([-winW / 2, -winH / 2, 0.0], [winW / 2, winH / 2, 21.0])
    // gl.uniformMatrix4fv(this.uniformShader.uProjectionMatrixLocation, false, P)
    gl.uniformMatrix4fv(this.uniformShader.uProjectionMatrixLocation, false, SglMat4.perspective(3.14 / 4, ratio, 1, 200))

    const stack = this.stack
    stack.loadIdentity()
    // 设置视图矩阵（观察者视线）
    //const invV = SglMat4.lookAt([0, 20, 0], [0, 0, 0], [1, 0, 0])
    //stack.multiply(invV)
    this.cameras[this.currentCamera].setView(this.stack, this.myFrame())

    stack.push()
    const M_9 = this.myFrame() // 获取矩阵快照
    stack.multiply(M_9)
    // 绘制汽车
    this.drawCar(gl)
    stack.pop()

    // 绘制树木
    const trees = this.game.race.trees
    for (let t in trees) {
      stack.push()
      const M_8 = SglMat4.translation(trees[t].position)
      stack.multiply(M_8)
      this.drawTree(gl)
      stack.pop()
    }

    gl.uniformMatrix4fv(this.uniformShader.uModelViewMatrixLocation, false, stack.matrix)
    this.drawObject(gl, this.track, [0.9, 0.8, 0.7, 1.0], [0, 0, 0, 1.0]) // 绘制跑道
    this.drawObject(gl, this.ground, [0.3, 0.7, 0.2, 1.0], [0, 0, 0, 1.0]) // 绘制场地

    // 绘制建筑
    for (let i in this.buildings) {
      this.drawObject(gl, this.buildings[i], [0.8, 0.8, 0.8, 1.0], [0.2, 0.2, 0.2, 1.0])
    }

    gl.useProgram(null)
    gl.disable(gl.DEPTH_TEST)
  }

  drawCar (gl) {
    const { uModelViewMatrixLocation } = this.uniformShader
    const { stack, cylinder, cone, cube, drawObject } = this
    drawCar(gl, stack, cylinder, cone, cube, uModelViewMatrixLocation, drawObject.bind(this))
  }

  drawTree (gl) {
    const { uModelViewMatrixLocation } = this.uniformShader
    const { stack, cylinder, cone, drawObject } = this
    drawTree(gl, stack, cylinder, cone, uModelViewMatrixLocation, drawObject.bind(this))
  }

  initMotionKeyHandlers () {
    const game = this.game
    const carMotionKey = {}
    carMotionKey['W'] = (on) => {
      game.playerAccelerate = on
    }
    carMotionKey['S'] = (on) => {
      game.playerBrake = on
    }
    carMotionKey['A'] = (on) => {
      game.playerSteerLeft = on
    }
    carMotionKey['D'] = (on) => {
      game.playerSteerRight = on
    }
    this.carMotionKey = carMotionKey
  }

  onPlayerJoin (playerID) {
    NVMC.log('[Player Join] : ' + playerID)
    this.game.opponents[playerID].color = [0.0, 1.0, 0.0, 1.0]
  }
  
  onPlayerLeave (playerID) {
    NVMC.log('[Player Leave] :' + playerID)
  }
  
  onKeyDown (keyCode, event) {
    this.carMotionKey[keyCode] && this.carMotionKey[keyCode](true)
    this.cameras[this.currentCamera].keyDown(keyCode)
  }
  
  onKeyUp (keyCode, event) {
    if (keyCode === '2') {
      this.nextCamera()
      return
    }
    if (keyCode == '1') {
      this.prevCamera()
      return
    }
    this.carMotionKey[keyCode] && this.carMotionKey[keyCode](false)
    this.cameras[this.currentCamera].keyUp(keyCode)
  }

  onMouseButtonDown (button, x, y, event) {
    this.cameras[this.currentCamera].mouseButtonDown(x,y)
  }

  onMouseButtonUp (button, x, y, event) {
    this.cameras[this.currentCamera].mouseButtonUp()
  }

  onMouseMove (x, y, event) {
    this.cameras[this.currentCamera].mouseMove(x,y)
  }
  
}