import * as Babylon from "@babylonjs/core";
import { Card3D } from './class3D'
import { Animations } from './Animation'


export class Player
{
	private count: number;
	private countCards: number;
	private asNumber: number;
	private money: number;
	private anim: Animations;
	private deck: Card3D;

	constructor(cards: Card3D)
	{
		this.count = 0;
		this.countCards = 0;
		this.asNumber = 0;
		// faire call backend
		this.money = 0;
		this.anim = new Animations();
		this.deck = cards;	
	}

	async lauchAnim(scene: Babylon.Scene, toAdd:boolean, croupierCard:boolean)
	{
		let count:number;

		count = this.count;
		this.count++;
		this.anim.createAnimeCard(this.deck._deck[this.deck.getCards()].textures!, this.countCards);
		await this.deck.play(scene, toAdd, croupierCard);
		return count;
	}
}
