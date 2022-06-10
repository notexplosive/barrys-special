import { Texture } from "pixi.js";
import { Assets } from '../../limbo/core/assets';
import { Flavor, FlavorProfile } from './flavor';

export class Ingredient {
    readonly name: string;
    readonly index: number;
    readonly flavorProfile: FlavorProfile;
    readonly color: number;

    constructor(index: number, name: string, color: number, flavorProfile: FlavorProfile) {
        this.name = name;
        this.index = index;
        this.color = color;
        this.flavorProfile = flavorProfile;
    }

    texture(): Texture {
        return Assets.spritesheet("ingredients").textures[this.index];
    }

    public static readonly All = [
        new Ingredient(
            0,
            "Fresh Autumn Leaf",
            0xf3bc2e,
            new FlavorProfile()
                .set(Flavor.Crisp, 2)
                .set(Flavor.Moist, 1)
                .set(Flavor.Fruity, -1)
        ),
        new Ingredient(
            1,
            "Wonderberry",
            0x73172d,
            new FlavorProfile()
                .set(Flavor.Juicy, 2)
                .set(Flavor.Fruity, 1)
                .set(Flavor.Grouchy, -1)
        ),
        new Ingredient(
            2,
            "Hedgehog Fur",
            0x0000ff,
            new FlavorProfile()
                .set(Flavor.Speedy, 2)
                .set(Flavor.Grouchy, 1)
                .set(Flavor.Fruity, -1)
        ),
        new Ingredient(
            3,
            "Copy Bean",
            0x71413b,
            new FlavorProfile()
                .set(Flavor.Moist, 2)
                .set(Flavor.Fruity, 1)
                .set(Flavor.Chemically, -1)
        ),
        new Ingredient(
            4,
            "Ice Dragon Tooth",
            0x20d6c7,
            new FlavorProfile()
                .set(Flavor.Frosty, 2)
                .set(Flavor.Moist, 1)
                .set(Flavor.Speedy, -1)
        ),
        new Ingredient(
            5,
            "Whirlroot",
            0x793a80,
            new FlavorProfile()
                .set(Flavor.Wobbly, 2)
                .set(Flavor.Speedy, 1)
                .set(Flavor.Crisp, -1)
        ),
        new Ingredient(
            6,
            "Chemical B",
            0x00ff00,
            new FlavorProfile()
                .set(Flavor.Chemically, 2)
                .set(Flavor.Oily, 1)
                .set(Flavor.Fruity, -1)
        ),
        new Ingredient(
            7,
            "Jellyfruit",
            0xaa00aa,
            new FlavorProfile()
                .set(Flavor.Fruity, 2)
                .set(Flavor.Juicy, 1)
                .set(Flavor.Oily, -1)
        ),
        new Ingredient(
            8,
            "Lanky Mushroom",
            0x23674e,
            new FlavorProfile()
                .set(Flavor.Moist, 2)
                .set(Flavor.Funny, 1)
                .set(Flavor.Grouchy, -1)
        ),
        new Ingredient(
            9,
            "Crumpleweed",
            0xb3b3b3,
            new FlavorProfile()
                .set(Flavor.Grouchy, 2)
                .set(Flavor.Wobbly, 1)
                .set(Flavor.Juicy, -1)
        ),
        new Ingredient(
            10,
            "Wobby Booger",
            0xf9a31b,
            new FlavorProfile()
                .set(Flavor.Gross, 2)
                .set(Flavor.Wobbly, 1)
                .set(Flavor.Speedy, -1)
        ),
        new Ingredient(
            11,
            "Wigglekelp",
            0x14a02e,
            new FlavorProfile()
                .set(Flavor.Moist, 2)
                .set(Flavor.Oily, 1)
                .set(Flavor.Chemically, -1)
        ),
        new Ingredient(
            12,
            "Motor Oil",
            0x000000,
            new FlavorProfile()
                .set(Flavor.Oily, 2)
                .set(Flavor.Gross, 1)
                .set(Flavor.Fruity, -1)
        ),
        new Ingredient(
            13,
            "Happynut",
            0x422433,
            new FlavorProfile()
                .set(Flavor.Crisp, 2)
                .set(Flavor.Funny, 1)
                .set(Flavor.Juicy, -1)
        ),
        new Ingredient(
            14,
            "Funny Herb",
            0x1a7a3e,
            new FlavorProfile()
                .set(Flavor.Funny, 2)
                .set(Flavor.Gross, 1)
                .set(Flavor.Speedy, -1)
        ),
    ]
}