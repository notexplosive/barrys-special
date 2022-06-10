import { Ingredient } from './ingredient';
import { FlavorProfile, Flavor, mixFlavorProfiles } from './flavor';

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
        return 0xff0000
    }
}