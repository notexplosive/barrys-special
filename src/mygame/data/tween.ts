export type IsDoneFunction = () => boolean
export type EaseFunction = (x: number) => number

export class EaseFunctions {
    public static linear(x: number) {
        return x;
    }
}

export class Tween<T> {
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

    update(dt: number) {
        this.currentTime = + dt

        if (this.currentTime > this.duration) {
            this.currentTime = this.duration
        }

        this.tweenable.set(this.tweenable.lerpFunction(this.startingValue, this.targetValue, this.percent()))
    }

    isDone() {
        return this.percent() >= 1
    }
}

export class Tweenable<T> {
    private startingValue: T
    readonly lerpFunction: (start: T, end: T, percent: number) => T;

    constructor(startingValue: T, lerpFunction: (start: T, end: T, percent: number) => T) {
        this.startingValue = startingValue
        this.lerpFunction = lerpFunction
    }

    set(newValue: T) {
        this.startingValue = newValue
    }

    get(): T {
        return this.startingValue
    }
}

export class TweenableNumber extends Tweenable<number>{
    constructor(startingValue: number) {
        super(startingValue, (start, end, percent) => { return start + (end - start) * percent })
    }
}