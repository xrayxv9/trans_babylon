import * as Babylon from "@babylonjs/core";

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
    private _bool: boolean[][];
    public _deck: Card[];

    constructor() {
        this._bool = Array.from({ length: 4 }, () => Array(13).fill(false));
		this._deck = [];
		
		this.shuffle();
    }

	setTexture( mesh:Babylon.AbstractMesh, i:number)
	{
		for (let y:number = 0; i < 52; i++)
		{
			if (this._deck[y].texture != i)
				this._deck[y].textures = mesh;
		}
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
}
