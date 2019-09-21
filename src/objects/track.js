/**
 * 跑道
 */
export default function Track (track) {
	this.name = "Track"

	let nv = track.pointsCount - 1 // 跑道分割成的四边形个数
	this.vertices = new Float32Array(nv * 2 * 3) // 顶点个数 2*nv

	let vertexOffset = 0
	for (let i = 0; i < nv; ++i) {
		let v = track.leftSideAt(i)
		this.vertices[vertexOffset + 0] = v[0]
		this.vertices[vertexOffset + 1] = v[1]
		this.vertices[vertexOffset + 2] = v[2]
		vertexOffset += 3
	}

	for (let i = 0; i < nv; ++i) {
		let v = track.rightSideAt(i)
		this.vertices[vertexOffset + 0] = v[0]
		this.vertices[vertexOffset + 1] = v[1]
		this.vertices[vertexOffset + 2] = v[2]
		vertexOffset += 3
	}

	this.triangleIndices = new Uint16Array(nv * 3 * 2) // 三角形顶点索引

	let triangleoffset = 0
	for (let i=0; i< nv; ++i) {
		this.triangleIndices[triangleoffset + 0] = i
		this.triangleIndices[triangleoffset + 1] = (i + 1) % nv
		this.triangleIndices[triangleoffset + 2] = nv + (i + 1) % nv
		triangleoffset += 3

		this.triangleIndices[triangleoffset + 0] = i
		this.triangleIndices[triangleoffset + 1] = nv + (i + 1) % nv
		this.triangleIndices[triangleoffset + 2] = nv + i
		triangleoffset += 3
	}

	this.numVertices  = nv * 2
	this.numTriangles = this.triangleIndices.length / 3
}