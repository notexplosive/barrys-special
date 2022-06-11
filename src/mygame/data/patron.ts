import { Dialogue } from './dialogue';
import { PatronSprite } from '../ui/patron-sprite';
import { Taste } from './taste';
import { Ingredient } from './ingredient';
import { Assets } from '../../limbo/core/assets';


export class Patron {
    readonly name: string;
    readonly dialogue: Dialogue;
    readonly patronSprite: PatronSprite;
    readonly taste: Taste;
    readonly giftIndex: number;
    hasBeenIntroduced: boolean;
    hasEnjoyedDrink: boolean;
    hasGift: boolean;
    blipSfxName: string;

    constructor(name: string, blipSfxName: string, taste: Taste, dialogue: Dialogue, patronSprite: PatronSprite, giftIndex: number) {
        this.name = name
        this.taste = taste
        this.dialogue = dialogue
        this.patronSprite = patronSprite
        this.hasGift = giftIndex != null
        this.giftIndex = giftIndex
        this.blipSfxName = blipSfxName
    }

    playVoiceBlip() {
        if (this.blipSfxName !== null) {
            let blip = Assets.sound(this.blipSfxName)
            blip.volume = 0.5
            return blip.play()
        }
    }
}