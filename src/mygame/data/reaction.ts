import { Flavor } from "./flavor";

export class Reaction {
    private readonly liked: Flavor[];
    private readonly disliked: Flavor[];
    private readonly missing: Flavor[];

    constructor(liked: Flavor[], disliked: Flavor[], missing: Flavor[]) {
        this.liked = liked
        this.disliked = disliked
        this.missing = missing
    }

    missingFlavorNames(): string[] {
        return this.names(this.missing)
    }

    dislikedFlavorNames(): string[] {
        return this.names(this.disliked)
    }

    likedFlavorNames(): string[] {
        return this.names(this.liked)
    }

    missingFlavorCount(): number {
        return this.count(this.missing)
    }

    dislikedFlavorCount(): number {
        return this.count(this.disliked)
    }

    likedFlavorCount(): number {
        return this.count(this.liked)
    }

    private names(flavors: Flavor[]) {
        return flavors.map((flavor) => { return flavor.name })
    }

    private count(flavors: Flavor[]): number {
        let counter = { i: 0 }
        flavors.map((flavor) => { counter.i++ })
        return counter.i
    }
}