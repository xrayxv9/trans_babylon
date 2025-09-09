import './style.css'
import "@babylonjs/loaders"
import * as Babylon from "@babylonjs/core"
import { Card3D } from './class3D.ts'
import { Player } from './Player.ts'
import { Croupier } from './Croupier.ts'
import { BlackJack } from './BlackJack.ts'
import { Button } from './Button.ts'
import { playerPicksDefine, dealerTurnDefine, playAgainDefine } from './utils.ts'

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
	Babylon.SceneLoader.ImportMesh(null, "./", "new_table.glb", scene);
	const game:BlackJack = new BlackJack(scene);
	game.mainGame();
	// engine.setHardwareScalingLevel(0.2); // ou 2
	engine.runRenderLoop(() => {
		scene.render();
		// console.log(engine.getFps().toFixed() + "fps");
	});
})
