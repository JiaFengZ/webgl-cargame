/**
 * 建筑
 */
export default function Building(b) {
  this.name = "Building"

  let nv = b.pointsCount
  this.vertices = new Float32Array(nv * 2 * 3)

  let vertexOffset = 0
  for (let i = 0; i < nv; ++i) {
    let v = b.positionAt(i)
    this.vertices[vertexOffset + 0] = v[0]
    this.vertices[vertexOffset + 1] = v[1]
    this.vertices[vertexOffset + 2] = v[2]
    vertexOffset += 3
  }

  for (let i = 0; i < nv; ++i) {
    let v = b.positionAt(i)
    this.vertices[vertexOffset + 0] = v[0]
    this.vertices[vertexOffset + 1] = b.heightAt(i)
    this.vertices[vertexOffset + 2] = v[2]
    vertexOffset += 3
  }

  this.triangleIndices = new Uint16Array(3 * (2 * nv + nv - 2))

  let triangleOffset = 0
  for (let i = 0; i < nv; ++i) {
    this.triangleIndices[triangleOffset + 0] = i
    this.triangleIndices[triangleOffset + 1] = (i + 1) % nv
    this.triangleIndices[triangleOffset + 2] = nv + (i + 1) % nv
    triangleOffset += 3

    this.triangleIndices[triangleOffset + 0] = i
    this.triangleIndices[triangleOffset + 1] = nv + (i + 1) % nv
    this.triangleIndices[triangleOffset + 2] = nv + i
    triangleOffset += 3
  }

  /* triangles for the roof */
  for (let i = 0; i < nv - 2; ++i) {
    this.triangleIndices[triangleOffset + 0] = nv
    this.triangleIndices[triangleOffset + 1] = nv + (i + 1)
    this.triangleIndices[triangleOffset + 2] = nv + (i + 2) % nv
    triangleOffset += 3
  }

  this.numVertices = nv * 2
  this.numTriangles = this.triangleIndices.length / 3
}
