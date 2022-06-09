import { IPointData, Point } from "pixi.js";

export type IsDoneFunction = () => boolean
export type EaseFunction = (x: number) => number
type LerpFunction<T> = (start: T, end: T, percent: number) => T;

export class EaseFunctions {
    public static linear(x: number) {
        return x;
    }
}

export interface ITween {
    updateAndGetOverflow(dt: number): number
    isDone(): boolean
}

export class Tween<T> implements ITween {
    duration: number;
    currentTime: number;
    tweenable: Tweenable<T>;
    startingValue: T;
    targetValue: T;
    easeFuncion: EaseFunction;

    constructor(tweenable: Tweenable<T>, targetValue: T, duration: number, easeFuncion: EaseFunction) {
        this.currentTime = 0
        this.startingValue = tweenable.get()
        this.tweenable = tweenable
        this.duration = duration
        this.targetValue = targetValue
        this.easeFuncion = easeFuncion
    }

    percent() {
        return this.currentTime / this.duration
    }

    updateAndGetOverflow(dt: number) {
        if (this.currentTime == 0) {
            // this is our first update, acquire the "new" starting value (if it changed)
            this.startingValue = this.tweenable.get()
        }

        let overflow = 0
        this.currentTime += dt

        if (this.currentTime > this.duration) {
            overflow = this.currentTime - this.duration
            this.currentTime = this.duration
        }

        this.apply()
        return overflow
    }

    private apply() {
        this.tweenable.set(this.tweenable.lerpFunction(this.startingValue, this.targetValue, this.percent()))
    }

    isDone() {
        return this.percent() >= 1
    }

    reset() {
        this.currentTime = 0
        this.apply()
    }

    skip() {
        this.currentTime = this.duration
        this.apply()
    }
}

export class TweenChain implements ITween {
    private readonly chain: ITween[] = []
    private currentChainIndex = 0

    isDone(): boolean {
        return this.currentChainIndex >= this.chain.length
    }

    updateAndGetOverflow(dt: number): number {
        if (this.isDone()) {
            return 0
        }
        const currentItem = this.currentChainItem()
        let overflow = currentItem.updateAndGetOverflow(dt)

        if (currentItem.isDone()) {
            this.currentChainIndex++
            this.updateAndGetOverflow(overflow)
        }

        return 0
    }

    update(dt: number) {
        // update and throw away overflow result (client code doesn't care)
        this.updateAndGetOverflow(dt)
    }

    add(tween: ITween) {
        this.chain.push(tween)
    }

    addNumberTween(tweenable: TweenableNumber, targetValue: number, duration: number, easeFunction: EaseFunction): TweenChain {
        this.add(new Tween<number>(tweenable, targetValue, duration, easeFunction))
        return this
    }

    addPointTween(tweenable: TweenablePoint, targetValue: Point, duration: number, easeFunction: EaseFunction): TweenChain {
        this.add(new Tween<Point>(tweenable, targetValue, duration, easeFunction))
        return this
    }

    private currentChainItem() {
        if (this.chain.length > this.currentChainIndex) {
            return this.chain[this.currentChainIndex]
        }
        return null
    }
}

export class Tweenable<T> {
    readonly lerpFunction: LerpFunction<T>;
    getter: () => T;
    setter: (value: T) => void;

    constructor(getter: () => T, setter: (value: T) => void, lerpFunction: LerpFunction<T>) {
        this.getter = getter;
        this.setter = setter;
        this.lerpFunction = lerpFunction
    }

    set(newValue: T) {
        this.setter(newValue)
    }

    get(): T {
        return this.getter()
    }
}

function numberLerp(start: number, end: number, percent: number) {
    return start + (end - start) * percent
}

type IClonable = { clone: () => IClonable }

export class TweenableNumber extends Tweenable<number>{
    constructor(getter: () => number, setter: (value: number) => void) {
        super(getter, setter, numberLerp)
    }

    static FromConstant(n: number) {
        let data = { n }
        return new TweenableNumber(() => data.n, v => data.n = v)
    }
}

// Tweenable of an object with a `.clone()` function
export abstract class TweenableClonable<T> extends Tweenable<T>{
    constructor(getter: () => T, setter: (value: T) => void, lerpFunction: LerpFunction<T>) {

        const newGetter = () => {
            const dangerousCast = getter() as unknown as IClonable
            // @ts-ignore - i don't know how to get the language to cooperate
            return dangerousCast.clone()
        }

        // @ts-ignore - i don't know how to get the language to cooperate
        super(newGetter as () => T, setter, lerpFunction)
    }
}

function pointLerp(start: IPointData, end: IPointData, percent: number) { return new Point(numberLerp(start.x, end.x, percent), numberLerp(start.y, end.y, percent)) }

export class TweenablePoint extends TweenableClonable<Point> {
    constructor(getter: () => Point, setter: (value: Point) => void) {
        super(getter, setter, pointLerp)
    }

    static FromConstant(point: Point) {
        return new TweenablePoint(() => point, v => point = v)
    }
}