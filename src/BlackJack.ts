import * as Babylon from "@babylonjs/core";
import * as Gui from "@babylonjs/gui";
import { Card3D } from './class3D.ts'
import { Bets } from './Bets.ts'
import { Player } from './Player.ts'
import { Dealer } from './Dealer.ts'
import { basic, hidden, show } from './utils.ts'
import { Button } from './Button.ts'
import { playerPicksDefine, dealerTurnDefine, playAgainDefine, stopHereDefine, green, red } from './utils.ts'
import { MODIFIER, NON_MODIFIER } from './defineUtils.ts'

export class BlackJack
{
	private player:Player | null;
	private dealer:Dealer | null;
	private deck:Card3D | null;
	private scene:Babylon.Scene;

	private playerPicksButton: Button | null;
	private playAgainButton: Button | null;
	private stopPlayingButton: Button | null;
	private stopTurnButton: Button | null;

	private playerScore: Gui.TextBlock;
	private dealerScore: Gui.TextBlock;

	private bet: Bets | null;

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

		this.playerScore = new Gui.TextBlock();
		this.dealerScore = new Gui.TextBlock();

		this.bet = null;
	}
	
	async allInit (): Promise<void>
	{
		let posRightButtonX: number = 1.21;
		let posLeftButtonX: number = -1.05;
		let posButtonY: number = 2.34;
		let posButtonZ: number = -1.23;

		this.deck = new Card3D();
		await this.deck.init(this.scene);
		this.player = new Player(this.deck);
		this.dealer = new Dealer(this.deck);

		this.bet = new Bets(this.player, this.lauchGame.bind(this), NON_MODIFIER);
		this.playerPicksButton = new Button(posRightButtonX, posButtonY, posButtonZ, playerPicksDefine, "player Picks", this.scene, this);
		await this.playerPicksButton.init(green);
		this.playAgainButton = new Button(posRightButtonX, posButtonY, posButtonZ, playAgainDefine, "Play again", this.scene, this);
		await this.playAgainButton.init(green);
		this.stopPlayingButton = new Button(posLeftButtonX, posButtonY, posButtonZ, stopHereDefine, "Reset", this.scene, this);
		await this.stopPlayingButton.init(red);
		this.stopTurnButton = new Button(posLeftButtonX, posButtonY, posButtonZ, dealerTurnDefine, "Dealer Turn", this.scene, this);
		await this.stopTurnButton.init(red);


		const playerTexture = Gui.AdvancedDynamicTexture.CreateFullscreenUI("UI");
		this.playerScore.text = "";
		this.playerScore.resizeToFit = true;
		this.playerScore.color = "white";
		this.playerScore.fontSize = 60;
		this.playerScore.horizontalAlignment = Gui.Control.HORIZONTAL_ALIGNMENT_LEFT;
		this.playerScore.verticalAlignment = Gui.Control.VERTICAL_ALIGNMENT_TOP;
		this.playerScore.left = "0px";
		this.playerScore.top = "0px";
		playerTexture.addControl(this.playerScore);

		const dealerTexture = Gui.AdvancedDynamicTexture.CreateFullscreenUI("UI");
		this.dealerScore.text = "";
		this.dealerScore.resizeToFit = true;
		this.dealerScore.color = "white";
		this.dealerScore.fontSize = 60;
		this.dealerScore.horizontalAlignment = Gui.Control.HORIZONTAL_ALIGNMENT_RIGHT;
		this.dealerScore.verticalAlignment = Gui.Control.VERTICAL_ALIGNMENT_TOP;
		this.dealerScore.left = "0px";
		this.dealerScore.top = "0px";
		dealerTexture.addControl(this.dealerScore);
	}

	async restartGame(): Promise<void>
	{
		await this.reset();
		this.bet!.show();
	}

	async lauchGame(): Promise<void>
	{
		this.write("");
		this.stopPlayingButton!.hide();
		this.playAgainButton!.hide();
		await this.playerPicks(false);
		await this.dealerPicks();
		await this.playerPicks(false);
		await this.dealer!.pickCard(this.scene, hidden);
		this.deck!.increaseCards();
		this.write("Voulez vous piocher ?");
		this.playerPicksButton!.show(this.player!.canPickCard());
		this.stopTurnButton!.show();
	}

	async reset(): Promise<void>
	{
		this.player!.reset();
		this.dealer!.reset();
		this.deck!.reset();
		this.playerScore.text = "";
		this.dealerScore.text = "";
		await this.deck!.shuffleTexture();
		this.bet!.reset();
	}

	async dealerPicks(): Promise<void>
	{
		await this.dealer!.pickCard(this.scene, basic);
		this.deck!.increaseCards();
		this.showScores();
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

		await  this.player!.pickCard(this.scene);
		this.deck!.increaseCards();
		this.showScores();
		if (toShow)
		{
			this.playerPicksButton!.show(this.player!.canPickCard());
			this.stopTurnButton!.show();
		}
	}

	showScores(): void
	{
		this.playerScore.text = "player : " + this.player!.getCount().toString();
		this.dealerScore.text = "dealer : " + this.dealer!.getCount().toString();
	}

	async dealerTurn(): Promise<void>
	{
		this.playerPicksButton!.hide();
		this.stopTurnButton!.hide();
		await this.dealer!.lauchAnim(this.scene, this.dealer!.getDeck()._deck[3].textures!, show);
		this.showScores();
		while (this.dealer!.getCount() < 17)
		{
			await this.dealerPicks();
			await this.sleep(1);
		}
		this.decideWinner();
	}

	sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	write(texte: string): void
	{
		const plane = Babylon.MeshBuilder.CreatePlane("plane", {width: 2, height: 1}, this.scene);

		const dynamicTexture = new Babylon.DynamicTexture("dynamic texture", {width:512, height:256}, this.scene, false);

		plane.position = new Babylon.Vector3(0, 3, 3);
		dynamicTexture.drawText(texte, 75, 135, "bold 40px Arial", "white", "rgba(0, 33, 31, 1)");

		const mat = new Babylon.StandardMaterial("mat", this.scene);
		mat.diffuseTexture = dynamicTexture;

		plane.material = mat;
	}

	async decideWinner(): Promise<void>
	{
		let dealer:number = this.dealer!.getCount();
		let player:number = this.player!.getCount();
		let amount:number = this.bet!.getAmount();

		if (player > 21)
			this.write("Vous avez burst !");
		else if (dealer > 21)
		{
			this.write("Vous avez gagne !");
			this.player!.earnMoney(amount * 2);
		}
		else if (dealer == player)
		{
			this.write("Egalite !");
			this.player!.earnMoney(amount);
		}
		else if (dealer > player)
			this.write("Vous avez Perdu !");
		else 
		{
			this.write("Vous avez gagne !");
			this.player!.earnMoney(amount * 2);
		}
		await this.sleep(3000);
		this.mainGame();
	}

	async mainGame(): Promise<void>
	{
		if (!this.playAgainButton)
			await this.allInit();
		
		this.write("Lancer une partie ?");
		this.playAgainButton!.show();
		this.stopPlayingButton!.show();
	}

	getPlayer(): Player
	{
		return this.player!;
	}

}
