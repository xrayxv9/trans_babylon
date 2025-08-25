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

	lauchAnim()
	{
		let count:number;

		count = this.count;
		this.count++;
		return count + this.countDealer;
	}

	lauchAnimDealer()
	{
		let count:number;

		count = this.countDealer;
		this.countDealer++;
		return count + this.count;
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

	addValueCroupier( num:number ):boolean
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
		if (this.totalCroupier >= 17)
			return false;
		else
			return true;
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
		let y:number = this.lauchAnim();
		this.anim.createAnimeCard(this._deck[y].textures!, y);
		await this.startAnim(scene, y, false);
		let i:number = this.lauchAnimDealer();
		this.anim.createAnimeCardCroupier(this._deck[i].textures!, i);
		await this.startAnim(scene, i, true);
		y = this.lauchAnim();
		this.anim.createAnimeCard(this._deck[y].textures!, y);
		await this.startAnim(scene, y, false);
		i = this.lauchAnimDealer();
		this.anim.createAnimeHidden(this._deck[i].textures!, i);
		await this.startAnim(scene, i, false);
		this.anim.returnCard(this._deck[i].textures!, i);
		await this.startAnim(scene, i, true);
	}

	async startAnim(scene:Babylon.Scene, num:number, bo:boolean)
	{
		await scene.beginAnimation(this._deck[num].textures, 0, 90, false).waitAsync();
		if (bo)
			this.addValueCroupier(this._deck[num].value);
		console.log(this.totalCroupier);
	}
}
