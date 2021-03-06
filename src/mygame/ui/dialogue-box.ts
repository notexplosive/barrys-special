import { Container, Text } from "pixi.js";
import { Tween, Tweenable, TweenableNumber, EaseFunction, EaseFunctions } from '../data/tween';
import { IUpdateable, prop_patron } from '../main';
import { game } from '../../index';

export class DialogueBox extends Container implements IUpdateable {
    private readonly renderedContent: Text;
    private pages: string[] = [];
    private currentPageIndex: number = 0;
    private currentTween: Tween<number>;
    private currentCharIndex: number;
    private tweenableCharIndex: TweenableNumber;
    previousCharIndex: number;
    blipIndex: number = 0;

    constructor() {
        super()
        this.renderedContent = new Text("",
            { fontFamily: "Concert One", fill: ['#ffffff'], stroke: 0x000000, strokeThickness: 4, fontSize: 35, wordWrapWidth: 700, wordWrap: true, align: "center" })
        this.renderedContent.anchor.set(0.5, 0)
        this.addChild(this.renderedContent)
        this.currentTween = null
        this.currentCharIndex = 0
        this.tweenableCharIndex = new TweenableNumber(() => this.currentCharIndex, val => this.currentCharIndex = val)

        game.onClick.addCallback(() => {
            if (this.currentTween !== null) {
                if (this.currentTween.isDone()) {
                    this.advanceToNextPage()
                } else {
                    this.currentTween.skip()
                }
            }
        })
    }

    private advanceToNextPage() {
        this.currentPageIndex++

        if (!this.isDone()) {
            this.loadCurrentPage()
        } else {
            this.renderedContent.text = ""
        }
    }

    update(dt: number): void {
        if (this.currentTween != null && !this.isDone()) {
            game.requestInteractive()
            game.requestButtonModeTrue()

            this.currentTween.updateAndGetOverflow(dt)
            if (!this.isDone()) {
                if (this.currentCharIndex != this.previousCharIndex) {
                    let currentChar = this.currentPageContent().charAt(this.currentCharIndex)
                    if (/^[a-zA-Z]+$/.test(currentChar)) {
                        this.attemptPlayBlip()
                    }
                }
                this.renderedContent.text = this.currentPageContent().slice(0, this.currentCharIndex)
                this.previousCharIndex = this.currentCharIndex
            }
        }
    }
    attemptPlayBlip() {
        this.blipIndex++

        if (this.blipIndex % 5 == 0) {
            prop_patron.getPatron().playVoiceBlip()
        }
    }

    loadPages(pages: string[]) {
        this.pages = pages
        this.currentPageIndex = 0
        this.loadCurrentPage()
    }

    private loadCurrentPage() {
        this.currentCharIndex = 0
        const pageLength = this.currentPageContent().length
        const duration = pageLength / 30
        this.currentTween = new Tween(this.tweenableCharIndex, pageLength, duration, EaseFunctions.linear)
    }

    private currentPageContent(): string {
        return this.pages[this.currentPageIndex]
    }

    isDone() {
        return this.currentPageIndex >= this.pages.length
    }
}