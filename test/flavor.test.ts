import { Ingredient } from '../src/mygame/data/ingredient';
import { FlavorProfile, Flavor, mixFlavorProfiles } from '../src/mygame/data/flavor';
import { Mixture } from '../src/mygame/data/mixture';

describe("flavor", () => {

    test('sanity', () => {
        let subject = new FlavorProfile()
        subject.set(Flavor.Moist, 1)
        subject.set(Flavor.Chemically, 2)
        subject.set(Flavor.Crisp, 3)

        expect(subject.get(Flavor.Moist)).toBe(1)
        expect(subject.get(Flavor.Chemically)).toBe(2)
        expect(subject.get(Flavor.Crisp)).toBe(3)
    });

    test('nonzero flavors', () => {
        let subject = new FlavorProfile()
        subject.set(Flavor.Moist, 1)
        subject.set(Flavor.Chemically, 2)
        subject.set(Flavor.Crisp, 3)

        expect(subject.allNonZeroFlavors()).toContain(Flavor.Moist)
        expect(subject.allNonZeroFlavors()).toContain(Flavor.Chemically)
        expect(subject.allNonZeroFlavors()).toContain(Flavor.Crisp)
    });

    test('mix 2 distinct flavors', () => {
        let left = new FlavorProfile()
        left.set(Flavor.Moist, 2)

        let right = new FlavorProfile()
        right.set(Flavor.Chemically, 2)

        let mixed = mixFlavorProfiles(left, right)

        expect(mixed.get(Flavor.Chemically)).toBe(2)
        expect(mixed.get(Flavor.Moist)).toBe(2)
    });

    test('mix 2 common flavors', () => {
        let left = new FlavorProfile()
        left.set(Flavor.Moist, 2)

        let right = new FlavorProfile()
        right.set(Flavor.Moist, 1)

        let mixed = mixFlavorProfiles(left, right)

        expect(mixed.get(Flavor.Moist)).toBe(3)
    });
})

describe("mixtures", () => {
    test("behaves properly", () => {
        let mixture = new Mixture()
        let ingredient1 = new Ingredient(0, "Test 1", new FlavorProfile().set(Flavor.Chemically, 2).set(Flavor.Gross, -1))
        let ingredient2 = new Ingredient(0, "Test 2", new FlavorProfile().set(Flavor.Frosty, 1).set(Flavor.Chemically, -1))
        mixture.addIngredient(ingredient1)
        mixture.addIngredient(ingredient2)

        expect(mixture.flavorProfile().get(Flavor.Chemically)).toBe(1)
        expect(mixture.flavorProfile().get(Flavor.Gross)).toBe(-1)
        expect(mixture.flavorProfile().get(Flavor.Frosty)).toBe(1)
    })
})