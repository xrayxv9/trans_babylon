import * as Babylon from "@babylonjs/core";
import type { AbstractMesh } from "babylonjs";

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
	private countDealer: number;
    private _bool: boolean[][];
    public _deck: Card[];
	public meshes: Babylon.AbstractMesh[];

    constructor() {
        this._bool = Array.from({ length: 4 }, () => Array(13).fill(false));
		this._deck = [];
		this.meshes = [];
		this.count = 0;
		this.countDealer = 0;

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

	shuffleTexture()
	{
		this.count = 0;
		this.shuffle();
		for (let y:number = 0; y < 52; y++)
		{
			this._deck[y].textures!.scaling = new Babylon.Vector3(300, 10, 300);
			this._deck[y].textures!.position = new Babylon.Vector3(100, 50, 20 * y);
			this._deck[y].textures!.rotation = new Babylon.Vector3(Math.PI / 2, 0, 0);
		}
	}

	print()
	{
		for (let i:number = 0; i < 52; i++)
		{
			if (this._deck[i].color == 0)
				console.log(i + " : coeur : " + this._deck[i].value + " value global : " + this._deck[i].texture);
			else if (this._deck[i].color == 1)
				console.log(i + " : carreau : " + this._deck[i].value + " value global : " + this._deck[i].texture);
			else if (this._deck[i].color == 2)
				console.log(i + " :  pique : " + this._deck[i].value + " value global : " + this._deck[i].texture);
			else if (this._deck[i].color == 3)
				console.log(i + " : trefle : " + this._deck[i].value + " value global : " + this._deck[i].texture);
		}
	}

	startAnim(scene:Babylon.Scene, num:number)
	{
		scene.beginAnimation(this._deck[num].textures, 0, 90, false);
	}
}
