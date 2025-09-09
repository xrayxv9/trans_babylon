import * as Babylon from "@babylonjs/core";
import { Card3D } from './class3D.ts'
import { Player } from './Player.ts'
import { Croupier } from './Croupier.ts'
import { basic, hidden, show } from './utils.ts'
import { Button } from './Button.ts'
import { playerPicksDefine, dealerTurnDefine, playAgainDefine, stopHereDefine } from './utils.ts'

export class BlackJack
{
	private player:Player | null;
	private dealer:Croupier | null;
	private deck:Card3D | null;
	private scene:Babylon.Scene;

	private playerPicksButton: Button | null;
	private playAgainButton: Button | null;
	private stopPlayingButton: Button | null;
	private stopTurnButton: Button | null;

	constructor(scene:Babylon.Scene)
	{
		this.player = null;
		this.dealer = null;
		this.deck = null;
		this.scene = scene;
		this.scene.clearColor = new Babylon.Color4(0, 0.130, 0.121, 1);
		this.playerPicksButton = null;
		this.playAgainButton = null;
		this.stopPlayingButton = null;
		this.stopTurnButton = null;
	}
	
	async allInit (): Promise<void>
	{
		let posRightButtonX: number = 1.3;
		let posLeftButtonX: number = -1.3;
		let posButtonY: number = 2.4;
		let posButtonZ: number = -1.3;

		this.deck = new Card3D();
		await this.deck.init(this.scene);
		this.player = new Player(this.deck);
		this.dealer = new Croupier(this.deck);

				
		this.playerPicksButton = new Button(posRightButtonX, posButtonY, posButtonZ, playerPicksDefine, "player Picks", this.scene, this);
		await this.playerPicksButton.init();
		this.playAgainButton = new Button(posRightButtonX, posButtonY, posButtonZ, playAgainDefine, "Play again", this.scene, this);
		await this.playAgainButton.init();
		this.stopPlayingButton = new Button(posLeftButtonX, posButtonY, posButtonZ, stopHereDefine, "Reset", this.scene, this);
		await this.stopPlayingButton.init();
		this.stopTurnButton = new Button(posLeftButtonX, posButtonY, posButtonZ, dealerTurnDefine, "Dealer Turn", this.scene, this);
		await this.stopTurnButton.init();
	}

	async restartGame(): Promise<void>
	{
		await this.reset();
		await this.lauchGame();
	}

	async lauchGame(): Promise<void>
	{
		this.write("");
		this.stopPlayingButton!.hide();
		this.playAgainButton!.hide();
		await this.reset();
		await this.deck!.shuffleTexture();
		await this.playerPicks(false);
		await this.dealerPicks();
		await this.playerPicks(false);
		await this.dealer!.pickCard(this.scene, hidden);
		this.deck!.increaseCards();
		this.write("Voulez vous piocher ? (oui droite non gauche)");
		this.playerPicksButton!.show();
		this.stopTurnButton!.show();
	}

	async reset(): Promise<void>
	{
		this.player!.reset();
		this.dealer!.reset();
		this.deck!.reset();
		await this.deck!.shuffleTexture();
	}

	async dealerPicks(): Promise<void>
	{
		await this.dealer!.pickCard(this.scene, basic);
		this.deck!.increaseCards();
	}

	async dealerReturns(): Promise <void>
	{
		this.deck!.increaseCards();
		await this.dealer!.pickCard(this.scene, show);
	}

	async playerPicks(toShow: boolean = true): Promise<void>
	{
		this.playerPicksButton!.hide();
		this.stopTurnButton!.hide();
		await this.player!.pickCard(this.scene);
		this.deck!.increaseCards();
		if (!this.player!.canPickCard())
		{
			await this.dealerTurn();
			return ;
		}
		if (toShow)
		{
			this.playerPicksButton!.show();
			this.stopTurnButton!.show();
		}
	}

	async dealerTurn(): Promise<void>
	{
		this.playerPicksButton!.hide();
		this.stopTurnButton!.hide();
		await this.dealer!.lauchAnim(this.scene, this.dealer!.getDeck()._deck[3].textures!, show);
		while (this.dealer!.getCount() < 17)
			await this.dealerPicks();
		this.decideWinner();
	}

	sleep(ms: number) {
	  return new Promise(resolve => setTimeout(resolve, ms));
	}

	write(texte: string): void
	{
		const plane = Babylon.MeshBuilder.CreatePlane("plane", {width: 2, height: 1}, this.scene);

		const dynamicTexture = new Babylon.DynamicTexture("dynamic texture", {width:512, height:256}, this.scene, false);

		plane.position = new Babylon.Vector3(-5, 3, 3);
		dynamicTexture.drawText(texte, 75, 135, "bold 40px Arial", "white", "rgba(0, 33, 31, 1)");

		const mat = new Babylon.StandardMaterial("mat", this.scene);
		mat.diffuseTexture = dynamicTexture;

		plane.material = mat;
	}

	async decideWinner(): Promise<void>
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
		await this.sleep(3000);
		this.mainGame();
	}

	async mainGame(): Promise<void>
	{
		await this.allInit();
		
		this.write("Lancer une partie ?");
		this.playAgainButton!.show();
		this.stopPlayingButton!.show();
	}

}
