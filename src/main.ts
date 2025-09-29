import './style.css'
import "@babylonjs/loaders"
import * as Babylon from "@babylonjs/core"

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

	Babylon.SceneLoader.ImportMesh(null, "./", "test.glb", scene, (meshes)=>{
		let i:number = 0;
		meshes.forEach(element => {
			if (i == 4 || i == 5 || i == 16 || i == 17 || i == 18)
			{
				const rotate = element.rotation.clone();
				element.rotation = rotate.add(new Babylon.Vector3(Ale(19), 0, 0));				
			}
			// else
			// 	element.isVisible = false;
			i++;
			const rotate = element.rotation.clone();
			element.rotation = rotate.add(new Babylon.Vector3(Math.PI, 0, 0));
		});
	});

	engine.runRenderLoop(() => {
		scene.render();
	});
})
