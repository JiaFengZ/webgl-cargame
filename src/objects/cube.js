/**
 * 一个边长2，中心在位于原点的立方体
 */
export default function Cube() {
  this.name = 'cube'
  this.vertices = new Float32Array([
    -1.0, -1.0,  1.0,
		1.0, -1.0,  1.0,
		-1.0,  1.0,  1.0,
		1.0,  1.0,  1.0,
		-1.0, -1.0, -1.0,
		1.0, -1.0, -1.0,
		-1.0,  1.0, -1.0,
		1.0,  1.0, -1.0
  ])
  this.triangleIndices = new Float32Array([
    0, 1, 2,  2, 1, 3,  // front
		5, 4, 7,  7, 4, 6,  // back
		4, 0, 6,  6, 0, 2,  // left
		1, 5, 3,  3, 5, 7,  // right
		2, 3, 6,  6, 3, 7,  // top
		4, 5, 0,  0, 5, 1   // bottom
  ])
  this.numVertices = this.vertices.length / 3
  this.numTriangles = this.triangleIndices.length / 3
}