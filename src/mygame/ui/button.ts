import { Container, Texture, Sprite } from "pixi.js";
import { game } from "../..";
import { Assets } from "../../limbo/core/assets";
import { animate_dropIngredients } from "../animations";
import { Ingredient } from "../data/ingredient";
import { Mixture } from "../data/mixture";
import { IUpdateable, updateables } from '../main';
import { Tooltip } from "./tooltip";

export class Button extends Container implements IUpdateable {
    protected readonly idleButtonTexture: Texture;
    protected readonly hoverButtonTexture: Texture;
    protected readonly pressedButtonTexture: Texture;
    protected readonly buttonImageSprite: Sprite;
    protected readonly buttonBackgroundSprite: Sprite;
    public readonly buttonState = { isEngaged: false, isHovered: false }

    constructor(parentRow: Container, idleButtonTexture: Texture, hoverButtonTexture: Texture, pressedButtonTexture: Texture, buttonImageTexture: Texture, onClicked: Function) {
        super()
        updateables.push(this)
        this.idleButtonTexture = idleButtonTexture
        this.hoverButtonTexture = hoverButtonTexture
        this.pressedButtonTexture = pressedButtonTexture

        this.buttonBackgroundSprite = new Sprite(this.idleButtonTexture)
        this.buttonImageSprite = new Sprite(buttonImageTexture);
        this.buttonBackgroundSprite.addChild(this.buttonImageSprite)
        this.addChild(this.buttonBackgroundSprite);

        this.buttonBackgroundSprite.interactive = true;
        this.buttonBackgroundSprite.buttonMode = true;

        // javascript capture semantics are terrible
        let me = this

        function onButtonDown() {
            me.buttonState.isEngaged = true
        }

        function onButtonUp() {
            if (me.buttonState.isEngaged) {
                onClicked()
            }

            me.buttonState.isEngaged = false
        }

        function onButtonHover() {
            me.buttonState.isHovered = true
        }

        function onButtonUnhover() {
            me.buttonState.isHovered = false
        }

        function onButtonUpOutside() {
            me.buttonState.isEngaged = false
        }

        this.buttonBackgroundSprite.on("pointerdown", onButtonDown)
        this.buttonBackgroundSprite.on("pointerup", onButtonUp)
        this.buttonBackgroundSprite.on("pointerover", onButtonHover)
        this.buttonBackgroundSprite.on("pointerout", onButtonUnhover)
        this.buttonBackgroundSprite.on("pointerupoutside", onButtonUpOutside)
    }

    update(dt: number): void {
        this.buttonImageSprite.y = 0
        this.buttonBackgroundSprite.texture = this.idleButtonTexture

        if (this.buttonState.isHovered) {
            this.buttonBackgroundSprite.texture = this.hoverButtonTexture
            this.buttonImageSprite.y = 2
        }

        if (this.buttonState.isEngaged) {
            this.buttonBackgroundSprite.texture = this.pressedButtonTexture
            this.buttonImageSprite.y = 5
        }
    }
}

export class IngredientButton extends Button {
    readonly ingredient: Ingredient;

    constructor(parentRow: ButtonRow, ingredient: Ingredient) {
        super(
            parentRow,
            Assets.spritesheet("buttons").textures[0],
            Assets.spritesheet("buttons").textures[1],
            Assets.spritesheet("buttons").textures[2],
            ingredient.texture(),
            () => {
                parentRow.mixture.addIngredient(ingredient)
                animate_dropIngredients(ingredient)
            }
        )

        this.ingredient = ingredient;
    }
}

export class PageButton extends Button {
    constructor(parentRow: ButtonRow, pageDelta: number) {
        super(
            parentRow,
            Assets.spritesheet("buttons").textures[3],
            Assets.spritesheet("buttons").textures[4],
            Assets.spritesheet("buttons").textures[5],
            null, // <- bad code, we need an empty texture here
            () => { parentRow.movePage(pageDelta) }
        )

        if (pageDelta < 0) {
            this.buttonBackgroundSprite.anchor.x = 1
            this.buttonBackgroundSprite.scale.x = -1;
        }
    }
}

export class ButtonRow extends Container implements IUpdateable {
    static readonly buttonWidth = 128;
    static readonly padding = 10
    private currentPage: number;
    private readonly allIngredientButtons: IngredientButton[] = [];
    private readonly pageLength = 4
    private readonly pageLeftButton: PageButton;
    private readonly pageRightButton: PageButton;
    private readonly leftSpacer: Container = new Container();
    private readonly rightSpacer: Container = new Container();
    private readonly tooltip: Tooltip;
    readonly mixture: Mixture;

    constructor(tooltip: Tooltip, mixture: Mixture) {
        super()
        this.mixture = mixture;
        this.tooltip = tooltip;
        this.pageLeftButton = new PageButton(this, -1);
        this.pageRightButton = new PageButton(this, 1);
        updateables.push(this)
    }

    update(dt: number) {
        this.tooltip.setText("")
        for (let ingredientButton of this.allIngredientButtonsOnCurrentPage()) {
            if (ingredientButton.buttonState.isHovered) {
                this.tooltip.setText(ingredientButton.ingredient.name)
            }
        }
    }

    allIngredientButtonsOnCurrentPage(): IngredientButton[] {
        let startIndex = this.currentPage * this.pageLength
        let endIndex = startIndex + this.pageLength
        let lastIndexOfArray = this.allIngredientButtons.length - 1

        if (endIndex >= lastIndexOfArray) {
            endIndex = lastIndexOfArray + 1
        }

        let result = []

        for (let i = startIndex; i < endIndex; i++) {
            result.push(this.allIngredientButtons[i])
        }

        return result
    }

    solveLayout() {
        this.removeChildren(0, this.children.length)
        let lastIndexOfArray = this.allIngredientButtons.length - 1
        let isFirstPage = this.currentPage == 0
        let startIndex = this.currentPage * this.pageLength
        let endIndex = startIndex + this.pageLength
        let isLastPage = false
        if (endIndex >= lastIndexOfArray) {
            isLastPage = true
        }

        if (!isFirstPage) {
            this.addChild(this.pageLeftButton)
        } else {
            this.addChild(this.leftSpacer);
        }

        for (let button of this.allIngredientButtonsOnCurrentPage()) {
            this.addChild(button)
        }

        if (!isLastPage) {
            this.addChild(this.pageRightButton)
        } else {
            this.addChild(this.rightSpacer)
        }

        for (let i = 0; i < this.children.length; i++) {
            this.getChildAt(i).x = i * (ButtonRow.buttonWidth + ButtonRow.padding);
        }
    }

    addIngredientButton(ingredient: Ingredient) {
        let button = new IngredientButton(this, ingredient);
        this.allIngredientButtons.push(button);
        this.addChild(button)

        this.currentPage = 0;
        this.solveLayout()
    }

    movePage(pageDelta: number) {
        this.currentPage += pageDelta;

        this.solveLayout()
    }
}