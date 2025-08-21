
import './style.css'
import "@babylonjs/loaders"
import * as Babylon from "@babylonjs/core"
import { Card3D } from './class3D'
import { Animations } from './Animation'

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}


window.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
	const engine = new Babylon.Engine(canvas, true);
	console.log(canvas);
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
	Babylon.SceneLoader.ImportMesh(null, "./", "playing_cards.glb", scene, function(meshes) {
		deck.meshes = meshes;
		deck.shuffleTexture();

		let anim = new Animations();
		let i:number = deck.lauchAnimDealer();
		anim.createAnimeCardCroupier(deck._deck[i].textures!, i);
		deck.startAnim(scene, i);
		let y:number = deck.lauchAnim();
		anim.createAnimeCard(deck._deck[y].textures!, y);
		deck.startAnim(scene, y);
		i = deck.lauchAnimDealer();
		anim.createAnimeHidden(deck._deck[i].textures!, i);
		deck.startAnim(scene, i);
		y = deck.lauchAnim();
		anim.createAnimeCard(deck._deck[y].textures!, y);
		deck.startAnim(scene, y);
		anim.returnCard(deck._deck[i].textures!, i);
		deck.startAnim(scene, i);
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
			const i:number = deck.lauchAnim();
			if (i >= 52)
				deck.shuffleTexture();
			let anim = new Animations();
			anim.createAnimeCard(deck._deck[i].textures!, i);
			deck.startAnim(scene, i);
		}
	));

	engine.runRenderLoop(() => {
		scene.render();
	});
})
