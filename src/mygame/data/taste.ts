import { Opinion } from "../ui/patron-sprite";
import { Flavor, FlavorProfile } from './flavor';
import { Reaction } from "./reaction";

export class Taste {
    eatsAnything: boolean = false
    private opinions: Map<Flavor, Opinion> = new Map();


    getOpinionOnFlavor(flavor: Flavor): Opinion {
        if (this.opinions.has(flavor)) {
            return this.opinions.get(flavor)
        } else {
            return Opinion.Neutral
        }
    }

    addHate(flavor: Flavor) {
        this.opinions.set(flavor, Opinion.Dislike)
        return this
    }

    addLike(flavor: Flavor) {
        this.opinions.set(flavor, Opinion.Like)
        return this
    }

    getReactionToProfile(flavorProfile: FlavorProfile) {
        let missing = []
        let disliked = []
        let liked = []

        const presentFlavors = flavorProfile.allNonZeroFlavors()

        if (this.eatsAnything) {
            return new Reaction(presentFlavors, [], [])
        }

        for (let flavor of this.opinions.keys()) {
            if (this.opinions.get(flavor) == Opinion.Like) {
                if (presentFlavors.includes(flavor)) {
                    liked.push(flavor)
                } else {
                    missing.push(flavor)
                }
            }

            if (this.opinions.get(flavor) == Opinion.Dislike) {
                if (presentFlavors.includes(flavor)) {
                    disliked.push(flavor)
                }
            }
        }

        return new Reaction(liked, disliked, missing)
    }

    getLikesNames(): string[] {
        let likes: Flavor[] = []
        for (let flavor of this.opinions.keys()) {
            if (this.opinions.get(flavor) == Opinion.Like) {
                likes.push(flavor)
            }
        }

        return likes.map((flavor) => flavor.name)
    }

    enableEatsAnything(): Taste {
        this.eatsAnything = true
        return this
    }
}