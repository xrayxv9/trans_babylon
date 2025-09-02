import * as Babylon from "@babylonjs/core";
import { Card3D } from './class3D'
import { Player } from './Player'
import { Croupier } from './Croupier'
import { basic, hidden, show } from './utils'

export class Game
{
	private player:Player;
	private croupier:Croupier;
	private deck:Card3D;
	private scene:Babylon.Scene;

	constructor(player:Player, croupier:Croupier, deck:Card3D, scene:Babylon.Scene)
	{
		this.player = player;
		this.croupier = croupier;
		this.deck = deck;
		this.scene = scene;
	}

	async lauchGame()
	{
		await this.player.pickCard(this.scene);
		await this.croupier.pickCard(this.scene, basic);
		await this.player.pickCard(this.scene);
		await this.croupier.pickCard(this.scene, hidden);
	}

	async reset()
	{
		this.player.reset();
		this.croupier.reset();
		await this.deck.shuffleTexture();
	}

	async croupierPicks()
	{
		this.croupier.pickCard(this.scene, basic);
	}

	async croupierReturns()
	{
		await this.croupier.pickCard(this.scene, show);
	}

	async playerPicks()
	{
		await this.player.pickCard(this.scene);
		if (!this.player.canPickCard())
			await this.croupierTurn();
	}

	async croupierTurn()
	{
		await this.croupier.lauchAnim(this.scene, this.croupier.getDeck()._deck[3].textures!, show);
	}

}
