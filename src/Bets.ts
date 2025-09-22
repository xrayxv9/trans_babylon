import { Player } from './Player.ts'
import * as Gui from "@babylonjs/gui";
import { VERTICAL_BOT, VERTICAL_TOP, VERTICAL_CENTER, HORIZONTAL_LEFT, HORIZONTAL_RIGHT, HORIZONTAL_CENTER, NON_MODIFIER, MODIFIER } from './defineUtils.ts'

export class Bets
{
	private amount: number;
	private player: Player;

	private input: Gui.InputText;
	private modifierPanel: Gui.StackPanel;

	private lauch: () => Promise<void>;
	// private modifierFunction: () => void;
	
	private validateButton: Gui.Button;

	private _modifierOn: boolean;

	private texture: Gui.AdvancedDynamicTexture;
	private subTexture: Gui.StackPanel;
	private UI: Gui.Rectangle;

	constructor(player: Player, fct: ()=> Promise<void>, modifierOn:boolean)
	{
		this.texture = Gui.AdvancedDynamicTexture.CreateFullscreenUI("UI");
		this.subTexture = new Gui.StackPanel();

		this.input = new Gui.InputText();
		this.modifierPanel = new Gui.StackPanel();

		this.lauch = fct;
		this.UI = new Gui.Rectangle();

		this.player = player;
		this.amount = -1;

		this._modifierOn = modifierOn;

		this.validateButton = Gui.Button.CreateSimpleButton("Validate Button", "Lancer");

		this.init();
		this.hide();
	}
	
	private init()
	{
		this.initValidate();
		this.initInput(this.input);
		this.initModifier();
		this.initUI();


		const image = new Gui.Image("UI", "./UI.png");
		image.width = "400px";
		image.height = "600px";

		this.subTexture.paddingTop = "100px";
		this.subTexture.width = "400px";
		this.subTexture.height = "600px";
		this.subTexture.spacing = 25;

		this.UI.addControl(image);

		if (this._modifierOn)
		{
			this.subTexture.addControl(this.initTexts("Modifier : ", VERTICAL_TOP, HORIZONTAL_CENTER, "20px"));
			this.subTexture.addControl(this.modifierPanel);
		}
		else
		{
			this.subTexture.addControl(this.initTexts("Parié : ", VERTICAL_TOP, HORIZONTAL_CENTER));
			this.subTexture.addControl(this.input);
		}
		this.subTexture.addControl(this.initTexts("Vous avez : ", VERTICAL_TOP, HORIZONTAL_CENTER, "20px"));
		this.subTexture.addControl(this.initTexts(this.formatMoney() + "€", VERTICAL_TOP, HORIZONTAL_CENTER, "20px"));
		if (this._modifierOn)
			this.subTexture.addControl(this.validateButton);


		this.UI.addControl(this.subTexture);
		this.texture.addControl(this.UI);
	}

	private initInput(input:Gui.InputText)
	{
		input.width = "200px";
		input.height = "40px";
		input.color = "white";
		input.background = "#141414";
		input.focusedColor = "#141414";
		input.focusedBackground = "#141414";
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
				if (this.checkBet(parseInt(this.input.text)))
				{
					this.hide();
					this.lauch();
				}
			}
		});
	}

	private formatMoney()
	{
		const money:string = this.player.getMoney().toString();

		// \B ne pas mettre l'espace au tout debut de la chaine, (\d{3}) regarde si il y a trois nombres
		// (?!) regarde que le char d'apres NE SOIT PAS un nombre \d pour ne pas mettre un esapce dans une chaine de trois nombres
		return money.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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

	initModifier()
	{
		this.modifierPanel.isVertical = false;
		this.modifierPanel.width = "400px";
		this.modifierPanel.height = "50px";
		this.modifierPanel.paddingLeft = "25px";
		this.modifierPanel.spacing = 25;
		this.modifierPanel.addControl(this.create2DButton(1, 1));
		this.modifierPanel.addControl(this.create2DButton(2, 2));
		this.modifierPanel.addControl(this.create2DButton(5, 5));
		this.modifierPanel.addControl(this.create2DButton(10, 10));
		this.modifierPanel.addControl(this.create2DButton(20, 20));
	}

	private create2DButton(buttonValue: number, buttonPrice: number): Gui.Button
	{
		const button = Gui.Button.CreateSimpleButton("button" + buttonValue, "x" + buttonValue.toString());
		button.width = "50px";
		button.height = "50px";
		button.fontSize = 30;
		button.cornerRadius = 50;

		button.onPointerUpObservable.add(() => {
			this.amount = buttonPrice;
		});
	
		return button;
	}

	private initValidate()
	{
		this.validateButton.width = "100px";
		this.validateButton.height = "50px";

		this.validateButton.cornerRadius = 10;

		this.validateButton.onPointerUpObservable.add(() => {
			if (this.checkBet(this.amount))
			{
				this.lauch();
				this.hide();
			}
		});

	}

	private initTexts(text:string, verticalPos:number, horizontalPos:number, verticalPadding:string = "0px"): Gui.Rectangle
	{
		const betText = new Gui.TextBlock();
		const panel = new Gui.Rectangle();

		panel.width = "350px";
		panel.height = "50px";
		panel.paddingTop = verticalPadding;
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
		if (!this._modifierOn)
			this.input.focus();
	}

	checkBet(amount: number): boolean
	{
		const player = this.player;

		if (amount < 0 || !player.sendMoney(amount))
			return false;
		else
		{
			this.amount = amount;
			this.UI.isVisible = false;
			this.player.bet();
			return true;
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
