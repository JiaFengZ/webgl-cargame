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
    const handleKey = {}

    handleKey['W'] = (on) => {
      game.playerAccelerate = on
    }

    handleKey['S'] = (on) => {
      game.playerBrake = on
    }

    handleKey['A'] = (on) => {
      game.playerSteerLeft = on
    }

    handleKey['D'] = (on) => {
      game.playerSteerRight = on
    }

    this.handleKey = handleKey
    this.stack = new SglMatrixStack()
    this.initializeObjects(this.ui.gl)
    this.uniformShader = new UniformShader(this.ui.gl)
    NVMC.log('初始化成功，点击游戏区域激活控制！')
  }

  initializeObjects (gl) {
    this.triangle = new Triangle()
    this.createObjectBuffers(gl, this.triangle)
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
    const height = this.ui.height
    const width = this.ui.width
    const ratio = width / height
    const stack = this.stack
  
    gl.viewport(0, 0, width, height)
  
    gl.clearColor(0.34, 0.5, 0.74, 1.0)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    gl.useProgram(this.uniformShader)
    // 传递投影矩阵
    gl.uniformMatrix4fv(this.uniformShader.uProjectionMatrixLocation, false, SglMat4.perspective(3.14 / 4, ratio, 1, 100))
  
    if (!this.first) {
      this.first = true
      this.initPos = this.game.state.players.me.dynamicState.position
    }
  
    let pos = this.game.state.players.me.dynamicState.position
    // 视图矩阵
    const invV = SglMat4.lookAt([this.initPos[0], 10, this.initPos[2]], this.initPos, [0, 0, -1])
    stack.loadIdentity()
    stack.multiply(invV)
  
    const T = SglMat4.translation(pos) // 平移
    stack.multiply(T)
  
    const D = SglMat4.rotationAngleAxis(this.game.state.players.me.dynamicState.orientation, [0, 1, 0]) // 旋转
    stack.multiply(D)
    // 传递模型视图矩阵
    gl.uniformMatrix4fv(this.uniformShader.uModelViewMatrixLocation, false, stack.matrix)
  
    this.drawCar(gl)
  
    // 释放程序
    gl.useProgram(null)
    gl.disable(gl.DEPTH_TEST)
  }

  drawCar (gl) {
    this.drawObject(gl, this.triangle, [1, 1, 1, 1], [1, 1, 1, 1])
  }

  onDraw () {
    const gl = this.ui.gl
    this.drawScene(gl)
  }

  onPlayerJoin (playerID) {
    NVMC.log('[Player Join] : ' + playerID)
    this.game.opponents[playerID].color = [0.0, 1.0, 0.0, 1.0]
  }
  
  onPlayerLeave (playerID) {
    NVMC.log('[Player Leave] :' + playerID)
  }
  
  onKeyDown (keyCode, event) {
    this.handleKey[keyCode] && this.handleKey[keyCode](true)
  }
  
  onKeyUp (keyCode, event) {
    this.handleKey[keyCode] && this.handleKey[keyCode](false)
  }
  
}