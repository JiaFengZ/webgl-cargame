/**
 * 绘制树
 * @param {object} gl 绘图上下文对象
 * @param {object} stack 矩阵堆栈
 * @param {object} cylinder 原始圆柱体
 * @param {object} cone 原始圆锥体
 * @param {object} uModelViewMatrixLocation 模型视图矩阵变量在着色器中位置
 * @param {function} drawObject 绘制方法
 */
export default function drawTree (gl, stack, cylinder, cone, uModelViewMatrixLocation, drawObject) {
	stack.push()
	var M_0_tra1 = SglMat4.translation([0, 0.8, 0])
	stack.multiply(M_0_tra1)

	var M_0_sca = SglMat4.scaling([0.6, 1.65, 0.6])
	stack.multiply(M_0_sca)
  // 树顶
	gl.uniformMatrix4fv(uModelViewMatrixLocation, false, stack.matrix)
	drawObject(gl, cone, [0.13, 0.62, 0.39, 1.0], [0, 0, 0, 1.0])
	stack.pop()
  // 树干
	stack.push()
	var M_1_sca = SglMat4.scaling([0.25, 0.4, 0.25])
	stack.multiply(M_1_sca)

	gl.uniformMatrix4fv(uModelViewMatrixLocation, false, stack.matrix)
	drawObject(gl, cylinder, [0.70, 0.56, 0.35, 1.0], [0, 0, 0, 1.0])
	stack.pop()
}