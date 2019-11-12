
/**
 * 
 * @param {object} windshield 挡风玻璃
 * @param {object} rearmirror 后视镜
 * @param {object} perVertexColorShader 驾驶舱颜色融合片元程序
 */
export function drawCarbin(gl, perVertexColorShader, windshield, rearmirror) {
  gl.enable(gl.BLEND)
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
  gl.useProgram(perVertexColorShader)
  gl.uniformMatrix4fv(perVertexColorShader.uModelViewMatrixLocation, false, SglMat4.identity())
  gl.uniformMatrix4fv(perVertexColorShader.uProjectionLocation, false, SglMat4.identity())
  this.drawColoredObject(gl, windshield, [0.4, 0.8, 0.9, 1.0])
  gl.disable(gl.BLEND)

  gl.useProgram(perVertexColorShader)
  gl.uniformMatrix4fv(perVertexColorShader.uModelViewMatrixLocation, false, SglMat4.identity())
  gl.uniformMatrix4fv(perVertexColorShader.uProjectionMatrixLocation, false, SglMat4.identity())
  this.drawColoredObject(gl, rearmirror, [0.4, 0.8, 0.9, 1.0])
}