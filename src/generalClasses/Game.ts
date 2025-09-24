import { Player } from './Player.ts'
import { Bets } from './Bets.ts'

export class Game
{
	protected player: Player | null;
	protected bets: Bets | null;
	
	constructor()
	{
		this.player = null;
		this.bets = null;
	}

	init(playerType: typeof Player)
	{
		this.player = new Player();
	}
}
