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
		const deck = new Card3D();
		deck.print();

		camera.beta += -0.11;
		camera.attachControl(canvas, true);
		const light = new Babylon.HemisphericLight("light", new Babylon.Vector3(0, 1, 0), scene);
		light.diffuse = new Babylon.Color3(1, 1, 1);
		const table = Babylon.SceneLoader.ImportMesh(null, "./", "blackjack_table.glb", scene, (table) => {

		Babylon.SceneLoader.ImportMesh(null, "./", "playing_cards.glb", scene, (meshes) => {
			console.log(meshes.length);
			meshes.map((mesh, i) => {
					if (i == 0) 
						return ;
				mesh.scaling = new Babylon.Vector3(500, 500, 500);
				mesh.position = new Babylon.Vector3(500, 500, 100 * i);
				mesh.rotation = new Babylon.Vector3(Math.PI / 2, 0, 0);
				deck._deck[i - 1].textures = mesh;
				// console.log(`[${i}] mesh.name = ${mesh.name}`);
				// if (i > 25)
				// 	mesh.isVisible = false;
    });
		});

});
		return scene;
	}

	const scene = createScene();

	engine.runRenderLoop(() => {
		scene.render();
	});
})
