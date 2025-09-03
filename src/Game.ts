import * as Babylon from "@babylonjs/core";
import { Card3D } from './class3D.ts'
import { Player } from './Player.ts'
import { Croupier } from './Croupier.ts'
import { basic, hidden, show } from './utils.ts'

export class Game
{
	private player:Player;
	private croupier:Croupier;
	private deck:Card3D;
	private scene:Babylon.Scene;

	constructor(player:Player, croupier:Croupier, deck:Card3D, scene:Babylon.Scene)
	{
		this.player = player;
		this.croupier = croupier;
		this.deck = deck;
		this.scene = scene;
	}

	async lauchGame()
	{
		await this.deck.shuffleTexture();
		await this.playerPicks();
		await this.croupierPicks();
		await this.playerPicks();
		await this.croupier.pickCard(this.scene, hidden);
		this.deck.increaseCards();
	}

	async reset()
	{
		this.player.reset();
		this.croupier.reset();
		await this.deck.shuffleTexture();
	}

	async croupierPicks()
	{
		await this.croupier.pickCard(this.scene, basic);
		this.deck.increaseCards();
	}

	async croupierReturns()
	{
		this.deck.increaseCards();
		await this.croupier.pickCard(this.scene, show);
	}

	async playerPicks()
	{
		await this.player.pickCard(this.scene);
		if (!this.player.canPickCard())
			await this.croupierTurn();
		this.deck.increaseCards();
	}

	async croupierTurn()
	{
		await this.croupier.lauchAnim(this.scene, this.croupier.getDeck()._deck[3].textures!, show);
		while (this.croupier.getCount() < 17)
		{
			await this.croupierPicks();
		}
		this.decideWinner();
	}
	
	write(texte: string)
	{
		const plane = Babylon.MeshBuilder.CreatePlane("plane", {width: 400, height: 200}, this.scene);

		const dynamicTexture = new Babylon.DynamicTexture("dynamic texture", {width:512, height:256}, this.scene, false);

		plane.position = new Babylon.Vector3(-200, 100, 100);
		dynamicTexture.drawText(texte, 75, 135, "bold 40px Arial", "white", "red");

		const mat = new Babylon.StandardMaterial("mat", this.scene);
		mat.diffuseTexture = dynamicTexture;
		mat.emissiveColor = new Babylon.Color3(1, 1, 1); // Permet de voir le texte sans lumière

		// Ces deux lignes rendent les parties transparentes vraiment transparentes !
		mat.diffuseTexture.hasAlpha = true;
		mat.transparencyMode = Babylon.Material.MATERIAL_ALPHABLEND;

		plane.material = mat;
		this.scene.clearColor = new Babylon.Color4(0, 130, 121, 1);
	}

	decideWinner()
	{
		let croupier:number = this.croupier.getCount();
		let player:number = this.player.getCount();

		if (player > 21)
		{
			this.write("Vous avez burst !");
			return ;
		}
		else if (croupier > 21)
		{
			this.write("Vous avez gagne !");
			return ;
		}
		else if (croupier == player)
		{
			this.write("Egalite !");
			return ;
		}
		else if (croupier > player)
		{
			this.write("Vous avez Perdu !");
			return ;
		}
		else 
		{
			this.write("Vous avez gagne !");
			return ;
		}
	}

}
