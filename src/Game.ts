import { Player } from './Player.ts'
import { Bets } from './Bets.ts'
import * as Babylon from "@babylonjs/core"
import "@babylonjs/loaders"
import { SlotMachine } from './SlotMachine.ts';
import { BLACKJACK, SLOT_MACHINE } from './defineUtils.ts'

export class Game
{
	protected bets: Bets | null;
	protected scene: Babylon.Scene;
	protected engine: Babylon.Engine;
	private canvas: HTMLCanvasElement;
	protected static engine: Babylon.Engine;
	protected camera: Babylon.ArcRotateCamera;

	constructor(canvas:HTMLCanvasElement)
	{
		Babylon.RenderingManager.MAX_RENDERINGGROUPS = 52;
		this.engine = new Babylon.Engine(canvas, true);
		this.canvas = canvas;
		this.bets = null;
		this.scene = new Babylon.Scene(this.engine);
		this.camera = new Babylon.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Babylon.Vector3(0,0,0), this.scene);

		this.engine.runRenderLoop(() => {
			this.scene.render();
		});
	}

	lauch(gameToLauch:number)
	{
		if (gameToLauch == BLACKJACK)
		{
			// const bj = new BlackJack(this.canvas);
			// bj.startGame();
		}
		else if (gameToLauch == SLOT_MACHINE)
		{
			const sm = new SlotMachine(this.canvas);
			sm.init();
		}
	}

	/**
	 * method used to define everything in your sub classes
	 * it is an async method but can be used as a basic method
	 * @returns Promise<void>
	 * */
	async init(): Promise<void>
	{

	}

	/**
	 * Method to restart the Game, it resets the Game, and shows the bet screen
	 * @returns Promise<void>
	 * */
	async restartGame(): Promise<void>
	{
		this.reset();
		this.bets!.show();
	}
	/**
	 * Method to finish
	 * It resets everything you need before lauching a new Game
	 * @returns void
	 * */
	reset(): void
	{
		this.bets!.reset();
	}

	/**
	 * Lauch a Game
	 * You have to code it all
	 * @returns Promise<void>
	 * */
	async lauchGame(): Promise<void>
	{

	}

	/**
	 * The method that is called on the main
	 * It inits all the datas that needs to be
	 * @returns Promise<void>
	 * */
	async startGame(): Promise<void>
	{
		if (!this.bets)
			await this.init();
	}
}
