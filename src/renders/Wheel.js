/**
 * 绘制车轮，变换公式：M3 = S(0.05, 0.3, 0.3)R(90z)T(0, -1, 0)
 * @param {object} gl 绘图上下文对象
 * @param {object} stack 矩阵堆栈
 * @param {object} cylinder 原始圆柱体
 * @param {object} uModelViewMatrixLocation 模型视图矩阵变量在着色器中位置
 * @param {function} drawObject 绘制方法
 */
export default function drawWheel(gl, stack, cylinder, uModelViewMatrixLocation, drawObject) {
	stack.push() // 推入保存当前堆栈
	var M_3_sca = SglMat4.scaling([0.05, 0.3, 0.3]) // 缩放，得到直径0.6宽度0.1的车轮
	stack.multiply(M_3_sca)

	var M_3_rot = SglMat4.rotationAngleAxis(sglDegToRad(90), [0, 0, 1]) // 绕z轴旋转90度
	stack.multiply(M_3_rot)

	var M_3_tra = SglMat4.translation([0, -1, 0]) // 沿y轴平移-1个单位，使得中心位于原点
	stack.multiply(M_3_tra)

	gl.uniformMatrix4fv(uModelViewMatrixLocation, false, stack.matrix)
	drawObject(gl, cylinder, [0.8, 0.2, 0.2, 1.0], [0, 0, 0, 1.0])
	stack.pop() // 推出还原堆栈
}