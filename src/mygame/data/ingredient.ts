import { Texture } from "pixi.js";
import { Assets } from '../../limbo/core/assets';

export class Ingredient {
    readonly name: string;
    readonly index: number;

    constructor(index: number, name: string) {
        this.name = name;
        this.index = index;
    }

    texture(): Texture {
        return Assets.spritesheet("ingredients").textures[this.index];
    }

    public static readonly All = [
        new Ingredient(0, "Fresh Autumn Leaf"),
        new Ingredient(1, "Wonderberry"),
        new Ingredient(2, "Hedgehog Fur"),
        new Ingredient(3, "Copy Bean"),
        new Ingredient(4, "Ice Dragon Tooth"),
        new Ingredient(5, "Whirlroot"),
        new Ingredient(6, "Chemical B"),
        new Ingredient(7, "Jellyfruit"),
        new Ingredient(8, "Lanky Mushroom"),
        new Ingredient(9, "Crumpleweed"),
        new Ingredient(10, "Wobby Booger"),
        new Ingredient(11, "Wigglekelp"),
        new Ingredient(12, "Motor Oil"),
        new Ingredient(13, "Happynut"),
        new Ingredient(14, "Funny Herb"),
    ]
}