import { Ingredient } from './ingredient';
import { FlavorProfile, Flavor, mixFlavorProfiles } from './flavor';
import { Color } from './color';

export class Mixture {
    private readonly currentIngredients: Ingredient[] = []
    readonly onChangedCallback: Function[] = []

    constructor() {
    }

    addIngredient(ingredient: Ingredient) {
        if (this.currentIngredients.length < 3) {
            this.currentIngredients.push(ingredient)
        }

        this.onChanged()
    }

    clearIngredients() {
        this.currentIngredients.splice(0, this.currentIngredients.length)
        this.onChanged()
    }

    ingredients(): Ingredient[] {
        return this.currentIngredients
    }

    onChanged() {
        for (let callback of this.onChangedCallback) {
            callback()
        }
    }

    whenChanged(callback: Function) {
        this.onChangedCallback.push(callback)
    }

    isFilled(): boolean {
        return this.currentIngredients.length == 3
    }

    flavorProfile(): FlavorProfile {
        let result = new FlavorProfile();

        for (let ingredient of this.currentIngredients) {
            result = mixFlavorProfiles(result, ingredient.flavorProfile)
        }

        return result
    }

    color(): number {
        let red = 0
        let green = 0
        let blue = 0
        this.currentIngredients.map((ingredient) => {
            let extractedColor = Color.fromHex(ingredient.color)
            red += extractedColor.red
            green += extractedColor.green
            blue += extractedColor.blue
        })

        const length = this.currentIngredients.length
        return Color.fromRgb255(red / length, green / length, blue / length).asHex()
    }
}