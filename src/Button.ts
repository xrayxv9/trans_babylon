import * as Babylon from "@babylonjs/core";
import { Game } from './Game.ts'

export class Button
{
	private posX: number;
	private posY: number;
	private box: Babylon.AbstractMesh | null; 
	private scene: Babylon.Scene;

	constructor(posX:number, posY:number, callback:() => Promise<void>, name:string, scene: Babylon.Scene)
	{
		this.posX = posX;
		this.box = null;
		this.posY = posY;
		this.scene = scene;
		Babylon.SceneLoader.ImportMesh(null, "./", "pseudo_buzzer.glb", scene, (mesh) => {
			this.box = mesh[0];
		});

		this.box!.actionManager = new Babylon.ActionManager(this.scene);
		this.box!.actionManager.registerAction(new Babylon.ExecuteCodeAction(
			Babylon.ActionManager.OnPickTrigger,
			async function (evt){
				callback();
			}

		))
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
