/**
 * 圆柱体，和圆锥体生成类似，resolution 为 n 时，包含 2n+2个顶点和4n个三角形
 * 顶点索引关系：0 - n-1 -> 底面 n - 2n-1 -> 顶面 2n -> 底面中心 2n+1->顶面中心
 */
export default function Cylinder () {
  this.name = "cylinder";

	// 顶点
	
	this.vertices = new Float32Array(3 * (2 * resolution + 2));
	
	let radius = 1.0
	let angle
	let step = 6.283185307179586476925286766559 / resolution
	
	// 底面
	let vertexoffset = 0
	for (let i = 0; i < resolution; i++) {
		angle = step * i
		this.vertices[vertexoffset] = radius * Math.cos(angle)
		this.vertices[vertexoffset+1] = 0.0;
		this.vertices[vertexoffset+2] = radius * Math.sin(angle)
		vertexoffset += 3
	}
	
	// 顶面
	for (let i = 0; i < resolution; i++) {
		angle = step * i
		this.vertices[vertexoffset] = radius * Math.cos(angle)
		this.vertices[vertexoffset+1] = 2.0
		this.vertices[vertexoffset+2] = radius * Math.sin(angle)
		vertexoffset += 3
	}
  
  // 底面中心
	this.vertices[vertexoffset] = 0.0
	this.vertices[vertexoffset+1] = 0.0
	this.vertices[vertexoffset+2] = 0.0
	vertexoffset += 3
	// 顶面中心
	this.vertices[vertexoffset] = 0.0
	this.vertices[vertexoffset+1] = 2.0
	this.vertices[vertexoffset+2] = 0.0
	
	
	// 三角形索引
	this.triangleIndices = new Uint16Array(3 * 4 * resolution) // 4n个三角形 3 * 4n 个顶点索引
	
	// 侧面
	let triangleoffset = 0
	for (let i = 0; i < resolution; i++) {
		this.triangleIndices[triangleoffset] = i
		this.triangleIndices[triangleoffset+1] = (i+1) % resolution
		this.triangleIndices[triangleoffset+2] = (i % resolution) + resolution
		triangleoffset += 3
		
		this.triangleIndices[triangleoffset] = (i % resolution) + resolution
		this.triangleIndices[triangleoffset+1] = (i+1) % resolution
		this.triangleIndices[triangleoffset+2] = ((i+1) % resolution) + resolution
		triangleoffset += 3
	}
	
	// 底面
	for (let i = 0; i < resolution; i++) {
		this.triangleIndices[triangleoffset] = i
		this.triangleIndices[triangleoffset+1] = (i+1) % resolution
		this.triangleIndices[triangleoffset+2] = 2 * resolution
		triangleoffset += 3
	}
	
	// 顶面
	for (let i = 0; i < resolution; i++) {
		this.triangleIndices[triangleoffset] = resolution + i
		this.triangleIndices[triangleoffset+1] = ((i+1) % resolution) + resolution
		this.triangleIndices[triangleoffset+2] = 2 * resolution + 1
		triangleoffset += 3
	}
		
	this.numVertices = this.vertices.length / 3
	this.numTriangles = this.triangleIndices.length / 3
}