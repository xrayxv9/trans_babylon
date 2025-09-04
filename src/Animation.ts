import * as Babylon from "@babylonjs/core";

export class Animations
{
	private frameRate:number;
	private moveCard:Babylon.Animation;
	private rotateCard:Babylon.Animation;

	constructor() {
		this.frameRate = 90;

		this.moveCard = new Babylon.Animation(
			"MoveAnime",
			"position",
			this.frameRate,
			Babylon.Animation.ANIMATIONTYPE_VECTOR3,
			Babylon.Animation.ANIMATIONLOOPMODE_CONSTANT
		)

		this.rotateCard = new Babylon.Animation(
			"rotateAnime",
			"rotation",
			this.frameRate,
			Babylon.Animation.ANIMATIONTYPE_VECTOR3,
			Babylon.Animation.ANIMATIONLOOPMODE_CONSTANT
		)
	}

	createAnimeCard(mesh:Babylon.AbstractMesh, countCards:number)
	{
		const startPos = mesh.position.clone();
		const endPos = startPos.add(new Babylon.Vector3(175 - countCards * 10, -175, 0));

		const keys = [
			{ "frame": 0, value:startPos },
			{ "frame": 60, value:endPos },
			{ "frame": 90, value:endPos },
		];

		this.moveCard.setKeys(keys);

		const rotateStart = mesh.rotation.clone();
		const rotateEnd = rotateStart.add(new Babylon.Vector3(Math.PI, 0, 0));

		const keysRotate = [
			{ "frame": 0, value:rotateStart },
			{ "frame": 30, value:rotateStart },
			{ "frame": 60, value:rotateEnd },
			{ "frame": this.frameRate, value:rotateEnd }
		]
	
		this.rotateCard.setKeys(keysRotate);
		mesh!.animations = [this.moveCard, this.rotateCard];
		mesh.renderingGroupId = countCards;
	}

	createAnimeCardCroupier(mesh:Babylon.AbstractMesh, countCards:number)
	{
		const startPos = mesh.position.clone();
		const endPos = startPos.add(new Babylon.Vector3(150- countCards * 10, -75, 0));

		const keys = [
			{ "frame": 0, value:startPos },
			{ "frame": 60, value:endPos },
			{ "frame": 90, value:endPos },
		];

		this.moveCard.setKeys(keys);

		const rotateStart = mesh.rotation.clone();
		const rotateEnd = rotateStart.add(new Babylon.Vector3(Math.PI, 0, 0));

		const keysRotate = [
			{ "frame": 0, value:rotateStart },
			{ "frame": 30, value:rotateStart },
			{ "frame": 60, value:rotateEnd },
			{ "frame": this.frameRate, value:rotateEnd }
		]
	
		this.rotateCard.setKeys(keysRotate);
		mesh!.animations = [this.moveCard, this.rotateCard];
		mesh.renderingGroupId = countCards;
	}

	createAnimeHidden(mesh:Babylon.AbstractMesh, countCards:number)
	{
		const startPos = mesh.position.clone();
		const endPos = startPos.add(new Babylon.Vector3(150- countCards * 10, -75, 0));

		const keys = [
			{ "frame": 0, value:startPos },
			{ "frame": 60, value:endPos },
			{ "frame": 90, value:endPos },
		];

		this.moveCard.setKeys(keys);

		mesh!.animations = [this.moveCard];
		mesh.renderingGroupId = countCards;
	}

	returnCard(mesh:Babylon.AbstractMesh, countCards:number)
	{
		const rotateStart = mesh.rotation.clone();
		const rotateEnd = rotateStart.add(new Babylon.Vector3(Math.PI, 0, 0));

		const keysRotate = [
			{ "frame": 0, value:rotateStart },
			{ "frame": 30, value:rotateStart },
			{ "frame": 60, value:rotateEnd },
			{ "frame": this.frameRate, value:rotateEnd }
		]
	
		this.rotateCard.setKeys(keysRotate);
		mesh!.animations = [this.rotateCard];
		mesh.renderingGroupId = countCards;
	}
}
