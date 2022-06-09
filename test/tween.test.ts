import { Tween, TweenableNumber, EaseFunctions, Tweenable } from '../src/mygame/data/tween';

describe("tweens", () => {
    test("lerps accurately from 0 to 100", () => {
        let tweenable = new TweenableNumber(0);
        let tween = new Tween<number>(tweenable, 100, 1, EaseFunctions.linear);

        tween.update(0.25)

        expect(tween.currentTime).toBe(0.25)
        expect(tweenable.get()).toBe(25)
    });

    test("lerps accurately from 50 to 100", () => {
        let tweenable = new TweenableNumber(50);
        let tween = new Tween<number>(tweenable, 100, 1, EaseFunctions.linear);

        tween.update(0.5)

        expect(tween.currentTime).toBe(0.5)
        expect(tweenable.get()).toBe(75)
    });
});