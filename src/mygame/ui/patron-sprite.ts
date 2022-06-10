import { Sprite, Spritesheet, Texture } from "pixi.js";
import { Assets } from "../../limbo/core/assets";
import { Mixture } from "../data/mixture";

export enum Opinion {
    Dislike = 1,
    Neutral = 2,
    Like = 3
}

export class PatronSprite extends Sprite {
    readonly spriteSheet: Texture[];

    constructor(verticalAnchorOffset: number, spritesheet: Spritesheet) {
        super(spritesheet.textures[0])
        this.spriteSheet = [spritesheet.textures[0], spritesheet.textures[1], spritesheet.textures[2], spritesheet.textures[3]]
        this.anchor.set(0.5, 0.5 + verticalAnchorOffset)
    }

    showIntro() {
        this.texture = this.spriteSheet[0]
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

    showOpinion(opinion: Opinion) {
        this.texture = this.spriteSheet[opinion]
    }

    getOpinion(mixture: Mixture) {
        console.log("getting opinion on", mixture)
        return Opinion.Neutral
    }
}