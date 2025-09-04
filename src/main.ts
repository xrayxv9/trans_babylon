import './style.css'
import "@babylonjs/loaders"
import * as Babylon from "@babylonjs/core"
import { Card3D } from './class3D.ts'
import { Player } from './Player.ts'
import { Croupier } from './Croupier.ts'
import { Game } from './Game.ts'

window.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
	const engine = new Babylon.Engine(canvas, true);
	Babylon.RenderingManager.MAX_RENDERINGGROUPS = 52;

	const createScene = () =>
	{
		const scene = new Babylon.Scene(engine);
		const camera = new Babylon.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Babylon.Vector3(0,3, -1), scene);
		camera.fov = 1.2;

		camera.beta += -0.11;
		camera.attachControl(canvas, true);
		const light = new Babylon.HemisphericLight("light", new Babylon.Vector3(0, 1, 0), scene);
		light.diffuse = new Babylon.Color3(1, 1, 1);
		return { scene, camera };
	}


	const { scene } = createScene();
	const deck = new Card3D();
	Babylon.SceneLoader.ImportMesh(null, "./", "new_table.glb", scene);
	Babylon.SceneLoader.ImportMesh(null, "./", "playing_cards.glb", scene, async function(meshes) {
		deck.meshes = meshes;
		await deck.shuffleTexture();
	});
	const player:Player = new Player(deck); 
	const croupier:Croupier = new Croupier(deck);
	const game:Game = new Game(player, croupier, deck, scene);

	const box = Babylon.MeshBuilder.CreateBox("affirmative", { 
		width: 0.2,
		height: 0.2,
		depth: 0.2
	}, scene);

	box.position = new Babylon.Vector3(0, 2, 2);
	box.actionManager = new Babylon.ActionManager(scene);
	box.actionManager.registerAction(new Babylon.ExecuteCodeAction(
		Babylon.ActionManager.OnPickTrigger,
		async function (evt){
			if (player.canPickCard())
				await game.playerPicks();
		}
	));

	const reset = Babylon.MeshBuilder.CreateBox("affirmative", { 
		width: 0.2,
		height: 0.2,
		depth: 0.2
	}, scene);

	reset.position = new Babylon.Vector3(0, 4, 2);
	reset.actionManager = new Babylon.ActionManager(scene);
	reset.actionManager.registerAction(new Babylon.ExecuteCodeAction(
		Babylon.ActionManager.OnPickTrigger,
		async function (evt){
			await game.reset();
			await game.lauchGame();
		}
	));

	const finish = Babylon.MeshBuilder.CreateBox("affirmative", { 
		width: 0.2,
		height: 0.2,
		depth: 0.2
	}, scene);

	finish.position = new Babylon.Vector3(1, 4, 2);
	finish.actionManager = new Babylon.ActionManager(scene);
	finish.actionManager.registerAction(new Babylon.ExecuteCodeAction(
		Babylon.ActionManager.OnPickTrigger,
		async function (evt){
			await game.croupierTurn();
		}
	));



	engine.runRenderLoop(() => {
		scene.render();
	});
})
