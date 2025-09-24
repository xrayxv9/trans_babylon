import { Player } from './Player.ts'
import { Bets } from './Bets.ts'

export abstract class Game
{
	protected player: Player | null;
	protected bets: Bets | null;
	
	constructor()
	{
		this.player = null;
		this.bets = null;
	}

	abstract init(player: typeof Player): Promise<void>
}
