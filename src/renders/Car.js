import drawWheel from './Wheel'
/**
 * 绘制汽车
 * @param {object} gl 绘图上下文对象
 * @param {object} stack 矩阵堆栈
 * @param {object} cylinder 原始圆柱体
 * @param {object} cone 原始圆锥体
 * @param {object} cube 原始正方体
 * @param {object} uModelViewMatrixLocation 模型视图矩阵变量在着色器中位置
 * @param {function} drawObject 绘制方法
 */
export default function drawCar (gl, stack, cylinder, cone, cube, uModelViewMatrixLocation, drawObject) {
	stack.push()
	// M_7 平移柱体到合适的位置，然后变换为轮子
	var M_7 = SglMat4.translation([1, 0.3, 1.4])
	stack.multiply(M_7)
	drawWheel(gl, stack, cylinder, uModelViewMatrixLocation, drawObject)
	stack.pop()

	stack.push() 
	// M_5 平移柱体到合适的位置，然后变换为轮子
	var M_5 = SglMat4.translation([-1, 0.3, 1.4])
	stack.multiply(M_5)
	drawWheel(gl, stack, cylinder, uModelViewMatrixLocation, drawObject)
	stack.pop()

	stack.push()
	// M_4 平移柱体到合适的位置，然后变换为轮子
	var M_4 = SglMat4.translation([-1, 0.3, -1.6])
	stack.multiply(M_4)
	drawWheel(gl, stack, cylinder, uModelViewMatrixLocation, drawObject)
	stack.pop()

	stack.push()
	// M_6 平移柱体到合适的位置，然后变换为轮子
	var M_6 = SglMat4.translation([1, 0.3, -1.6])
	stack.multiply(M_6)
	drawWheel(gl, stack, cylinder, uModelViewMatrixLocation, drawObject)
	stack.pop()

	stack.push()
	// 变换计算绘制车身
	var M_2_tra_0 = SglMat4.translation([0, 0.3, 0])
	stack.multiply(M_2_tra_0)

	var M_2_sca = SglMat4.scaling([1, 0.5, 2])
	stack.multiply(M_2_sca)

	var M_2_tra_1 = SglMat4.translation([0, 1, 0])
	stack.multiply(M_2_tra_1)

	gl.uniformMatrix4fv(uModelViewMatrixLocation, false, stack.matrix)
	drawObject(gl, cube, [0.8, 0.2, 0.2, 1.0], [0, 0, 0, 1.0])
	stack.pop()
}