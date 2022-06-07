import { Sprite } from "pixi.js";
import { game } from "..";
import { Updater } from "../limbo/data/updater";
import { createDropParticle } from "./drop-particle";

export type IsDoneFunction = () => boolean

export function animate_dropIngredients(hand: Sprite, mixer: Sprite): IsDoneFunction {
    let droppingUpdater = new Updater();

    let particles = [
        createDropParticle(hand, mixer, 0),
        createDropParticle(hand, mixer, 1),
        createDropParticle(hand, mixer, 2),
        createDropParticle(hand, mixer, 3),
        createDropParticle(hand, mixer, 4),
        createDropParticle(hand, mixer, 5),
        createDropParticle(hand, mixer, 6),
        createDropParticle(hand, mixer, 7),
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
        }
    })

    return isDoneDropping
}

