import * as Babylon from "@babylonjs/core";
import { grapeCalcul, orangeCalcul, watermelonCalcul, cherryCalcul, citrusCalcul, ORANGE, GRAPPE, WATERMELON, CITRUS, CHERRY } from './utils.ts'

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

	initMesh(mesh:Babylon.AbstractMesh, chosenAnimation:number)
	{
		if (chosenAnimation == ORANGE) 
			this.makeFruit(mesh, orangeCalcul, "Orange");
		else if (chosenAnimation == GRAPPE) 
			this.makeFruit(mesh, grapeCalcul, "Grape");
		else if (chosenAnimation == WATERMELON) 
			this.makeFruit(mesh, watermelonCalcul, "Grape");
		else if (chosenAnimation == CITRUS) 
			this.makeFruit(mesh, citrusCalcul, "Citrus");
		else if (chosenAnimation == CHERRY) 
			this.makeFruit(mesh, cherryCalcul, "Cherry");
	}

	resetMesh(mesh:Babylon.AbstractMesh, exAnimation:number)
	{
		if (exAnimation == GRAPPE)
			this.resetFruit(mesh, -grapeCalcul);
		else if (exAnimation == WATERMELON)
			this.resetFruit(mesh, -watermelonCalcul);
		else if (exAnimation == CITRUS)
			this.resetFruit(mesh, -citrusCalcul);
		else if (exAnimation == CHERRY)
			this.resetFruit(mesh, -cherryCalcul);
		else
			this.resetFruit(mesh, orangeCalcul);
	}

	resetFruit(mesh:Babylon.AbstractMesh, rotateValue:number)
	{
		const rotateStart = mesh.rotation.clone();
		const rotateEnd = rotateStart.add(new Babylon.Vector3(rotateValue, 0, 0));

		const keysRotate = [
			{"frame": 0, value:rotateStart},
			{"frame": 60, value:rotateEnd}
		]

		const fruitReset = new Babylon.Animation(
			"reset",
			"rotation",
			this.frameRate,
			Babylon.Animation.ANIMATIONTYPE_VECTOR3,
			Babylon.Animation.ANIMATIONLOOPMODE_CONSTANT
		)

		fruitReset.setKeys(keysRotate);
		mesh.animations = [fruitReset];

	}

	makeFruit(mesh:Babylon.AbstractMesh, rotateValue:number, fruit:string)
	{
		const rotateStart = mesh.rotation.clone();
		const rotateMidFirstTurn = rotateStart.add(new Babylon.Vector3(Math.PI, 0, 0));
		const rotateFirstTurn = rotateMidFirstTurn.add(new Babylon.Vector3(Math.PI, 0, 0));
		const rotateSecondTurn = rotateFirstTurn.add(new Babylon.Vector3(Math.PI * 2, 0, 0));
		const rotateThirdTurn = rotateSecondTurn.add(new Babylon.Vector3(Math.PI * 2, 0, 0));
		const rotateLastTurnFirstPart = rotateThirdTurn.add(new Babylon.Vector3(Math.PI, 0, 0));
		const rotateLastTurnSecondPart = rotateLastTurnFirstPart.add(new Babylon.Vector3(Math.PI, 0, 0));
		const rotateLastTurnThirdPart = rotateLastTurnSecondPart.add(new Babylon.Vector3(rotateValue, 0, 0));

		const keysRotate = [
			{"frame": 0, value:rotateStart},
			{"frame": 45, value:rotateMidFirstTurn},
			{"frame": 60, value:rotateFirstTurn},
			{"frame": 90, value:rotateSecondTurn},
			{"frame": 120, value:rotateThirdTurn},
			{"frame": 150, value:rotateLastTurnFirstPart},
			{"frame": 190, value:rotateLastTurnSecondPart},
			{"frame": 230, value:rotateLastTurnThirdPart},
		];

		const fruitTurn = new Babylon.Animation(
			fruit,
			"rotation",
			230,
			Babylon.Animation.ANIMATIONTYPE_VECTOR3,
			Babylon.Animation.ANIMATIONLOOPMODE_CONSTANT
		)

		fruitTurn.setKeys(keysRotate);
		mesh.animations = [fruitTurn];
	}

	leverSuccess(mesh:Babylon.AbstractMesh)
	{
		const rotateStart = mesh.rotation.clone();
		const rotateEnd = rotateStart.add(new Babylon.Vector3(-(2 * Math.PI / 10), 0, 0));

		const keysRotate = [
			{"frame": 0, value:rotateStart},
			{"frame": 30, value:rotateEnd},
			{"frame": 70, value:rotateStart}
		]

		const success = new Babylon.Animation(
			"lever Success",
			"rotation",
			70,
			Babylon.Animation.ANIMATIONTYPE_VECTOR3,
			Babylon.Animation.ANIMATIONLOOPMODE_CONSTANT
		)

		success.setKeys(keysRotate);
		mesh.animations = [success];
	}

	leverFail(mesh:Babylon.AbstractMesh)
	{
		const rotateStart = mesh.rotation.clone();
		const rotateEnd = rotateStart.add(new Babylon.Vector3(-(2 * Math.PI / 20), 0, 0));

		const keysRotate = [
			{"frame": 0, value:rotateStart},
			{"frame": 15, value:rotateEnd},
			{"frame": 40, value:rotateStart}
		]

		const success = new Babylon.Animation(
			"lever Success",
			"rotation",
			70,
			Babylon.Animation.ANIMATIONTYPE_VECTOR3,
			Babylon.Animation.ANIMATIONLOOPMODE_CONSTANT
		)

		success.setKeys(keysRotate);
		mesh.animations = [success];
	}
}
