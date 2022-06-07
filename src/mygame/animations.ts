import { Sprite, Texture } from "pixi.js";
import { game } from "..";
import { Updater } from "../limbo/data/updater";
import { createDropParticle } from "./drop-particle";

export type IsDoneFunction = () => boolean

export function animate_dropIngredients(hand: Sprite, mixer: Sprite, texture: Texture): IsDoneFunction {
    let droppingUpdater = new Updater();

    let particles = [
        createDropParticle(hand, mixer, texture, 0),
        createDropParticle(hand, mixer, texture, 1),
        createDropParticle(hand, mixer, texture, 2),
        createDropParticle(hand, mixer, texture, 3),
        createDropParticle(hand, mixer, texture, 4),
        createDropParticle(hand, mixer, texture, 5),
        createDropParticle(hand, mixer, texture, 6),
        createDropParticle(hand, mixer, texture, 7),
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

