import { Sprite, Spritesheet, Texture } from "pixi.js";

export class PatronSprite extends Sprite {
    readonly spriteSheet: Texture[];

    constructor(verticalAnchorOffset: number, spritesheet: Spritesheet) {
        super(spritesheet.textures[0])
        this.spriteSheet = [spritesheet.textures[0], spritesheet.textures[1], spritesheet.textures[2], spritesheet.textures[3]]
        this.anchor.set(0.5, 0.5 + verticalAnchorOffset)
    }

    showFrown() {
        this.texture = this.spriteSheet[1]
    }

    showNeutral() {
        this.texture = this.spriteSheet[2]
    }

    showHappy() {
        this.texture = this.spriteSheet[3]
    }
}