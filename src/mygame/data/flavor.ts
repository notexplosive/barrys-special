export class Flavor {
    readonly name: string;

    private constructor(name: string) {
        this.name = name
    }

    static readonly Funny = new Flavor("Funny")
    static readonly Crisp = new Flavor("Crisp")
    static readonly Sweet = new Flavor("Sweet")
    static readonly Earthy = new Flavor("Earthy")
    static readonly Majickal = new Flavor("Arkane")
    static readonly Salty = new Flavor("Salty")
    static readonly Oily = new Flavor("Oily")
    static readonly Dizzy = new Flavor("Dizzying")
    static readonly Toxic = new Flavor("Toxic")
    static readonly Bitter = new Flavor("Bitter")
    static readonly Nasty = new Flavor("Nasty")
    static readonly Mushy = new Flavor("Mushy")
    static readonly Hairy = new Flavor("Hairy")
    static readonly Energizing = new Flavor("Energizing")
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