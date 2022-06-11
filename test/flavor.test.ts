import { Ingredient } from '../src/mygame/data/ingredient';
import { FlavorProfile, Flavor, mixFlavorProfiles } from '../src/mygame/data/flavor';
import { Mixture } from '../src/mygame/data/mixture';
import { Color } from '../src/mygame/data/color';
import { Taste } from '../src/mygame/data/taste';
import { Opinion } from '../src/mygame/ui/patron-sprite';
import { Reaction } from '../src/mygame/data/reaction';

describe("flavor", () => {

    test('sanity', () => {
        let subject = new FlavorProfile()
        subject.set(Flavor.Earthy, 1)
        subject.set(Flavor.Toxic, 2)
        subject.set(Flavor.Crisp, 3)

        expect(subject.get(Flavor.Earthy)).toBe(1)
        expect(subject.get(Flavor.Toxic)).toBe(2)
        expect(subject.get(Flavor.Crisp)).toBe(3)
    });

    test('nonzero flavors', () => {
        let subject = new FlavorProfile()
        subject.set(Flavor.Earthy, 1)
        subject.set(Flavor.Toxic, 2)
        subject.set(Flavor.Crisp, 3)

        expect(subject.allNonZeroFlavors()).toContain(Flavor.Earthy)
        expect(subject.allNonZeroFlavors()).toContain(Flavor.Toxic)
        expect(subject.allNonZeroFlavors()).toContain(Flavor.Crisp)
    });

    test('mix 2 distinct flavors', () => {
        let left = new FlavorProfile()
        left.set(Flavor.Earthy, 2)

        let right = new FlavorProfile()
        right.set(Flavor.Toxic, 2)

        let mixed = mixFlavorProfiles(left, right)

        expect(mixed.get(Flavor.Toxic)).toBe(2)
        expect(mixed.get(Flavor.Earthy)).toBe(2)
    });

    test('mix 2 common flavors', () => {
        let left = new FlavorProfile()
        left.set(Flavor.Earthy, 2)

        let right = new FlavorProfile()
        right.set(Flavor.Earthy, 1)

        let mixed = mixFlavorProfiles(left, right)

        expect(mixed.get(Flavor.Earthy)).toBe(3)
    });
})

describe("mixtures", () => {
    test("behaves properly", () => {
        let mixture = new Mixture(3)
        let ingredient1 = new Ingredient(0, "Test 1", "", 0xffffff, new FlavorProfile().set(Flavor.Toxic, 2).set(Flavor.Nasty, -1))
        let ingredient2 = new Ingredient(0, "Test 2", "", 0xffffff, new FlavorProfile().set(Flavor.Majickal, 1).set(Flavor.Toxic, -1))
        mixture.addIngredient(ingredient1)
        mixture.addIngredient(ingredient2)

        expect(mixture.flavorProfile().get(Flavor.Toxic)).toBe(1)
        expect(mixture.flavorProfile().get(Flavor.Nasty)).toBe(-1)
        expect(mixture.flavorProfile().get(Flavor.Majickal)).toBe(1)
    })

    test("color with 1 ingredients", () => {
        let mixture = new Mixture(3)
        let ingredient1 = new Ingredient(0, "Test 1", "", 0xabcabc, new FlavorProfile().set(Flavor.Toxic, 2).set(Flavor.Nasty, -1))
        mixture.addIngredient(ingredient1)

        expect(mixture.color()).toBe(0xabcabc)
    })

    test("color with 2 ingredients", () => {
        let mixture = new Mixture(3)
        let ingredient1 = new Ingredient(0, "Test 1", "", 0x202200, new FlavorProfile().set(Flavor.Toxic, 2).set(Flavor.Nasty, -1))
        let ingredient2 = new Ingredient(0, "Test 2", "", 0x402266, new FlavorProfile().set(Flavor.Majickal, 1).set(Flavor.Toxic, -1))
        mixture.addIngredient(ingredient1)
        mixture.addIngredient(ingredient2)

        expect(mixture.color()).toBe(0x302233)
    })
})

describe("taste", () => {
    test("taste reacts appropriately", () => {
        let subject = new Taste()
            .addHate(Flavor.Toxic)
            .addLike(Flavor.Nasty)
            .addLike(Flavor.Sweet)
            .addLike(Flavor.Oily)

        let profile = new FlavorProfile()
            .set(Flavor.Crisp, 1)
            .set(Flavor.Nasty, 1)
            .set(Flavor.Toxic, 1)
            .set(Flavor.Oily, 1)

        expect(subject.getOpinionOnFlavor(Flavor.Toxic)).toBe(Opinion.Dislike)
        expect(subject.getOpinionOnFlavor(Flavor.Nasty)).toBe(Opinion.Like)
        expect(subject.getOpinionOnFlavor(Flavor.Sweet)).toBe(Opinion.Like)
        expect(subject.getOpinionOnFlavor(Flavor.Crisp)).toBe(Opinion.Neutral)
        expect(subject.getReactionToProfile(profile)).toMatchObject(new Reaction([Flavor.Nasty, Flavor.Oily], [Flavor.Toxic], [Flavor.Sweet]))
    })

    test("enjoy thing correctly", () => {
        let subject = new Taste()
            .addHate(Flavor.Toxic)
            .addLike(Flavor.Sweet)

        let profile = new FlavorProfile()
            .set(Flavor.Sweet, 1)

        expect(subject.getReactionToProfile(profile))
            .toMatchObject(new Reaction([Flavor.Sweet], [], []))
    })
})