import * as Babylon from "@babylonjs/core";

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

export const playerPicksDefine = 1;
export const dealerTurnDefine = 2;
export const playAgainDefine = 3;
export const stopHereDefine = 4;

export const red = true;
export const green = false;
