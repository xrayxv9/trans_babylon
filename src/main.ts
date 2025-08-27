import './style.css'
import "@babylonjs/loaders"
import * as Babylon from "@babylonjs/core"
import { Card3D } from './class3D'
import { Animations } from './Animation'

window.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
	const engine = new Babylon.Engine(canvas, true);
	Babylon.RenderingManager.MAX_RENDERINGGROUPS = 52;

	const createScene = () =>
	{
		const scene = new Babylon.Scene(engine);
		const camera = new Babylon.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Babylon.Vector3(0,150,-350), scene);
		camera.fov = 1.2;

		camera.beta += -0.11;
		camera.attachControl(canvas, true);
		const light = new Babylon.HemisphericLight("light", new Babylon.Vector3(0, 1, 0), scene);
		light.diffuse = new Babylon.Color3(1, 1, 1);
		return { scene, camera };
	}

	const { scene } = createScene();
	const deck = new Card3D();
	const mesh = Babylon.SceneLoader.ImportMesh(null, "./", "blackjack_table.glb", scene);
	Babylon.SceneLoader.ImportMesh(null, "./", "playing_cards.glb", scene, async function(meshes) {
		deck.meshes = meshes;
		await deck.shuffleTexture(scene);
	});

	const box = Babylon.MeshBuilder.CreateBox("affirmative", { 
		width: 10,
		height: 10,
		depth: 10
	}, scene);

	box.position = new Babylon.Vector3(0, 100, 100);
	box.actionManager = new Babylon.ActionManager(scene);
	box.actionManager.registerAction(new Babylon.ExecuteCodeAction(
		Babylon.ActionManager.OnPickTrigger,
		async function (evt){
			await deck.lauchAnim(scene, true, false);
		}
	));

	const validate = Babylon.MeshBuilder.CreateBox("affirmative", { 
		width: 10,
		height: 10,
		depth: 10
	}, scene);

	validate.position = new Babylon.Vector3(100, 100, 100);
	validate.actionManager = new Babylon.ActionManager(scene);
	validate.actionManager.registerAction(new Babylon.ExecuteCodeAction(
		Babylon.ActionManager.OnPickTrigger,
		async function (evt){
			await deck.lauchAnimDealer(scene, true, true, 0);
		}
	));

	const reset = Babylon.MeshBuilder.CreateBox("affirmative", { 
		width: 10,
		height: 10,
		depth: 10
	}, scene);

	reset.position = new Babylon.Vector3(0, 200, 100);
	reset.actionManager = new Babylon.ActionManager(scene);
	reset.actionManager.registerAction(new Babylon.ExecuteCodeAction(
		Babylon.ActionManager.OnPickTrigger,
		async function (evt){
			await deck.shuffleTexture(scene);
		}
	));

	engine.runRenderLoop(() => {
		scene.render();
	});
})
