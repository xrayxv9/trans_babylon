
export class Player
{
	protected money: number;
	protected betDone: boolean;
	protected playerName: string;

	constructor()
	{
		this.money = 100;
		this.betDone = false;
		this.playerName = "Cooper";
	}

	/**
	 * Get The amount of money the player has
	 * @returns a number 
	 */
	getMoney(): number
	{
		return this.money;
	}

	/**
	 * @param amount The amount of money to bet
	* Send the money to the Bets class
	* returns true if it can and false if it can't
	* if it can it will instantly remove the money from the users account
	* @returns boolean
	* */
	sendMoney(amount:number): boolean
	{
		if (this.money - amount >= 0)
		{
			this.money -= amount;
			return true;
		}
		return false;
	}

	/**
	 * @param amount The amount of money the user receives
	 * Used for the end of the game to give the player the money he deserves
	 * @returns void
	 */
	earnMoney(amount:number): void
	{
		this.money += amount;
	}

	/**
	 * Puts the boolean this.betDone to true once a bet has be succesfully done
	 * @returns void
	 */
	bet(): void
	{
		this.betDone = true;
	}

	/**
	 * Check if the player has already bet
	 * @returns boolean
	 * */
	getBet(): boolean
	{
		return this.betDone;
	}

	/**
	 * Used to lauch a new game and put back all the values to 0
	 *  @returns void
	 * */
	reset(): void
	{
		this.betDone = false;
	}

	/**
	 * Used to get the name Of the player
	 * @returns string
	 * */
	getName(): string
	{
		return this.playerName;
	}
}
