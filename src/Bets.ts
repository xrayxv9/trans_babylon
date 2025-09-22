import { Player } from './Player.ts'
import * as Gui from "@babylonjs/gui";
import { VERTICAL_BOT, VERTICAL_TOP, VERTICAL_CENTER, HORIZONTAL_LEFT, HORIZONTAL_RIGHT, HORIZONTAL_CENTER, NON_MODIFIER, MODIFIER } from './defineUtils.ts'

export class Bets
{
	private amount: number;
	private player: Player;

	private input: Gui.InputText;
	private modifier: Gui.InputText;

	private lauch: () => Promise<void>;
	// private modifierFunction: () => void;

	private _modifierOn: number;

	private texture: Gui.AdvancedDynamicTexture;
	private subTexture: Gui.StackPanel;
	private UI: Gui.Rectangle;

	constructor(player: Player, fct: ()=> Promise<void>, modifierOn:number)
	{
		this.texture = Gui.AdvancedDynamicTexture.CreateFullscreenUI("UI");
		this.subTexture = new Gui.StackPanel();

		this.input = new Gui.InputText();
		this.modifier= new Gui.InputText();

		this.lauch = fct;
		this.UI = new Gui.Rectangle();

		this.player = player;
		this.amount = 0;

		this._modifierOn = modifierOn;
		this.init();
		this.hide();
	}
	
	private init()
	{
		this.initInput(this.input, NON_MODIFIER);
		this.initUI();

		const image = new Gui.Image("UI", "./UI.png");
		image.width = "400px";
		image.height = "600px";

		this.subTexture.background = "blue";
		this.subTexture.paddingTop = "50px";

		this.subTexture.width = "400px";
		this.subTexture.height = "600px";
		this.subTexture.addControl(this.initTexts("Parié : ", VERTICAL_TOP, HORIZONTAL_CENTER));
		this.subTexture.addControl(this.input);
		this.subTexture.addControl(this.initTexts("Modifier : ", VERTICAL_TOP, HORIZONTAL_CENTER, "20px"));
		this.UI.addControl(image);
		this.UI.addControl(this.subTexture);
		this.texture.addControl(this.UI);
	}

	private initInput(input:Gui.InputText, isModifier:boolean)
	{
		input.width = "200px";
		input.height = "40px";
		input.color = "white";
		input.background = "red";
		input.focusedColor = "red";
		input.focusedBackground = "red";
		input.thickness = 0;
		input.text = "";

		input.horizontalAlignment = HORIZONTAL_CENTER;
		input.verticalAlignment = VERTICAL_TOP;
		input.top = "20px";

		input.onBeforeKeyAddObservable.add((info) => {
			let key = info.currentKey;
			if (key < "0" || key > "9")
				info.addKey = false;
			else
				info.addKey = true;
		});
		input.onKeyboardEventProcessedObservable.add((event) =>{

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
		this.UI.cornerRadius = 20;
		this.UI.thickness = 0;

		this.UI.verticalAlignment = VERTICAL_CENTER;
		this.UI.horizontalAlignment = HORIZONTAL_RIGHT;
		this.UI.left = "-10px";
	}

	private initTexts(text:string, verticalPos:number, horizontalPos:number, verticalPadding:string = "0px"): Gui.Rectangle
	{
		const betText = new Gui.TextBlock();
		const panel = new Gui.Rectangle();

		panel.width = "350px";
		panel.height = "50px";
		panel.paddingTop = verticalPadding;
		panel.background = "green";
		panel.addControl(betText);
		panel.horizontalAlignment = horizontalPos;
		panel.verticalAlignment = verticalPos;
		betText.text = text;
		betText.fontSize = 30;
		betText.color = "white"
		panel.thickness = 0;

		return panel;
	}
	hide()
	{
		this.UI.isVisible = false;
	}

	show()
	{
		this.UI.isVisible = true;
		this.input.focus();
	}

	checkBet(): boolean
	{
		const player = this.player;
		const amount:number = parseInt(this.input.text);

		if (player.sendMoney(amount))
		{
			this.amount = amount;
			this.UI.isVisible = false;
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
