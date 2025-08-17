import './style.css'
import "@babylonjs/loaders"
import * as Babylon from "@babylonjs/core"
import { Card3D } from './class3D'

window.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
	const engine = new Babylon.Engine(canvas, true);
	console.log(canvas);

	const createScene = () =>
	{
		const scene = new Babylon.Scene(engine);
		const camera = new Babylon.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Babylon.Vector3(0,150,-350), scene);
		camera.fov = 1.5;

		camera.beta += -0.11;
		camera.attachControl(canvas, true);
		const light = new Babylon.HemisphericLight("light", new Babylon.Vector3(0, 1, 0), scene);
		light.diffuse = new Babylon.Color3(1, 1, 1);

		return { scene, camera };
	}

	const { scene } = createScene();
	const deck = new Card3D();
	// const mesh = Babylon.SceneLoader.ImportMesh(null, "./", "blackjack_table.glb", scene);
	Babylon.SceneLoader.ImportMesh(null, "./", "playing_cards.glb", scene, function(meshes) {
	console.log(meshes.length);
		const frameRate: number = 60;

	

	meshes.map((mesh, i) => {
		if (i == 0) 
		{
			mesh.position = new Babylon.Vector3(125, 25, -25);
			return ;
		}
		mesh.scaling = new Babylon.Vector3(200, 200, 200);
		mesh.position = new Babylon.Vector3(100, 50, 25 * i);
		mesh.rotation = new Babylon.Vector3(Math.PI / 2, 0, 0);
		deck._deck[i - 1].textures = mesh;
			const animation = new Babylon.Animation(
				"MoveAnime",
				"position",
				frameRate,
				Babylon.Animation.ANIMATIONTYPE_VECTOR3,
				Babylon.Animation.ANIMATIONLOOPMODE_CONSTANT
			)

		const startPos = deck._deck[i - 1].textures?.position.clone();
		const endPos = new Babylon.Vector3(100, 100, 100);

		const keys = [
			{ "frame": 0, value:startPos },
			{ "frame": frameRate, value:endPos }
		]
		animation.setKeys(keys);

		deck._deck[i - 1].textures!.animations = [animation];
		});
	});

	const box = Babylon.MeshBuilder.CreateBox("affirmative", { 
		width: 10,
		height: 10,
		depth: 10
	}, scene);

	box.position = new Babylon.Vector3(0, 0, 10);

	box.actionManager = new Babylon.ActionManager(scene);
	box.actionManager.registerAction(new Babylon.ExecuteCodeAction(
		Babylon.ActionManager.OnPickTrigger,
		function (evt){
			if (deck._deck[0].textures)
			{
				console.log("dbawjkbdawbdhjkawbdawbj");
				scene.beginAnimation(deck._deck[0].textures.animations, 1, 60, false);
			}
		}
	));

	engine.runRenderLoop(() => {
		scene.render();
	});
})
