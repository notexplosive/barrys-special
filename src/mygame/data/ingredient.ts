import { Texture } from "pixi.js";
import { Assets } from '../../limbo/core/assets';
import { Flavor, FlavorProfile } from './flavor';

export class Ingredient {
    readonly name: string;
    readonly description: string;
    readonly index: number;
    readonly flavorProfile: FlavorProfile;
    readonly color: number;

    constructor(index: number, name: string, description: string, color: number, flavorProfile: FlavorProfile) {
        this.name = name;
        this.index = index;
        this.color = color;
        this.description = description || defaultDescription(flavorProfile)
        this.flavorProfile = flavorProfile;
    }

    texture(): Texture {
        return Assets.spritesheet("ingredients").textures[this.index];
    }

    public static readonly All = [
        new Ingredient(
            0,
            "Fresh Autumn Leaf",
            null,
            0xf3bc2e,
            new FlavorProfile()
                .set(Flavor.Crisp, 1)
                .set(Flavor.Earthy, 1)
        ),
        new Ingredient(
            1,
            "Wonderberry",
            null,
            0x73172d,
            new FlavorProfile()
                .set(Flavor.Sweet, 1)
                .set(Flavor.Bitter, 1)
        ),
        new Ingredient(
            2,
            "Hair of the 'Hog'",
            "Makes people Dizzy and tastes Gross",
            0x0000ff,
            new FlavorProfile()
                .set(Flavor.Dizzy, 1)
                .set(Flavor.Gross, 1)
        ),
        new Ingredient(
            3,
            "Copy Bean",
            null,
            0x71413b,
            new FlavorProfile()
                .set(Flavor.Earthy, 1)
                .set(Flavor.Bitter, 1)
        ),
        new Ingredient(
            4,
            "Ice Dragon Tooth",
            "Full of Arkane Majicks and not much else",
            0x20d6c7,
            new FlavorProfile()
                .set(Flavor.Majickal, 1)
        ),
        new Ingredient(
            5,
            "Whirlroot",
            "Earthy and makes you Dizzy",
            0x793a80,
            new FlavorProfile()
                .set(Flavor.Earthy, 1)
                .set(Flavor.Dizzy, 1)
        ),
        new Ingredient(
            6,
            "Chemical B",
            "Extremely Toxic, no one should drink this",
            0x00ff00,
            new FlavorProfile()
                .set(Flavor.Toxic, 1)
        ),
        new Ingredient(
            7,
            "Jellyfruit",
            null,
            0xaa00aa,
            new FlavorProfile()
                .set(Flavor.Oily, 1)
                .set(Flavor.Bitter, 1)
        ),
        new Ingredient(
            8,
            "Lanky Mushroom",
            "Make you feel Funny if you can handle the Gross taste",
            0x23674e,
            new FlavorProfile()
                .set(Flavor.Funny, 1)
                .set(Flavor.Gross, 1)
        ),
        new Ingredient(
            9,
            "Rock Salt",
            null,
            0xb3b3b3,
            new FlavorProfile()
                .set(Flavor.Salty, 1)
                .set(Flavor.Crisp, 1)
        ),
        new Ingredient(
            10,
            "Wobby Booger",
            null,
            0xf9a31b,
            new FlavorProfile()
                .set(Flavor.Gross, 1)
                .set(Flavor.Crisp, 1)
        ),
        new Ingredient(
            11,
            "Ocean Kelp",
            null,
            0x14a02e,
            new FlavorProfile()
                .set(Flavor.Earthy, 1)
                .set(Flavor.Salty, 1)
        ),
        new Ingredient(
            12,
            "Motor Oil",
            null,
            0x000000,
            new FlavorProfile()
                .set(Flavor.Oily, 1)
                .set(Flavor.Gross, 1)
        ),
        new Ingredient(
            13,
            "Happynut",
            "Sweet and Crisp nut that smiles back",
            0x422433,
            new FlavorProfile()
                .set(Flavor.Crisp, 1)
                .set(Flavor.Sweet, 1)
        ),
        new Ingredient(
            14,
            "Funny Herb",
            null,
            0x1a7a3e,
            new FlavorProfile()
                .set(Flavor.Funny, 2)
                .set(Flavor.Gross, 1)
        ),
    ]
}

function defaultDescription(flavorProfile: FlavorProfile): string {
    let mapping = flavorProfile.allNonZeroFlavors().map((flavor) => flavor.name)
    return mapping.join(" and ")
}
