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
		camera.fov = 1.2;

		camera.beta += -0.11;
		// camera.attachControl(canvas, true);
		const light = new Babylon.HemisphericLight("light", new Babylon.Vector3(0, 1, 0), scene);
		light.diffuse = new Babylon.Color3(1, 1, 1);

		return { scene, camera };
	}

	const { scene } = createScene();
	const deck = new Card3D();
	const mesh = Babylon.SceneLoader.ImportMesh(null, "./", "blackjack_table.glb", scene);
	Babylon.SceneLoader.ImportMesh(null, "./", "playing_cards.glb", scene, function(meshes) {
		const frameRate: number = 90;
		meshes.map((mesh, i) => {
			if (i == 0) 
			{
				mesh.position = new Babylon.Vector3(125, 25, -25);
				return ;
			}
			mesh.scaling = new Babylon.Vector3(200, 200, 200);
			mesh.position = new Babylon.Vector3(100, 50, 25 * i);
			mesh.rotation = new Babylon.Vector3(Math.PI / 2, 0, 0);
			let y = deck.setTexture(mesh, i - 1);

			const animation = new Babylon.Animation(
				"MoveAnime",
				"position",
				frameRate,
				Babylon.Animation.ANIMATIONTYPE_VECTOR3,
				Babylon.Animation.ANIMATIONLOOPMODE_CONSTANT
			)

			const startPos = mesh.position.clone();
			const endPos = new Babylon.Vector3(10000, -9000, 900);

			const keys = [
				{ "frame": 0, value:startPos },
				{ "frame": 60, value:endPos },
				{ "frame": frameRate, value:endPos }
			];

			animation.setKeys(keys);

			const rotateAnime = new Babylon.Animation(
				"rotateAnime",
				"rotation",
				frameRate,
				Babylon.Animation.ANIMATIONTYPE_VECTOR3,
				Babylon.Animation.ANIMATIONLOOPMODE_CONSTANT
			)

			const rotateStart = mesh.rotation.clone();
			const rotateEnd = rotateStart.add(new Babylon.Vector3(Math.PI, 0, 0));

			const keysRotate = [
				{ "frame": 0, value:rotateStart },
				{ "frame": 30, value:rotateStart },
				{ "frame": 60, value:rotateEnd },
				{ "frame": frameRate, value:rotateEnd }
			]

			rotateAnime.setKeys(keysRotate);
			deck._deck[y].textures!.animations = [animation, rotateAnime];
		});
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
		function (evt){
			if (deck._deck[0].textures)
			{
				console.log(deck._deck[0].texture);
				scene.beginAnimation(deck._deck[0].textures, 0, 60, false);
			}
		}
	));

	engine.runRenderLoop(() => {
		scene.render();
	});
})
