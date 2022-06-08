export class Flavor {
    readonly name: string;

    private constructor(name: string) {
        this.name = name
    }

    static readonly Zesty = new Flavor("Zesty")
    static readonly Crunchy = new Flavor("Crunchy")
    static readonly Wobbly = new Flavor("Wobbly")
    static readonly Balmy = new Flavor("Balmy")
    static readonly Grouchy = new Flavor("Grouchy")
    static readonly Oily = new Flavor("Oily")
    static readonly Juicy = new Flavor("Juicy")
    static readonly Chemically = new Flavor("Chemically")
    static readonly Speedy = new Flavor("Speedy")
    static readonly Fruity = new Flavor("Fruity")
}

type FlavorProfileData = Map<Flavor, number>

export class FlavorProfile {
    private readonly data: FlavorProfileData = new Map<Flavor, number>();

    set(flavor: Flavor, number: number) {
        this.data.set(flavor, number)
        return this
    }

    has(flavor: Flavor) {
        return this.data.has(flavor)
    }

    get(flavor: Flavor) {
        if (this.has(flavor)) {
            return this.data.get(flavor)
        } else {
            return 0
        }
    }

    allNonZeroFlavors(): Flavor[] {
        let result: Flavor[] = []
        for (let key of this.data.keys()) {
            result.push(key)
        }
        return result
    }

    clone(): FlavorProfile {
        let copy = new FlavorProfile()
        for (let flavor of this.allNonZeroFlavors()) {
            copy.set(flavor, this.get(flavor))
        }
        return copy
    }
}

export function mixFlavorProfiles(left: FlavorProfile, right: FlavorProfile): FlavorProfile {
    let result = new FlavorProfile()

    for (let side of [left, right]) {
        for (let flavor of side.allNonZeroFlavors()) {
            result.set(flavor, side.get(flavor) + result.get(flavor))
        }
    }

    return result
}