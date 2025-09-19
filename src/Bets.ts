import { Player } from './Player.ts'
import * as Gui from "@babylonjs/gui";

export class Bets
{
	private amount: number;
	private input: Gui.InputText;
	private player: Player;
	private lauch: () => Promise<void>;
	private texture: Gui.AdvancedDynamicTexture;

	constructor(player: Player, fct: ()=> Promise<void>)
	{
		this.texture = Gui.AdvancedDynamicTexture.CreateFullscreenUI("UI");
		this.input = new Gui.InputText();

		this.input.width = "200px";
		this.input.height = "40px";
		this.input.color = "white";
		this.input.background = "red";
		this.input.focusedColor = "red";
		this.input.focusedBackground = "red";
		this.input.text = "";

		this.lauch = fct;
		this.player = player;

		this.input.onBeforeKeyAddObservable.add((info) => {
			let key = info.currentKey;
			if (key < "0" || key > "9")
				info.addKey = false;
			else
				info.addKey = true;
		});
		this.input.onKeyboardEventProcessedObservable.add((event) =>{

			if (event.key == "Enter")
			{
				if (this.checkBet())
				{
					this.hide();
					this.lauch();
				}
			}
		});

		this.texture.addControl(this.input);
		this.amount = 0;
		this.hide();
	}

	hide()
	{
		this.input.isVisible = false;
	}

	show()
	{
		console.log("player money : " + this.player.getMoney());
		this.input.isVisible = true;
	}

	checkBet(): boolean
	{
		const player = this.player;
		const amount:number = parseInt(this.input.text);

		if (player.sendMoney(amount))
		{
			this.amount = amount;
			this.input.isVisible = false;
			this.player.bet();
			return true;
		}
		else
		{
			console.log("coucou ta grand mere");
			return false;
		}
	}

	getAmount():number
	{
		return this.amount;	
	}

	askAmount()
	{
		console.log(this.input.text);
	}

	reset()
	{
		this.input.text = "";
	}
}
