import * as Babylon from "@babylonjs/core";
import { Card3D } from './class3D.ts'
import type { Card } from './utils.ts'
import { Animations } from './Animation.ts'


export class Player
{
	private count: number;
	private asNumber: number;
	private money: number;
	private anim: Animations;
	private deck: Card3D;
	private pickedCardNumber:number;

	constructor(cards: Card3D)
	{
		this.count = 0;
		this.asNumber = 0;
		this.pickedCardNumber = 0;
		// faire call backend
		this.money = 0;
		this.anim = new Animations();
		this.deck = cards;	
	}

	canPickCard():boolean
	{
		if (this.count > 21 && this.asNumber >= 1)
		{
			this.asNumber--;
			this.count -= 10;
		}
		console.log("player amount : " + this.count);
		if ((this.pickedCardNumber == 2 && this.count == 21) || this.count > 21)
		{
			return false;
		}
		return true;
	}

	async pickCard(scene: Babylon.Scene)
	{
		let card:Card;

		if (!this.canPickCard())
		{
			// ecrire non sur le jeu
			return ;
		}
		card = this.deck._deck[this.deck.getCards()];
		switch(card.value)
		{
			case 0:{
				if (this.count + 11 < 21)
					this.count += 11;
				else
					this.count += 1;
				this.asNumber += 1;
				break ;
			}
			case 10:
			case 11:
			case 12:
			{
				this.count+= 10;
				break;
			}
			default:
			{
				this.count += card.value + 1;
				break;
			}
		}
		this.pickedCardNumber++;
		await this.lauchAnim(scene, card.textures!);
	}

	async lauchAnim(scene: Babylon.Scene, mesh:Babylon.AbstractMesh)
	{
		this.anim.createAnimeCard(mesh, this.pickedCardNumber);
		await this.deck.startAnim(scene, mesh);
	}

	getCount():number
	{
		return this.count;
	}

	reset(): void
	{	
		this.count = 0;
		this.pickedCardNumber = 0;
	}
}
