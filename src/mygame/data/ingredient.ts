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
        this.description = description
        this.flavorProfile = flavorProfile;
    }

    texture(): Texture {
        return Assets.spritesheet("ingredients").textures[this.index];
    }

    public static readonly All = [
        new Ingredient(
            0,
            "Fresh Autumn Leaf",
            "Crisp like an Autumn morning",
            0xf3bc2e,
            new FlavorProfile()
                .set(Flavor.Crisp, 2)
                .set(Flavor.Moist, 1)
                .set(Flavor.Fruity, -1)
        ),
        new Ingredient(
            1,
            "Wonderberry",
            "A very juicy berry that adds a fruity texture",
            0x73172d,
            new FlavorProfile()
                .set(Flavor.Juicy, 2)
                .set(Flavor.Fruity, 1)
        ),
        new Ingredient(
            2,
            "Hedgehog Fur",
            "Helps you go fast",
            0x0000ff,
            new FlavorProfile()
                .set(Flavor.Speedy, 2)
                .set(Flavor.Grouchy, 1)
        ),
        new Ingredient(
            3,
            "Copy Bean",
            "Genetically engineered coffee beans",
            0x71413b,
            new FlavorProfile()
                .set(Flavor.Moist, 2)
                .set(Flavor.Fruity, 1)
        ),
        new Ingredient(
            4,
            "Ice Dragon Tooth",
            "Full of Arkane Majicks",
            0x20d6c7,
            new FlavorProfile()
                .set(Flavor.Frosty, 2)
                .set(Flavor.Moist, 1)
        ),
        new Ingredient(
            5,
            "Whirlroot",
            "Sweet and make you dizzy",
            0x793a80,
            new FlavorProfile()
                .set(Flavor.Sweet, 2)
                .set(Flavor.Speedy, 1)
        ),
        new Ingredient(
            6,
            "Chemical B",
            "Some kind of toxic chemical from Psycho-X's lab",
            0x00ff00,
            new FlavorProfile()
                .set(Flavor.Toxic, 2)
                .set(Flavor.Oily, 1)
        ),
        new Ingredient(
            7,
            "Jellyfruit",
            "A fruit full of juicy ooze",
            0xaa00aa,
            new FlavorProfile()
                .set(Flavor.Fruity, 2)
                .set(Flavor.Juicy, 1)
        ),
        new Ingredient(
            8,
            "Lanky Mushroom",
            "I found these outside",
            0x23674e,
            new FlavorProfile()
                .set(Flavor.Moist, 2)
                .set(Flavor.Funny, 1)
        ),
        new Ingredient(
            9,
            "Rock Salt",
            "Big rock of salt",
            0xb3b3b3,
            new FlavorProfile()
                .set(Flavor.Grouchy, 2)
                .set(Flavor.Sweet, 1)
        ),
        new Ingredient(
            10,
            "Wobby Booger",
            "Surprisingly sweet!",
            0xf9a31b,
            new FlavorProfile()
                .set(Flavor.Gross, 2)
                .set(Flavor.Sweet, 1)
        ),
        new Ingredient(
            11,
            "Salty Sea Kelp",
            "I found this at the beach",
            0x14a02e,
            new FlavorProfile()
                .set(Flavor.Moist, 2)
                .set(Flavor.Oily, 1)
        ),
        new Ingredient(
            12,
            "Motor Oil",
            "Good for machines, bad for humans",
            0x000000,
            new FlavorProfile()
                .set(Flavor.Oily, 2)
                .set(Flavor.Gross, 1)
        ),
        new Ingredient(
            13,
            "Happynut",
            "The sweet nut that smiles back",
            0x422433,
            new FlavorProfile()
                .set(Flavor.Crisp, 2)
                .set(Flavor.Funny, 1)
        ),
        new Ingredient(
            14,
            "Funny Herb",
            "Eating it makes people laugh",
            0x1a7a3e,
            new FlavorProfile()
                .set(Flavor.Funny, 2)
                .set(Flavor.Gross, 1)
        ),
    ]
}