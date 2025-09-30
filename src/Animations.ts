import * as Babylon from "@babylonjs/core";
import { grapeCalcul, orangeCalcul, watermelonCalcul, cherryCalcul, citrusCalcul } from './utils.ts'

export class Animations
{
	private frameRate: number;
	private wholeTurn: Babylon.Animation;

	constructor()
	{
		this.frameRate = 90;

		this.wholeTurn = new Babylon.Animation(
			"Make a whole Turn",
			"rotation",
			this.frameRate,
			Babylon.Animation.ANIMATIONTYPE_VECTOR3,
			Babylon.Animation.ANIMATIONLOOPMODE_CONSTANT
		)
	}

	init(mesh:Babylon.AbstractMesh)
	{
		this.makeWholeTurn(mesh);
		this.makeFruit(mesh, orangeCalcul);
		this.makeFruit(mesh, grapeCalcul);
		this.makeFruit(mesh, watermelonCalcul);
		this.makeFruit(mesh, citrusCalcul);
		this.makeFruit(mesh, cherryCalcul);
	}

	makeWholeTurn(mesh:Babylon.AbstractMesh)
	{
		const rotateStart = mesh.rotation.clone();
		const rotateEnd = rotateStart.add(new Babylon.Vector3(Math.PI * 2, 0, 0));

		const keysRotate = [
			{"frame": 0, value:rotateStart},
			{"frame": 60, value:rotateEnd},
			{"frame": this.frameRate, value:rotateEnd}
		];

		this.wholeTurn.setKeys(keysRotate);
		mesh.animations.push(this.wholeTurn);
	}

	makeFruit(mesh:Babylon.AbstractMesh, rotateValue:number)
	{
		const rotateStart = mesh.rotation.clone();
		const rotateEnd = rotateStart.add(new Babylon.Vector3(rotateValue, 0, 0));

		const keysRotate = [
			{"frame": 0, value:rotateStart},
			{"frame": 60, value:rotateEnd},
			{"frame": this.frameRate, value:rotateEnd}
		];

		this.wholeTurn.setKeys(keysRotate);
		mesh.animations.push(this.wholeTurn);
	}
}
