import * as Babylon from "@babylonjs/core";

export class Animations
{
	private frameRate:number;

	constructor() {
		this.frameRate = 90;
	}

	createAnimeCard(mesh:Babylon.AbstractMesh, countCards:number)
	{
		const moveCard = new Babylon.Animation(
			"MoveAnime",
			"position",
			this.frameRate,
			Babylon.Animation.ANIMATIONTYPE_VECTOR3,
			Babylon.Animation.ANIMATIONLOOPMODE_CONSTANT
		)

		const startPos = mesh.position.clone();
		const endPos = new Babylon.Vector3(17000 - (countCards * 1000), -20000, 700 - (countCards * 10));

		const keys = [
			{ "frame": 0, value:startPos },
			{ "frame": 60, value:endPos },
			{ "frame": 90, value:endPos },
		];

		moveCard.setKeys(keys);

		const rotateCard = new Babylon.Animation(
			"rotateAnime",
			"rotation",
			this.frameRate,
			Babylon.Animation.ANIMATIONTYPE_VECTOR3,
			Babylon.Animation.ANIMATIONLOOPMODE_CONSTANT
		)

		const rotateStart = mesh.rotation.clone();
		const rotateEnd = rotateStart.add(new Babylon.Vector3(Math.PI, 0, 0));

		const keysRotate = [
			{ "frame": 0, value:rotateStart },
			{ "frame": 30, value:rotateStart },
			{ "frame": 60, value:rotateEnd },
			{ "frame": this.frameRate, value:rotateEnd }
		]
	
		rotateCard.setKeys(keysRotate);
		mesh!.animations = [moveCard, rotateCard];
		mesh.renderingGroupId = countCards;
	}

	createAnimeCardCroupier(mesh:Babylon.AbstractMesh, countCards:number)
	{
		const moveCard = new Babylon.Animation(
			"MoveAnime",
			"position",
			this.frameRate,
			Babylon.Animation.ANIMATIONTYPE_VECTOR3,
			Babylon.Animation.ANIMATIONLOOPMODE_CONSTANT
		)

		const startPos = mesh.position.clone();
		const endPos = new Babylon.Vector3(14000 - (countCards * 1000), -9000, 700 - (countCards * 10));

		const keys = [
			{ "frame": 0, value:startPos },
			{ "frame": 60, value:endPos },
			{ "frame": 90, value:endPos },
		];

		moveCard.setKeys(keys);

		const rotateCard = new Babylon.Animation(
			"rotateAnime",
			"rotation",
			this.frameRate,
			Babylon.Animation.ANIMATIONTYPE_VECTOR3,
			Babylon.Animation.ANIMATIONLOOPMODE_CONSTANT
		)

		const rotateStart = mesh.rotation.clone();
		const rotateEnd = rotateStart.add(new Babylon.Vector3(Math.PI, 0, 0));

		const keysRotate = [
			{ "frame": 0, value:rotateStart },
			{ "frame": 30, value:rotateStart },
			{ "frame": 60, value:rotateEnd },
			{ "frame": this.frameRate, value:rotateEnd }
		]
	
		rotateCard.setKeys(keysRotate);
		mesh!.animations = [moveCard, rotateCard];
		mesh.renderingGroupId = countCards;
	}
	createAnimeHidden(mesh:Babylon.AbstractMesh, countCards:number)
	{
		const moveCard = new Babylon.Animation(
			"MoveAnime",
			"position",
			this.frameRate,
			Babylon.Animation.ANIMATIONTYPE_VECTOR3,
			Babylon.Animation.ANIMATIONLOOPMODE_CONSTANT
		)

		const startPos = mesh.position.clone();
		const endPos = new Babylon.Vector3(14000 - (countCards * 1000), -9000, 700 - (countCards * 10));

		const keys = [
			{ "frame": 0, value:startPos },
			{ "frame": 60, value:endPos },
			{ "frame": 90, value:endPos },
		];

		moveCard.setKeys(keys);

		mesh!.animations = [moveCard];
		mesh.renderingGroupId = countCards;
	}

	returnCard(mesh:Babylon.AbstractMesh, countCards:number)
	{
		const rotateCard = new Babylon.Animation(
			"RotateAnime",
			"rotate",
			this.frameRate,
			Babylon.Animation.ANIMATIONTYPE_VECTOR3,
			Babylon.Animation.ANIMATIONLOOPMODE_CONSTANT
		)

		const rotateStart = mesh.rotation.clone();
		const rotateEnd = rotateStart.add(new Babylon.Vector3(Math.PI, 0, 0));

		const keysRotate = [
			{ "frame": 0, value:rotateStart },
			{ "frame": 30, value:rotateStart },
			{ "frame": 60, value:rotateEnd },
			{ "frame": this.frameRate, value:rotateEnd }
		]
	
		rotateCard.setKeys(keysRotate);
		mesh.renderingGroupId = countCards;
	}
}
