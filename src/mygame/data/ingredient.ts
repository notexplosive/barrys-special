import { Texture } from "pixi.js";
import { Assets } from '../../limbo/core/assets';

export class Ingredient {
    readonly name: string;
    readonly index: number;

    constructor(name: string, index: number) {
        this.name = name;
        this.index = index;
    }

    texture(): Texture {
        return Assets.spritesheet("ingredients").textures[this.index];
    }

    public static readonly All = [
        new Ingredient("Fresh Autumn Leaf", 0),
        new Ingredient("Wonderberry", 1),
        new Ingredient("Hedgehog Fur", 2),
        new Ingredient("Copy Bean", 3),
        new Ingredient("Ice Dragon Tooth", 4),
        new Ingredient("Whirlroot", 5),
        new Ingredient("Chemical B", 6),
        new Ingredient("Jellyfruit", 7),
        new Ingredient("Lanky Mushroom", 8),
        new Ingredient("Crumpleweed", 9),
        new Ingredient("Wobby Booger", 10),
        new Ingredient("Wigglekelp", 11),
        new Ingredient("Motor Oil", 12),
        new Ingredient("Happynut", 13),
        new Ingredient("Funny Herb", 14),
    ]
}