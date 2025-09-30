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
	private anim: Animations;
	private canLauch: boolean;
	
	constructor(canvas:HTMLCanvasElement)
	{
		super(canvas);
		this.anim = new Animations();
		this.player = new Player();
		this.firstWheel = {"texture": null, "rotation": -1};
		this.secondWheel =  {"texture": null, "rotation": -1};
		this.thirdWheel =  {"texture": null, "rotation": -1};
		this.fourthWheel =  {"texture": null, "rotation": -1};
		this.lever = null;	
		this.canLauch = this.player.getMoney() > 10;
	}

	async init(): Promise<void>
	{
		this.initScene();
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

		this.lever!.actionManager = new Babylon.ActionManager(this.scene);
		this.lever!.actionManager.registerAction(new Babylon.ExecuteCodeAction(
			Babylon.ActionManager.OnPickTrigger,
			async () =>{
				console.log("can Lauch : " + this.canLauch + " money : " + this.player.getMoney());
				if (this.canLauch && this.player.getMoney() > 10)
				{
					this.player.sendMoney(10);
					this.anim.leverSuccess(this.lever!);
					await this.scene.beginDirectAnimation(this.lever, [this.lever!.animations[0]], 0, 70, false).waitAsync();
					await this.lauchGame();
				}
				else
				{
					this.anim.leverFail(this.lever!);
					await this.scene.beginDirectAnimation(this.lever, [this.lever!.animations[0]], 0, 70, false).waitAsync();
				}
			}
		));
	}

	initScene(): void
	{
		this.scene.removeCamera(this.camera);
		this.camera = new Babylon.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Babylon.Vector3(0,0.75,1.25), this.scene);
		this.camera!.fov = 1.5;
		this.camera.beta += 0.2;

		const light = new Babylon.HemisphericLight("light", new Babylon.Vector3(0, 1, 0), this.scene);
		light.diffuse = new Babylon.Color3(1, 1, 1);

	}

	generateAleatoryNumber(): number
	{
		return Math.floor(Math.random() * 5);
	}

	sleep(ms:number): Promise<void>
	{
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async makeRotations(mesh:Babylon.AbstractMesh)
	{
		await this.scene.beginDirectAnimation(mesh, [mesh.animations[0]], 0, 230, false).waitAsync();
	}

	async lauchGame()
	{
		this.canLauch = false;
		await this.reset();
		this.firstWheel["rotation"] = this.generateAleatoryNumber();
		this.secondWheel["rotation"] = this.generateAleatoryNumber();
		this.thirdWheel["rotation"] = this.generateAleatoryNumber();
		this.fourthWheel["rotation"] = this.generateAleatoryNumber();

		this.anim.initMesh(this.firstWheel["texture"]!, this.firstWheel["rotation"]);
		this.anim.initMesh(this.secondWheel["texture"]!, this.secondWheel["rotation"]);
		this.anim.initMesh(this.thirdWheel["texture"]!, this.thirdWheel["rotation"]);
		this.anim.initMesh(this.fourthWheel["texture"]!, this.fourthWheel["rotation"]);

		this.makeRotations(this.firstWheel["texture"]!);
		await this.sleep(100);
		this.makeRotations(this.secondWheel["texture"]!);
		await this.sleep(100);
		this.makeRotations(this.thirdWheel["texture"]!);
		await this.sleep(100);
		await this.makeRotations(this.fourthWheel["texture"]!);
		this.canLauch =  true;
	}

	async reset()
	{
		if (this.firstWheel["rotation"] != -1)
		{
			this.anim.resetMesh(this.firstWheel["texture"]!, this.firstWheel["rotation"]);
			this.anim.resetMesh(this.secondWheel["texture"]!, this.secondWheel["rotation"]);
			this.anim.resetMesh(this.thirdWheel["texture"]!, this.thirdWheel["rotation"]);
			this.anim.resetMesh(this.fourthWheel["texture"]!, this.fourthWheel["rotation"]);

			await this.makeRotations(this.firstWheel["texture"]!);
			await this.makeRotations(this.secondWheel["texture"]!);
			await this.makeRotations(this.thirdWheel["texture"]!);
			await this.makeRotations(this.fourthWheel["texture"]!);
		}
	}
}

