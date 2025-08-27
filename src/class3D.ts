import * as Babylon from "@babylonjs/core";
import type { AbstractMesh } from "babylonjs";
import { Animations } from './Animation'

type Card = {
	value: number;
	color: number;
	texture: number;
	textures: Babylon.AbstractMesh | null;
};

function Ale(num: number): number
{
	return Math.floor(Math.random() * num);
}

function check(toCheck: boolean[][])
{
	for (let i:number = 0; i <= 3; i++)
	{
		for (let y:number = 0; y <= 13; y++)
			if (toCheck[i][y] == false)
				return true;
	}
	return false;
}

export class Card3D{
	private count: number;
	private anim: Animations;
	private countDealer: number;
    private _bool: boolean[][];
    public _deck: Card[];
	public meshes: Babylon.AbstractMesh[];
	public totalPlayer:number;
	public totalCroupier:number;
	private asNumberCroupier;
	private asNumberPlayer;

    constructor() {
        this._bool = Array.from({ length: 4 }, () => Array(13).fill(false));
		this._deck = [];
		this.meshes = [];
		this.count = 0;
		this.countDealer = 0;
		this.anim = new Animations();
		this.totalPlayer = 0;
		this.totalCroupier = 0;
		this.asNumberCroupier = 0;
		this.asNumberPlayer = 0;

		this.shuffle();
    }

	setTexture( mesh:Babylon.AbstractMesh, i:number)
	{
		for (let y:number = 0; y < 52; y++)
		{
			if (this._deck[y].texture == i)
			{
				this._deck[y].textures = mesh;
				return y;
			}
		}
		return 0;
	}

	async lauchAnim(scene: Babylon.Scene, toAdd:boolean, croupierCard:boolean)
	{
		let count:number;

		count = this.count;
		this.count++;
		this.anim.createAnimeCard(this._deck[count + this.countDealer].textures!, count);
		await this.play(scene, count + this.countDealer, toAdd, croupierCard);
		return count;
	}

	async lauchAnimDealer(scene: Babylon.Scene, toAdd:boolean, croupierCard:boolean, animNumber:number)
	{
		let count:number;
		let whichCard;

		count = this.countDealer;
		whichCard = 3;
		switch (animNumber)
		{
			case 0:
			{
				this.anim.createAnimeCardCroupier(this._deck[count + this.count].textures!, count);
				this.countDealer++;
				whichCard = count + this.count; 
				break;
			}
			case 1:
			{
				this.anim.createAnimeHidden(this._deck[3].textures!, 1);
				this.countDealer++;
				break ;
			}
			case 2:
			{
				this.anim.returnCard(this._deck[3].textures!, 1);
				break ;
			}
		}
		await this.play(scene, whichCard, toAdd, croupierCard);
		return count;
	}

	shuffle()
	{
        this._bool = Array.from({ length: 4 }, () => Array(13).fill(false));
		this._deck = [];

		let color:number;
		let value:number;

		while (check(this._bool))
		{
			color = Ale(4);
			value = Ale(13);
			if (!this._bool[color][value])
			{
				this._bool[color][value] = true;
				this._deck.push({
					value: value, 
					color: color,
					texture: color * 13 + value,
					textures: null ,
				})
			}
		}
		this.meshes.map((mesh, i) => {
			if (i == 0) 
			{
				mesh.position = new Babylon.Vector3(125, 25, -25);
				return ;
			}
			this.setTexture(mesh, i - 1);
		});
	}

	addValuePlayer( num:number )
	{
		switch(num)
		{
			case 0:{
				if (this.totalPlayer + 11 < 21)
					this.totalPlayer += 11;
				else
					this.totalPlayer += 1;
				this.asNumberPlayer += 1;
				break ;
			}
			case 10:
			case 11:
			case 12:
			{
				this.totalPlayer += 10;
				break;
			}
			default:
			{
				this.totalPlayer += num + 1;
				break;
			}
		}
		if (this.totalPlayer > 21 && this.asNumberPlayer >= 1)
		{
			this.asNumberPlayer--;
			this.totalPlayer -= 10;
		}
	}

	addValueCroupier( num:number )
	{
		switch(num)
		{
			case 0:{
				if (this.totalCroupier + 11 < 21)
					this.totalCroupier += 11;
				else
					this.totalCroupier += 1;
				this.asNumberCroupier += 1;
				break ;
			}
			case 10:
			case 11:
			case 12:
			{
				this.totalCroupier += 10;
				break;
			}
			default:
			{
				this.totalCroupier += num + 1;
				break;
			}
		}
		if (this.totalCroupier > 21 && this.asNumberCroupier >= 1)
		{
			this.asNumberCroupier--;
			this.totalCroupier -= 10;
		}
	}

	async shuffleTexture(scene:Babylon.Scene)
	{
		this.shuffle();
		this.count = 0;
		this.countDealer = 0;
		this.totalCroupier = 0;
		this.totalPlayer = 0;
		this.asNumberCroupier = 0;
		this.asNumberPlayer = 0;

		for (let y:number = 0; y < 52; y++)
		{
			this._deck[y].textures!.renderingGroupId = 52 - y;
			this._deck[y].textures!.scaling = new Babylon.Vector3(300, 10, 300);
			this._deck[y].textures!.position = new Babylon.Vector3(100, 50, 20 * y);
			this._deck[y].textures!.rotation = new Babylon.Vector3(Math.PI / 2, 0, 0);
		}
		await this.lauchAnim(scene, true, false);
		await this.lauchAnimDealer(scene, true, true, 0);
		await this.lauchAnim(scene, true, false);
		await this.lauchAnimDealer(scene, false, true, 1);
		await this.lauchAnimDealer(scene, true, true, 2);
	}

	async play(scene: Babylon.Scene, num:number, toAdd:boolean, croupierCard:boolean)
	{
		await this.startAnim(scene, num);
		if (toAdd)
		{
			if (croupierCard)
			{
				this.addValueCroupier(this._deck[num].value);
				console.log("croupier : " + this.totalCroupier);
			}
			else
			{
				this.addValuePlayer(this._deck[num].value);
				console.log("Player : " + this.totalPlayer);
			}
		}
	}

	async startAnim(scene:Babylon.Scene, num:number)
	{
		await scene.beginAnimation(this._deck[num].textures, 0, 90, false).waitAsync();
	}
}
