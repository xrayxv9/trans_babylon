import { Player } from './Player.ts'
import * as Gui from "@babylonjs/gui";
import { VERTICAL_TOP, VERTICAL_CENTER, HORIZONTAL_RIGHT, HORIZONTAL_CENTER } from './defineUtils.ts'

export class Bets
{
	private amount: number;
	private player: Player;

	private modifierPanel: Gui.StackPanel;
	private modifierPanelFirstLine: Gui.StackPanel;
	private modifierPanelSecondLine: Gui.StackPanel;

	private input: Gui.InputText;
	private inputBackGround: Gui.Rectangle;

	private buttonFirstLine: Gui.Button[];
	private buttonSecondLine: Gui.Button[];

	private lauch: () => Promise<void>;
	// private modifierFunction: () => void;
	
	private validateButton: Gui.Button;
	private imageBackGround: Gui.Image;

	private _modifierOn: boolean;

	private texture: Gui.AdvancedDynamicTexture;
	private subTexture: Gui.StackPanel;
	private UI: Gui.Rectangle;

	constructor(player: Player, fct: ()=> Promise<void>, modifierOn:boolean)
	{
		this.texture = Gui.AdvancedDynamicTexture.CreateFullscreenUI("UI");
		this.subTexture = new Gui.StackPanel();
		this.imageBackGround = new Gui.Image("UI", "../../../public/blackjack/UI.png");

		this.modifierPanel = new Gui.StackPanel();
		this.modifierPanelFirstLine = new Gui.StackPanel();
		this.modifierPanelSecondLine = new Gui.StackPanel();

		this.input = new Gui.InputText();
		this.inputBackGround = new Gui.Rectangle();

		this.lauch = fct;
		this.UI = new Gui.Rectangle();

		this.player = player;
		this.amount = -1;

		this._modifierOn = modifierOn;

		this.validateButton = Gui.Button.CreateSimpleButton("Validate Button", "Lancer");

		this.buttonFirstLine = [];
		this.buttonSecondLine = [];

		this.init();
		this.hide();
	}
	
	private init()
	{
		this.initValidate();
		this.initInput(this.input);
		this.initModifier();
		this.initUI();


		this.imageBackGround.width = "400px";
		this.imageBackGround.height = "600px";

		this.subTexture.paddingTop = "100px";
		this.subTexture.width = "400px";
		this.subTexture.height = "600px";
		this.subTexture.spacing = 25;

		this.addControls();
	}

	private addControls()
	{
		this.UI.addControl(this.imageBackGround);

		if (this._modifierOn)
		{
			const hugeAmount = false;
			this.subTexture.addControl(this.initTexts("Modifier : ", VERTICAL_TOP, HORIZONTAL_CENTER, "20px"));
			this.modifierPanelFirstLine.addControl(this.create2DButton(1));
			this.modifierPanelFirstLine.addControl(this.create2DButton(2));
			this.modifierPanelFirstLine.addControl(this.create2DButton(5));
			this.modifierPanelFirstLine.addControl(this.create2DButton(10));
			this.modifierPanelFirstLine.addControl(this.create2DButton(20));
			this.modifierPanelSecondLine.addControl(this.create2DButton(100, hugeAmount));
			this.modifierPanelSecondLine.addControl(this.create2DButton(1000, hugeAmount));
			this.modifierPanelSecondLine.addControl(this.create2DButton(10000, hugeAmount));
			this.modifierPanel.addControl(this.modifierPanelFirstLine);
			this.modifierPanel.addControl(this.modifierPanelSecondLine);
			this.subTexture.addControl(this.modifierPanel);
		}
		else
		{
			this.subTexture.addControl(this.initTexts("Parier : ", VERTICAL_TOP, HORIZONTAL_CENTER));
			this.inputBackGround.addControl(this.input);
			this.subTexture.addControl(this.inputBackGround);
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
		this.inputBackGround.color = "#141414";
		this.inputBackGround.thickness = 2;
		this.inputBackGround.height = "40px";
		this.inputBackGround.width = "200px";
		this.inputBackGround.cornerRadius = 10;
		this.inputBackGround.background = "#141414";
		input.width = "200px";
		input.height = "40px";
		input.color = "white";
		input.background = "transparent";
		input.focusedColor = "transparent";
		input.focusedBackground = "transparent";
		input.thickness = 0;
		input.text = "";

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
					this.amount = parseInt(this.input.text);
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
		this.modifierPanelFirstLine.width = "400px";
		this.modifierPanelFirstLine.height = "50px";
		this.modifierPanelSecondLine.width = "400px";
		this.modifierPanelSecondLine.height = "50px";

		this.modifierPanelFirstLine.isVertical = false;
		this.modifierPanelFirstLine.spacing = 25;
		this.modifierPanelSecondLine.isVertical = false;
		this.modifierPanelSecondLine.spacing = 25;


		this.modifierPanelFirstLine.paddingLeft = "25px";
		this.modifierPanelSecondLine.paddingLeft = "25px";

		this.modifierPanel.width = "400px";
		this.modifierPanel.height = "150px";
		this.modifierPanel.spacing = 25;
	}

	private create2DButton(buttonValue: number, type:boolean = true): Gui.Button
	{
		const button = Gui.Button.CreateSimpleButton("button" + buttonValue, "x" + buttonValue.toString());
		button.height = "50px";
		button.color = "white";
		button.fontSize = 30;
		button.thickness = 2;
		if (type)
		{
			button.width = "50px";
			button.cornerRadius = 50;	
			this.buttonFirstLine.push(button);
		}
		else
		{
			button.width =  (buttonValue.toString().length * 25).toString() + "px";
			button.cornerRadius = 10;
			this.buttonSecondLine.push(button);
		}

		button.onPointerUpObservable.add(() => {
				this.amount = buttonValue;
		});

		button.onPointerUpObservable.add(() => {
			if (this.player.getMoney() - this.amount * 2 >= 0)
			{
				this.validateButton.color = "#6ca068";
				this.validateButton.textBlock!.color = "white";
				this.resetToWhite();
				button.color = "#569bda";
				button.textBlock!.color = "white";
			}
			else
			{
				this.validateButton.color = "#c83e3e";
				this.validateButton.textBlock!.color = "white";
				this.resetToWhite();
				button.color = "#569bda";
				button.textBlock!.color = "white";
			}
		});
		return button;
	}

	private resetToWhite()
	{
		this.buttonFirstLine.forEach(button =>{
			button.color = "white";
		})
		this.buttonSecondLine.forEach(button =>{
			button.color = "white";
		})
	}

	private initValidate()
	{
		this.validateButton.width = "100px";
		this.validateButton.height = "50px";
		this.validateButton.cornerRadius = 10;
		this.validateButton.color = "white";
		this.validateButton.thickness = 2;

		this.validateButton.onPointerUpObservable.add(() => {
			if (this.checkBet(this.amount * 2))
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

		if (amount <= 0 || !player.sendMoney(amount))
			return false;
		else
		{
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
		this.amount = -1;
		this.subTexture.clearControls();
		this.modifierPanel.clearControls();
		this.modifierPanelFirstLine.clearControls();
		this.modifierPanelSecondLine.clearControls();
		this.inputBackGround.clearControls();
		this.UI.clearControls();
		this.addControls();
		this.validateButton.color = "white";
	}
}
