import { Texture } from "pixi.js";
import { Assets } from '../../limbo/core/assets';
import { Flavor, FlavorProfile } from './flavor';

export class Ingredient {
    readonly name: string;
    readonly index: number;
    readonly flavorProfile: FlavorProfile;

    constructor(index: number, name: string, flavorProfile: FlavorProfile) {
        this.name = name;
        this.index = index;
        this.flavorProfile = flavorProfile;
    }

    texture(): Texture {
        return Assets.spritesheet("ingredients").textures[this.index];
    }

    public static readonly All = [
        new Ingredient(0, "Fresh Autumn Leaf",
            new FlavorProfile()
                .set(Flavor.Crisp, 2)
                .set(Flavor.Moist, 1)
                .set(Flavor.Fruity, -1)
        ),
        new Ingredient(1, "Wonderberry",
            new FlavorProfile()
                .set(Flavor.Juicy, 2)
                .set(Flavor.Fruity, 1)
                .set(Flavor.Grouchy, -1)
        ),
        new Ingredient(2, "Hedgehog Fur",
            new FlavorProfile()
                .set(Flavor.Speedy, 2)
                .set(Flavor.Grouchy, 1)
                .set(Flavor.Fruity, -1)
        ),
        new Ingredient(3, "Copy Bean",
            new FlavorProfile()
                .set(Flavor.Moist, 2)
                .set(Flavor.Fruity, 1)
                .set(Flavor.Chemically, -1)
        ),
        new Ingredient(4, "Ice Dragon Tooth",
            new FlavorProfile()
                .set(Flavor.Frosty, 2)
                .set(Flavor.Moist, 1)
                .set(Flavor.Speedy, -1)
        ),
        new Ingredient(5, "Whirlroot",
            new FlavorProfile()
                .set(Flavor.Wobbly, 2)
                .set(Flavor.Speedy, 1)
                .set(Flavor.Crisp, -1)
        ),
        new Ingredient(6, "Chemical B",
            new FlavorProfile()
                .set(Flavor.Chemically, 2)
                .set(Flavor.Oily, 1)
                .set(Flavor.Fruity, -1)
        ),
        new Ingredient(7, "Jellyfruit",
            new FlavorProfile()
                .set(Flavor.Fruity, 2)
                .set(Flavor.Juicy, 1)
                .set(Flavor.Oily, -1)
        ),
        new Ingredient(8, "Lanky Mushroom",
            new FlavorProfile()
                .set(Flavor.Moist, 2)
                .set(Flavor.Funny, 1)
                .set(Flavor.Grouchy, -1)
        ),
        new Ingredient(9, "Crumpleweed",
            new FlavorProfile()
                .set(Flavor.Grouchy, 2)
                .set(Flavor.Wobbly, 1)
                .set(Flavor.Juicy, -1)
        ),
        new Ingredient(10, "Wobby Booger",
            new FlavorProfile()
                .set(Flavor.Gross, 2)
                .set(Flavor.Wobbly, 1)
                .set(Flavor.Speedy, -1)
        ),
        new Ingredient(11, "Wigglekelp",
            new FlavorProfile()
                .set(Flavor.Moist, 2)
                .set(Flavor.Oily, 1)
                .set(Flavor.Chemically, -1)
        ),
        new Ingredient(12, "Motor Oil",
            new FlavorProfile()
                .set(Flavor.Oily, 2)
                .set(Flavor.Gross, 1)
                .set(Flavor.Fruity, -1)
        ),
        new Ingredient(13, "Happynut",
            new FlavorProfile()
                .set(Flavor.Crisp, 2)
                .set(Flavor.Funny, 1)
                .set(Flavor.Juicy, -1)
        ),
        new Ingredient(14, "Funny Herb",
            new FlavorProfile()
                .set(Flavor.Funny, 2)
                .set(Flavor.Gross, 1)
                .set(Flavor.Speedy, -1)
        ),
    ]
}