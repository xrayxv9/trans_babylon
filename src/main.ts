import './style.css'
import "@babylonjs/loaders"
import * as Babylon from "@babylonjs/core"

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

		// camera.attachControl(canvas, true);
		const light = new Babylon.HemisphericLight("light", new Babylon.Vector3(0, 1, 0), scene);
		light.diffuse = new Babylon.Color3(1, 1, 1);
		const mesh = Babylon.SceneLoader.ImportMesh(null, "./", "blackjack_table.glb", scene);
		const card1 = Babylon.SceneLoader.ImportMesh("", "./", "playing_cards.glb", scene,
		function (meshes){
				// while 
				let i:number = 1;
				// console.log(meshes.length + "coucou mon quoicoubaka\n");
				while (i < meshes.length)
				{
					meshes[i].scaling = new Babylon.Vector3(500, 500, 500);
					meshes[i].position = new Babylon.Vector3(0 + i * 5000, 0, 0);
					meshes[i].rotation = new Babylon.Vector3(0, 0, Math.PI);
					i++;
					console.log("i : " + i);
				}
			}
		);
		return scene;
	}

	const scene = createScene();

	engine.runRenderLoop(() => {
		scene.render();
	});
})
