import { Dialogue } from './dialogue';
import { PatronSprite } from '../ui/patron-sprite';
import { Taste } from './taste';
import { Ingredient } from './ingredient';


export class Patron {
    readonly name: string;
    readonly dialogue: Dialogue;
    readonly patronSprite: PatronSprite;
    readonly taste: Taste;
    readonly giftIndex: number;
    hasBeenIntroduced: boolean;
    hasEnjoyedDrink: boolean;
    hasGift: boolean;

    constructor(name: string, taste: Taste, dialogue: Dialogue, patronSprite: PatronSprite, giftIndex: number) {
        this.name = name
        this.taste = taste
        this.dialogue = dialogue
        this.patronSprite = patronSprite
        this.hasGift = giftIndex != null
        this.giftIndex = giftIndex
    }
}