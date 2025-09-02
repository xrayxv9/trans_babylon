import * as Babylon from "@babylonjs/core";
import { Card3D } from './class3D'
import { Player } from './Player'
import { Croupier } from './Croupier'

export type Card = {
	value: number;
	color: number;
	texture: number;
	textures: Babylon.AbstractMesh | null;
};

export function Ale(num: number): number
{
	return Math.floor(Math.random() * num);
}

export function check(toCheck: boolean[][])
{
	for (let i:number = 0; i <= 3; i++)
	{
		for (let y:number = 0; y <= 13; y++)
			if (toCheck[i][y] == false)
				return true;
	}
	return false;
}

export const hidden:number = 1;
export const show:number = 2;
export const basic:number = 3;
