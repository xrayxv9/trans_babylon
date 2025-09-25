import './style.css'
import "@babylonjs/loaders"
import * as Babylon from "@babylonjs/core"
import { BlackJack } from './BlackJack.ts'

window.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
	const engine = new Babylon.Engine(canvas, true);
	Babylon.RenderingManager.MAX_RENDERINGGROUPS = 52;

	const createScene = () =>
	{
		const scene = new Babylon.Scene(engine);
		const camera = new Babylon.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Babylon.Vector3(0, 2, -0.5), scene);
		camera.fov = 1.2;

		camera.beta += -0.3;

		//permet de se deplacer
		camera.attachControl(canvas, true);

		// enleve le zoom
		camera.lowerRadiusLimit = camera.radius;
		camera.upperRadiusLimit = camera.radius;

		// drag clic
		camera.panningSensibility = 0;
		
		// enleve la molette
		camera.wheelPrecision = 0;

		// empeche de tourner differment de droite / gauche
		camera.lowerBetaLimit = camera.beta;
		camera.upperBetaLimit = camera.beta;
		const light = new Babylon.HemisphericLight("light", new Babylon.Vector3(0, 1, 0), scene);
		light.diffuse = new Babylon.Color3(1, 1, 1);
		return { scene, camera };
	}
	const { scene } = createScene();


	scene.collisionsEnabled = true;
	Babylon.SceneLoader.ImportMesh(null, "./", "new_table.glb", scene, (meshes) =>{
		meshes.forEach(mesh =>{
			mesh.checkCollisions = true;
		});
	});
	const game:BlackJack = new BlackJack(scene);
	game.startGame();
	engine.setHardwareScalingLevel(0.6); // ou 2
	engine.runRenderLoop(() => {
		scene.render();
		// console.log(engine.getFps().toFixed() + "fps");
	});
})
