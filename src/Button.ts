import * as Babylon from "@babylonjs/core";
import { BlackJack } from './BlackJack.ts'
import { playerPicks, dealerTurn, playAgain } from './utils.ts'

export class Button
{
	private posX: number;
	private posY: number;
	private box: Babylon.AbstractMesh | null; 
	private scene: Babylon.Scene;
	private bj: BlackJack;
	private functionToUse: number;

	constructor(posX:number, posY:number, numberOfFunction:number , name:string, scene: Babylon.Scene, game:BlackJack)
	{
		this.posX = posX;
		this.box = null;
		this.posY = posY;
		this.scene = scene;
		this.bj = game;
		this.functionToUse = numberOfFunction;

		Babylon.SceneLoader.ImportMesh(null, "./", "pseudo_buzzer.glb", scene, (meshes) => {
			this.box = meshes[0];
			this.box!.position = new Babylon.Vector3(this.posX, this.posY, 2);

			meshes.forEach(mesh => {
				mesh.actionManager = new Babylon.ActionManager(this.scene);
				mesh.actionManager.registerAction(new Babylon.ExecuteCodeAction(
					Babylon.ActionManager.OnPickTrigger,
					async () => {
						console.log("coucou je suis un texte");
						await this.chooseFunction()();
					}
				))
			});
		});

	}

	chooseFunction(): () => Promise<void>
	{
		console.log(this.functionToUse);
		switch (this.functionToUse)
		{
			case playerPicks:
				console.log("coucou playerPicks !");
				return this.bj.playerPicks.bind(this.bj);
			case dealerTurn:
				console.log("coucou dealerTurn");
				return this.bj.dealerTurn.bind(this.bj);
			case playAgain:
				console.log("coucou playAgain");
				return this.bj.lauchGame.bind(this.bj);
			default:
				console.log("coucou reset");
				return this.bj.reset.bind(this.bj);
		}
	}

	show()
	{
		this.box!.isVisible = true;
	}

	hide()
	{
		this.box!.isVisible = false;
	}
}
