import { Texture } from "pixi.js";
import { Assets } from '../../limbo/core/assets';
import { Flavor, FlavorProfile } from './flavor';

export class Ingredient {
    readonly name: string;
    readonly description: string;
    readonly spriteIndex: number;
    readonly flavorProfile: FlavorProfile;
    readonly color: number;

    constructor(index: number, name: string, description: string, color: number, flavorProfile: FlavorProfile) {
        this.name = name;
        this.spriteIndex = index;
        this.color = color;
        this.description = description || defaultDescription(flavorProfile)
        this.flavorProfile = flavorProfile;
    }

    texture(): Texture {
        return Assets.spritesheet("ingredients").textures[this.spriteIndex];
    }

    public static readonly All = [
        new Ingredient(
            1,
            "Wonderberry",
            null,
            0x73172d,
            new FlavorProfile()
                .set(Flavor.Sweet, 1)
                .set(Flavor.Bitter, 1)
                .set(Flavor.Mushy, 1)
        ),
        new Ingredient(
            3,
            "Copy Bean",
            null,
            0x71413b,
            new FlavorProfile()
                .set(Flavor.Earthy, 1)
                .set(Flavor.Bitter, 1)
                .set(Flavor.Energizing, 1)
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
                .set(Flavor.Mushy, 1)
        ),
        new Ingredient(
            8,
            "Lanky Mushroom",
            null,
            0x23674e,
            new FlavorProfile()
                .set(Flavor.Funny, 1)
                .set(Flavor.Gross, 1)
                .set(Flavor.Mushy, 1)
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
                .set(Flavor.Toxic, 1)
        ),
        new Ingredient(
            14,
            "Funny Herb",
            null,
            0x1a7a3e,
            new FlavorProfile()
                .set(Flavor.Funny, 1)
                .set(Flavor.Dizzy, 1)
                .set(Flavor.Earthy, 1)
        ),
    ]
}

function defaultDescription(flavorProfile: FlavorProfile): string {
    let mapping = flavorProfile.allNonZeroFlavors().map((flavor) => flavor.name)
    return mapping.join(" and ")
}
