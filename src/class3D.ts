import * as Babylon from "@babylonjs/core";
import type { Card } from './utils.ts'
import { Ale, check } from './utils.ts'

export class Card3D{
    private _bool: boolean[][];
    public _deck: Card[];
	public meshes: Babylon.AbstractMesh[];
	private totalCards;

    constructor() {
        this._bool = Array.from({ length: 4 }, () => Array(13).fill(false));
		this._deck = [];
		this.meshes = [];
		this.totalCards = 0;

		this.shuffle();
    }

	async init(scene:Babylon.Scene)
	{
		Babylon.SceneLoader.ImportMesh(null, "./", "new_table.glb", scene);
		Babylon.SceneLoader.ImportMesh(null, "./", "playing_cards.glb", scene, async (meshes) => {
			this.meshes = meshes;
			await this.shuffleTexture();
		});
	}

	getCards():number
	{
		return this.totalCards;
	}
	increaseCards():void
	{
		this.totalCards++;
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
				mesh.position = new Babylon.Vector3(0, 2.228, 0);
				return ;
			}
			this.setTexture(mesh, i - 1);
		});
	}

	async shuffleTexture()
	{
		this.shuffle();
		for (let y:number = 0; y < 52; y++)
		{
			this._deck[y].textures!.renderingGroupId = 52 - y;
			this._deck[y].textures!.scaling = new Babylon.Vector3(2.5,2.5,2.5);
			this._deck[y].textures!.position = new Babylon.Vector3(-50 - (this._deck[y].value* 11.1), -30, ((-this._deck[y].color * 15) + 40) + y / 10);
			this._deck[y].textures!.rotation = new Babylon.Vector3(Math.PI / 2, 0, 0);
		}
	}

	reset()
	{
		this.totalCards = 0;
	}

	async startAnim(scene:Babylon.Scene, mesh:Babylon.AbstractMesh)
	{
		await scene.beginAnimation(mesh, 0, 90, false).waitAsync();
	}
}
