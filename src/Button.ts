import * as Babylon from "@babylonjs/core";
import { BlackJack } from './BlackJack.ts'
import { playerPicksDefine, dealerTurnDefine, playAgainDefine } from './utils.ts'

export class Button
{
	private posX: number;
	private posY: number;
	private posZ: number;
	private box: Babylon.AbstractMesh | null; 
	private scene: Babylon.Scene;
	private bj: BlackJack;
	private functionNumber: number;
	private functionToUse: () => Promise<void>;

	constructor(posX:number, posY:number, posZ:number, numberOfFunction:number, name:string, scene: Babylon.Scene, game:BlackJack)
	{
		this.posX = posX;
		this.posY = posY;
		this.posZ = posZ;
		this.box = null;
		this.scene = scene;
		this.bj = game;
		this.functionNumber = numberOfFunction;

		this.functionToUse = this.chooseFunction();
		Babylon.SceneLoader.ImportMesh(null, "./", "pseudo_buzzer.glb", scene, (meshes) => {
			this.box = meshes[0];
			this.box!.position = new Babylon.Vector3(this.posX, this.posY, this.posZ);

			meshes.forEach(mesh => {
				mesh.actionManager = new Babylon.ActionManager(this.scene);
				mesh.actionManager.registerAction(new Babylon.ExecuteCodeAction(
					Babylon.ActionManager.OnPickTrigger,
					async () => {
						await this.functionToUse();
					}
				))
			});
		});

	}

	chooseFunction(): () => Promise<void>
	{
		switch (this.functionNumber)
		{
			case playerPicksDefine:
				return this.bj.playerPicks.bind(this.bj);
			case dealerTurnDefine:
				return this.bj.dealerTurn.bind(this.bj);
			case playAgainDefine:
				return this.bj.lauchGame.bind(this.bj);
			default:
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
