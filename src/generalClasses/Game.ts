import { Player } from './Player.ts'
import { Bets } from './Bets.ts'

export abstract class Game
{
	protected bets: Bets | null;
	
	constructor()
	{
		this.bets = null;
	}

	/**
	 * method used to define everything in your sub classes
	 * it is an async method but can be used as a basic method
	 * @returns Promise<void>
	 * */
	abstract init(): Promise<void>

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
	abstract lauchGame(): Promise<void>;

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
