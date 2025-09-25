import * as Babylon from "@babylonjs/core";
import { Card3D } from './class3D.ts'
import type { Card } from './utils.ts'
import { Animations } from './Animation.ts'
import { Player } from './generalClasses/Player.ts'


export class BlackJackPlayer extends Player
{
	private count: number;
	private asNumber: number;
	private anim: Animations;
	private deck: Card3D;
	private pickedCardNumber:number;

	constructor(cards: Card3D)
	{
		super();
		this.count = 0;
		this.asNumber = 0;
		this.pickedCardNumber = 0;
		this.anim = new Animations();
		this.deck = cards;
	}

	canPickCard():boolean
	{
		if (this.count > 21 && this.asNumber >= 1)
		{
			console.log("mmhh bizzare");
			this.asNumber--;
			this.count -= 10;
		}
		if ((this.pickedCardNumber == 2 && this.count == 21) || this.count > 21)
		{
			return false;
		}
		return true;
	}

	async pickCard(scene: Babylon.Scene): Promise<boolean>
	{
		let card:Card;

		if (!this.canPickCard())
			return false;
		card = this.deck._deck[this.deck.getCards()];
		switch(card.value)
		{
			case 0:
			{
				if (this.count + 11 <= 21)
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
		if (!this.canPickCard())
			return false;
		return true;
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
		super.reset();
		this.count = 0;
		this.pickedCardNumber = 0;
		this.asNumber = 0;
	}
}
