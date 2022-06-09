import { Point } from 'pixi.js';
import { Tween, TweenableNumber, EaseFunctions, Tweenable, TweenChain, TweenablePoint } from '../src/mygame/data/tween';

describe("tweens", () => {
    test("lerps accurately from 0 to 100", () => {
        let tweenable = new TweenableNumber(0);
        let tween = new Tween<number>(tweenable, 100, 1, EaseFunctions.linear);

        tween.updateAndGetOverflow(0.25)

        expect(tween.currentTime).toBe(0.25)
        expect(tweenable.get()).toBe(25)
    });

    test("lerps accurately from 50 to 100", () => {
        let tweenable = new TweenableNumber(50);
        let tween = new Tween<number>(tweenable, 100, 1, EaseFunctions.linear);

        tween.updateAndGetOverflow(0.5)

        expect(tween.currentTime).toBe(0.5)
        expect(tweenable.get()).toBe(75)
    });
});

describe("tween chains", () => {
    test("work with just one item", () => {
        let tweenable = new TweenableNumber(0);
        let chain = new TweenChain()
        chain.add(new Tween<number>(tweenable, 100, 1, EaseFunctions.linear))

        chain.updateAndGetOverflow(0.25)

        expect(tweenable.get()).toBe(25)
    });

    test("transition to next item", () => {
        let tweenable = new TweenableNumber(0);
        let chain = new TweenChain()
        chain.add(new Tween<number>(tweenable, 100, 0.5, EaseFunctions.linear))
        chain.add(new Tween<number>(tweenable, 120, 1, EaseFunctions.linear))

        chain.updateAndGetOverflow(0.75)

        expect(tweenable.get()).toBe(105)
    });

    test("helper functions for number tweens", () => {
        let tweenable = new TweenableNumber(0);
        let chain = new TweenChain()
        chain.addNumberTween(tweenable, 100, 1, EaseFunctions.linear)

        chain.update(0.25)

        expect(tweenable.get()).toBe(25)
    });

    test("helper functions for point tweens", () => {
        let tweenable = new TweenablePoint(new Point(0, 0));
        let chain = new TweenChain()
        chain.addPointTween(tweenable, new Point(100, 100), 1, EaseFunctions.linear)

        chain.update(0.25)

        expect(tweenable.get()).toMatchObject(new Point(25, 25))
    });
});