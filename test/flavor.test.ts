import { Ingredient } from '../src/mygame/data/ingredient';
import { FlavorProfile, Flavor, mixFlavorProfiles } from '../src/mygame/data/flavor';

describe("flavor", () => {

    test('sanity', () => {
        let subject = new FlavorProfile()
        subject.set(Flavor.Balmy, 1)
        subject.set(Flavor.Chemically, 2)
        subject.set(Flavor.Crunchy, 3)

        expect(subject.get(Flavor.Balmy)).toBe(1)
        expect(subject.get(Flavor.Chemically)).toBe(2)
        expect(subject.get(Flavor.Crunchy)).toBe(3)
    });

    test('nonzero flavors', () => {
        let subject = new FlavorProfile()
        subject.set(Flavor.Balmy, 1)
        subject.set(Flavor.Chemically, 2)
        subject.set(Flavor.Crunchy, 3)

        expect(subject.allNonZeroFlavors()).toContain(Flavor.Balmy)
        expect(subject.allNonZeroFlavors()).toContain(Flavor.Chemically)
        expect(subject.allNonZeroFlavors()).toContain(Flavor.Crunchy)
    });

    test('mix 2 distinct flavors', () => {
        let left = new FlavorProfile()
        left.set(Flavor.Balmy, 2)

        let right = new FlavorProfile()
        right.set(Flavor.Chemically, 2)

        let mixed = mixFlavorProfiles(left, right)

        expect(mixed.get(Flavor.Chemically)).toBe(2)
        expect(mixed.get(Flavor.Balmy)).toBe(2)
    });

    test('mix 2 common flavors', () => {
        let left = new FlavorProfile()
        left.set(Flavor.Balmy, 2)

        let right = new FlavorProfile()
        right.set(Flavor.Balmy, 1)

        let mixed = mixFlavorProfiles(left, right)

        expect(mixed.get(Flavor.Balmy)).toBe(3)
    });
})
