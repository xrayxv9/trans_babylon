import * as Babylon from "@babylonjs/core";
import { Card3D } from './class3D.ts'
import { Player } from './Player.ts'
import { Croupier } from './Croupier.ts'
import { basic, hidden, show } from './utils.ts'
import { Button } from './Button.ts'
import { playerPicksDefine, dealerTurnDefine, playAgainDefine } from './utils.ts'

export class BlackJack
{
	private player:Player | null;
	private dealer:Croupier | null;
	private deck:Card3D | null;
	private scene:Babylon.Scene;

	private playerPicksButton: Button | null;
	// private playAgainButton: Button;
	// private stopPlayingButton: Button;
	// private stopTurnButton: Button;

	constructor(scene:Babylon.Scene)
	{
		this.player = null;
		this.dealer = null;
		this.deck = null;
		this.scene = scene;
		this.scene.clearColor = new Babylon.Color4(0, 0.130, 0.121, 1);
		this.playerPicksButton = null;
	}
	
	async allInit ()
	{
		this.deck = new Card3D();
		await this.deck.init(this.scene);
		this.player = new Player(this.deck);
		this.dealer = new Croupier(this.deck);

				
		this.playerPicksButton = new Button(1.6, 2.4, -1.3, playerPicksDefine, "player Picks", this.scene, this);

	}

	async lauchGame()
	{
		await this.reset();
		await this.deck!.shuffleTexture();
		await this.playerPicks();
		await this.dealerPicks();
		await this.playerPicks();
		await this.dealer!.pickCard(this.scene, hidden);
		this.deck!.increaseCards();
	}

	async reset()
	{
		this.player!.reset();
		this.dealer!.reset();
		this.deck!.reset();
		await this.deck!.shuffleTexture();
	}

	async dealerPicks()
	{
		await this.dealer!.pickCard(this.scene, basic);
		this.deck!.increaseCards();
	}

	async dealerReturns()
	{
		this.deck!.increaseCards();
		await this.dealer!.pickCard(this.scene, show);
	}

	async playerPicks()
	{
		await this.player!.pickCard(this.scene);
		this.deck!.increaseCards();
		if (!this.player!.canPickCard())
			await this.dealerTurn();
	}

	async dealerTurn()
	{
		await this.dealer!.lauchAnim(this.scene, this.dealer!.getDeck()._deck[3].textures!, show);
		while (this.dealer!.getCount() < 17)
		{
			await this.dealerPicks();
		}
		this.decideWinner();
	}
	
	write(texte: string)
	{
		const plane = Babylon.MeshBuilder.CreatePlane("plane", {width: 2, height: 1}, this.scene);

		const dynamicTexture = new Babylon.DynamicTexture("dynamic texture", {width:512, height:256}, this.scene, false);

		plane.position = new Babylon.Vector3(-5, 3, 3);
		dynamicTexture.drawText(texte, 75, 135, "bold 40px Arial", "white", "red");

		const mat = new Babylon.StandardMaterial("mat", this.scene);
		mat.diffuseTexture = dynamicTexture;
		mat.emissiveColor = new Babylon.Color3(1, 1, 1); // Permet de voir le texte sans lumière

		// Ces deux lignes rendent les parties transparentes vraiment transparentes !
		mat.diffuseTexture.hasAlpha = true;
		mat.transparencyMode = Babylon.Material.MATERIAL_ALPHABLEND;

		plane.material = mat;
	}

	decideWinner()
	{
		let dealer:number = this.dealer!.getCount();
		let player:number = this.player!.getCount();

		if (player > 21)
			this.write("Vous avez burst !");
		else if (dealer > 21)
			this.write("Vous avez gagne !");
		else if (dealer == player)
			this.write("Egalite !");
		else if (dealer > player)
			this.write("Vous avez Perdu !");
		else 
			this.write("Vous avez gagne !");
	}

}
