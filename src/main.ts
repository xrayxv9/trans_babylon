import './style.css'
import "@babylonjs/loaders"
import * as Babylon from "@babylonjs/core"
import { slotMachine } from './slotMachine.ts'
import { Game } from './Game.ts';
import { SLOT_MACHINE } from './defineUtils.ts';

window.addEventListener("DOMContentLoaded", () => {
	const canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;

	const game:Game = new Game(canvas);
	game.lauch(SLOT_MACHINE);
})
