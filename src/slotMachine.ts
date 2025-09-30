import { Game } from './Game.ts'
import * as Babylon from "@babylonjs/core"
import { Player } from './Player.ts';
import { Animations } from './Animations.ts';

// les 5 caluls sont :
// x = Math.PI / 5;
// 0 * x, 2 * x, 4 * x, 6 * x, 8 * x

export class slotMachine extends Game
{
	private firstWheel: {"texture" :Babylon.AbstractMesh, "rotation": number} | {"texture": null, "rotation": -1};
	private secondWheel: {"texture" : Babylon.AbstractMesh, "rotation": number} |  {"texture": null, "rotation": -1};
	private thirdWheel: {"texture" : Babylon.AbstractMesh, "rotation": number} |  {"texture": null, "rotation": -1};
	private fourthWheel: {"texture" : Babylon.AbstractMesh, "rotation": number} |  {"texture": null, "rotation": -1};
	private lever: Babylon.AbstractMesh | null;
	private player: Player;
	private scene: Babylon.Scene;
	private anim: Animations;
	
	constructor(scene: Babylon.Scene)
	{
		super();
		this.anim = new Animations();
		this.player = new Player();
		this.firstWheel = {"texture": null, "rotation": -1};
		this.secondWheel =  {"texture": null, "rotation": -1};
		this.thirdWheel =  {"texture": null, "rotation": -1};
		this.fourthWheel =  {"texture": null, "rotation": -1};
		this.lever = null;
		this.scene = scene;
	}

	async init(): Promise<void>
	{
		const result = await Babylon.SceneLoader.ImportMeshAsync(null, "./", "slot_machine.glb", this.scene);
		this.lever = result.meshes[4];
		this.firstWheel!["texture"] = result.meshes[5];
		this.secondWheel!["texture"] = result.meshes[16];
		this.thirdWheel!["texture"] = result.meshes[17];
		this.fourthWheel!["texture"] = result.meshes[18];


		result.meshes.forEach(mesh =>{
			let i:number = 0;
			const rotate = mesh.rotation.clone();
			mesh.rotation = rotate.add(new Babylon.Vector3(Math.PI, Math.PI, Math.PI));
			i++;
		});
		this.anim.init(this.firstWheel!["texture"]);
		this.anim.init(this.secondWheel!["texture"]);
		this.anim.init(this.thirdWheel!["texture"]);
		this.anim.init(this.fourthWheel!["texture"]);

		this.lever!.actionManager = new Babylon.ActionManager(this.scene);
		this.lever!.actionManager.registerAction(new Babylon.ExecuteCodeAction(
			Babylon.ActionManager.OnPickTrigger,
			async () =>{
				await this.lauchGame();
			}
		));
	}

	generateAleatoryNumber(): number
	{
		return Math.floor(Math.random() * 5);
	}

	async lauchGame()
	{
		this.firstWheel["rotation"] = this.generateAleatoryNumber();
		this.scene.beginDirectAnimation(this.firstWheel["texture"], [this.firstWheel["texture"].animations[0]], 0, 90, false);
	}
}
