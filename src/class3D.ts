import * as Babylon from "@babylonjs/core";

class Carte3D {
  mesh: Babylon.AbstractMesh;

  constructor(mesh: Babylon.AbstractMesh) {
    this.mesh = mesh;
  }

  tourner180() {
    this.mesh.rotation.y += Math.PI; // Tourne de 180° autour de Y
  }
}
