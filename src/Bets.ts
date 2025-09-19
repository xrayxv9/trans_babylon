import { Player } from './Player.ts'
import * as Gui from "@babylonjs/gui";
import { VERTICAL_BOT, VERTICAL_TOP, VERTICAL_CENTER, HORIZONTAL_LEFT, HORIZONTAL_RIGHT, HORIZONTAL_CENTER } from './defineUtils.ts'

export class Bets
{
	private amount: number;
	private input: Gui.InputText;
	private player: Player;
	private lauch: () => Promise<void>;
	private texture: Gui.AdvancedDynamicTexture;
	private subTexture: Gui.StackPanel;
	private UI: Gui.Rectangle;

	constructor(player: Player, fct: ()=> Promise<void>)
	{
		this.texture = Gui.AdvancedDynamicTexture.CreateFullscreenUI("UI");
		this.subTexture = new Gui.StackPanel();
		this.input = new Gui.InputText();
		this.lauch = fct;
		this.player = player;
		this.UI = new Gui.Rectangle();
		this.amount = 0;

		this.init();
		this.hide();
	}
	
	private init()
	{
		this.initInput();
		this.initUI();

		const image = new Gui.Image("UI", "./UI.png");
		image.width = "400px";
		image.height = "600px";

		this.UI.addControl(image);
		this.initTexts();
		this.UI.addControl(this.input);
		this.subTexture.addControl(this.UI);
		this.texture.addControl(this.subTexture);
	}

	private initInput()
	{
		this.input.width = "200px";
		this.input.height = "40px";
		this.input.color = "white";
		this.input.background = "red";
		this.input.focusedColor = "red";
		this.input.focusedBackground = "red";
		this.input.text = "";

		this.input.horizontalAlignment = HORIZONTAL_CENTER;
		this.input.verticalAlignment = VERTICAL_TOP;
		this.input.top = "20px";

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
	}

	private initUI()
	{
		this.UI.width = "400px";
		this.UI.height = "600px";
		this.UI.cornerRadius = 20; // coins arrondis
		this.UI.thickness = 0;     // épaisseur bordure

		this.UI.verticalAlignment = VERTICAL_BOT;
		this.UI.horizontalAlignment = HORIZONTAL_RIGHT;
		this.UI.left = "-10px"; // marge à droite (0 = collé au bord droit)
	}

	private initTexts()
	{
		const betText = new Gui.TextBlock();
		const panel = new Gui.Rectangle();

		panel.addControl(betText);
		betText.horizontalAlignment = HORIZONTAL_CENTER;
		betText.verticalAlignment = VERTICAL_TOP;
		betText.text = "Parié :"
		betText.fontSize = 30;
		betText.color = "white"
		this.UI.addControl(betText);
	}

	hide()
	{
		this.subTexture.isVisible = false;
	}

	show()
	{
		this.subTexture.isVisible = true;
	}

	checkBet(): boolean
	{
		const player = this.player;
		const amount:number = parseInt(this.input.text);

		if (player.sendMoney(amount))
		{
			this.amount = amount;
			this.subTexture.isVisible = false;
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
