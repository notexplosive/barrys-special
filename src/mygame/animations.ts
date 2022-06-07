import { Sprite, Texture } from "pixi.js";
import { game } from "..";
import { Updater } from "../limbo/data/updater";
import { Ingredient } from "./data/ingredient";
import { createDropParticle } from "./drop-particle";

export type IsDoneFunction = () => boolean

export function animate_dropIngredients(hand: Sprite, mixer: Sprite, ingredient: Ingredient): IsDoneFunction {
    let droppingUpdater = new Updater();

    let particles = [
        createDropParticle(hand, mixer, ingredient, 0),
        createDropParticle(hand, mixer, ingredient, 1),
        createDropParticle(hand, mixer, ingredient, 2),
        createDropParticle(hand, mixer, ingredient, 3),
        createDropParticle(hand, mixer, ingredient, 4),
        createDropParticle(hand, mixer, ingredient, 5),
        createDropParticle(hand, mixer, ingredient, 6),
        createDropParticle(hand, mixer, ingredient, 7),
    ]

    droppingUpdater.add((dt) => {
        for (let dropping of particles) {
            dropping.update(dt)
        }
    });

    game.updaters.push(droppingUpdater)

    let isDoneDropping = () => {
        for (let particle of particles) {
            if (!particle.isDone) {
                return false;
            }
        }

        return true;
    }

    droppingUpdater.add((dt) => {
        if (isDoneDropping()) {
            let index = game.updaters.indexOf(droppingUpdater)
            if (index !== -1) {
                game.updaters.splice(index, 1)
            }

            for (const particle of particles) {
                particle.destroy()
            }
        }
    })

    return isDoneDropping
}

