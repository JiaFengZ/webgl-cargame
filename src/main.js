/**
 * 实现全局客户端
 * 基础客户端框架实现NVMC：lib/nvmc.js
 * 客户端框架基本配置：lib/nvmc-config.js
 */
const NVMCClient = NVMCClient || {}

NVMCClient.ground = {}

NVMCClient.onInitialize = () => {
  NVMC.log('初始化...')
  const game = NVMCClient.game
  const handleKey = {}

  handleKey['W'] = (on) => {
    game.playerAcclerate = on
  }

  handleKey['S'] = (on) => {
    game.playerBrake = on
  }

  handleKey['A'] = (on) => {
    game.playerSteerLeft = on
  }

  handleKey['D'] = (on) => {
    game.palyerSteerRight = on
  }

  NVMCClient.handleKey = handleKey
  NVMCClient.stack = new SglMatrixStack()
  NVMCClient.initializeObjects(NVMCClient.ui.gl)
  NVMCClient.uniformShader = new uniformShader(this.ui.gl)
}

NVMCClient.drawObject = (gl, obj, fillColor, lineColor) => {
  gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer)
  gl.enableVertexAttribArray(NVMCClient.uniformShader.aPositionIndex)
  gl.vertexAttribPointer(NVMCClient.uniformShader.aPositionIndex, 3, gl.FLOAT, false, 0, 0)

  gl.enable(gl.POLYGON_OFFSET_FILL) // 开启多边形偏移
  gl.polygonOffset(1.0, 1.0)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferTriangles)
  gl.uniform4fv(NVMCClient.uniformShader.uColorLocation, fillColor)
  gl.drawElements(gl.TRIANGLES, obg.triangleIndices.length, gl.UNSIGNED_SHORT, 0)

  gl.disable(gl.POLYGON_OFFSET_FILL)

  gl.uniform4fv(NVMCClient.uniformShader.uColorLocation, lineColor)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indexBufferEdges)
  gl.drawElements(gl.LINES, obj.numTriangles * 3 * 2, gl.UNSIGNED_SHORT, 0)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
  gl.disableVertexAttribArray(NVMCClient.uniformShader.aPositionIndex)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
}

NVMCClient.createObjectBuffers = (gl, obj) => {
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

NVMCClient.initializeObjects = (gl) => {
  NVMCClient.triangle = new Triangle()
  NVMCClient.createObjectBuffers(gl, NVMCClient.triangle)
}