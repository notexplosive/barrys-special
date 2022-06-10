import { Dialogue } from './dialogue';
import { PatronSprite } from '../ui/patron-sprite';


export class Patron {
    readonly name: string;
    readonly dialogue: Dialogue;
    readonly patronSprite: PatronSprite;

    constructor(name: string, dialogue: Dialogue, patronSprite: PatronSprite) {
        this.name = name
        this.dialogue = dialogue
        this.patronSprite = patronSprite
    }
}