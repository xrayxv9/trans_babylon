import './style.css'
import "@babylonjs/loaders"
import * as Babylon from "@babylonjs/core"
import { slotMachine } from './slotMachine';

export function Ale(num: number): number
{
	return Math.floor(Math.random() * num);
}

window.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
	const engine = new Babylon.Engine(canvas, true);
	console.log(canvas);

	const createScene = () =>
	{
		const scene = new Babylon.Scene(engine);
		const camera = new Babylon.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Babylon.Vector3(0,0,0), scene);
		camera.fov = 1.5;

		camera.beta += -0.11;
		camera.attachControl(canvas, true);
		const light = new Babylon.HemisphericLight("light", new Babylon.Vector3(0, 1, 0), scene);
		light.diffuse = new Babylon.Color3(1, 1, 1);
		return scene;
	}
	const scene = createScene();

	const game = new slotMachine(scene);
	game.init();


	engine.runRenderLoop(() => {
		scene.render();
	});
})
