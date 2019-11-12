export default function useStencli(gl, cabin, perVertexColorShader) {
  gl.enable(gl.STENCLI_TEST) // 开启模板缓存测试
  gl.clearStencli(0) // 清除模板缓存使所有位为0
  gl.stencliMask(~0) // 模板所有位允许写入
  // 将片元丢弃条件设置为模板缓存值之间比较的结果
  // 0xff mask 指定应用于两个值之间的位掩码
  // gl.ALWAYS指定测试类型，表示无论模板参考值掩码值多少所有片元都通过测试
  gl.stencliFunc(gl.ALWAYS, 1, 0xFF)
  // 指定模板如何更新缓存，取决于模板测试和深度测试的结果
  // 将dppass参数设置为REPLACE，告诉webgl用gl.stencilFunc指定的参考值1替换模板缓存当前的值
  gl.stencilOp(gl.REPLACE, gl.REPLACE, gl.REPLACE)

  gl.useProgram(perVertexColorShader)
  gl.uniformMatrix4fv(perVertexColorShader.uModelViewMatrixLocation, false, SglMat4.identity())
  gl.uniformMatrix4fv(perVertexColorShader.uProjectionMatrixLocation, false, SglMat4.identity())
  this.drawColoredObject(gl, cabin, [0.4, 0.8, 0.9, 1.0])

  // 改变模板测试方法，使得只有模板缓存值0的片元通过测试
  // 任何情况下模板缓存都不修改，结果是驾驶舱模块所有光栅化的像素，后续片元都不会通过模板测试
  gl.stencilFunc(gl.EQUAL, 0, 0xFF)
  gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP)
  gl.stencilMask(0)
}