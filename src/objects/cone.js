
/**
 * 通过三角形分割构造一个圆锥体
 * 假设分辨率 resolution 为n，则底面圆周n个均匀顶点和圆心连接成n个三角形，同时与圆锥顶点也连接成n个三角形，共2n个三角形
 * 顶点顺序：0->圆锥顶点，1-n->底面顶点，n+1->底面圆心
 * 共n+2个顶点
 */
export default function Cone (resolution) {
  this.name = 'cone'
  this.vertices = new Float32Array(3 * (resolution + 2)) // n+2个顶点
  // 圆锥顶点
  this.vertices[0] = 0.0
  this.vertices[1] = 2.0
  this.vertices[2] = 0.0
  // 圆锥底面
  let radius = 1.0
  let angle
  let step = 2 * Math.PI / resolution
  let vertexoffset = 3
  for (let i = 0; i < resolution; i++) {
    angle += step * i
    this.vertices[vertexoffset] = radius * Math.cos(angle)
    this.vertices[vertexoffset + 1] = 0
    this.vertices[vertexoffset + 2] = radius * Math.sin(angle)
    vertexoffset += 3
  }
  // 底面中点
  this.vertices[vertexoffset] = 0.0
  this.vertices[vertexoffset + 1] = 0.0
  this.vertices[vertexoffset + 2] = 0.0

  // 定义三角形
  this.triangleIndices = new Float32Array(3 * 2 * resolution) // 三角形索引
  // 底面部分三角形
  let triangleoffset = 0
  for (let i = 0; i < resolution; i++) {
    this.triangleIndices[triangleoffset] = resolution + 1 // 底面中点
    this.triangleIndices[triangleoffset + 1] = 1 + (i % resolution)
    this.triangleIndices[triangleoffset + 2] = 1 + ((i + 1) % resolution)
    triangleoffset += 3
  }

  this.numVertices = this.vertices.length / 3
	this.numTriangles = this.triangleIndices.length / 3
}