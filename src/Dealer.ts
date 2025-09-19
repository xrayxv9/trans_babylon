import * as Babylon from "@babylonjs/core";
import { Card3D } from './class3D.ts'
import type { Card } from './utils.ts'
import { hidden, basic, show } from './utils.ts'
import { Animations } from './Animation.ts'


export class Dealer
{
	private count: number;
	private asNumber: number;
	private anim: Animations;
	private deck: Card3D;
	private pickedCardNumber:number;
	private hiddenCard:number;

	constructor(cards: Card3D)
	{
		this.count = 0;
		this.asNumber = 0;
		this.pickedCardNumber = 0;
		this.anim = new Animations();
		this.deck = cards;	
		this.hiddenCard = 0;
	}

	canPickCard(): boolean
	{
		if (this.count > 21 && this.asNumber >= 1)
		{
			this.count -= 10;
			this.asNumber--;
		}
		if ((this.pickedCardNumber == 2 && this.count == 17) || this.count > 17)
		{
			return false;
		}
		return true;
	}

	getDeck(): Card3D
	{
		return this.deck;
	}

	async pickCard(scene: Babylon.Scene, animNumber:number)
	{
		let card:Card;
		let value:number;

		if (!this.canPickCard())
		{
			return ;
		}
		card = this.deck._deck[this.deck.getCards()];
		switch(card.value)
		{
			case 0:{
				if (this.count + 11 < 21)
					value = 11;
				else
					value = 1;
				this.asNumber += 1;
				break ;
			}
			case 10:
			case 11:
			case 12:
			{
				value = 10;
				break;
			}
			default:
			{
				value = card.value + 1;
				break;
			}
		}
		if (animNumber != hidden)
			this.count += value;
		else
			this.hiddenCard = value;
		this.pickedCardNumber++;
		await this.lauchAnim(scene, card.textures!, animNumber);
	}

	async lauchAnim(scene: Babylon.Scene, mesh:Babylon.AbstractMesh, animNumber:number)
	{
		if (animNumber == hidden)
			this.anim.createAnimeHidden(mesh, 2);
		else if (animNumber == show)
		{
			this.anim.returnCard(mesh, 2);
			this.count += this.hiddenCard;
		}
		else if (animNumber == basic)
			this.anim.createAnimeCardDealer(mesh, this.pickedCardNumber);
		await this.deck.startAnim(scene, mesh);
	}

	getCount():number
	{
		return this.count;
	}

	reset():void
	{
		this.count = 0;
		this.asNumber = 0;
		this.pickedCardNumber = 0;
	}
}
