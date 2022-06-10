import { Dialogue } from './dialogue';
import { PatronSprite } from '../ui/patron-sprite';
import { Taste } from './taste';


export class Patron {
    readonly name: string;
    readonly dialogue: Dialogue;
    readonly patronSprite: PatronSprite;
    readonly taste: Taste;
    hasBeenIntroduced: boolean;
    hasEnjoyedDrink: boolean;

    constructor(name: string, taste: Taste, dialogue: Dialogue, patronSprite: PatronSprite) {
        this.name = name
        this.taste = taste
        this.dialogue = dialogue
        this.patronSprite = patronSprite
    }
}