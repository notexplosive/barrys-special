import { Reaction } from './reaction';
import { TweenChain } from './tween';
export class Dialogue {
    readonly introPage: string[];
    readonly dislike: (reaction: Reaction) => string[];
    readonly missingSomething: (reaction: Reaction) => string[];
    readonly returnPage: string[];
    readonly like: string[];
    readonly bland: string[];

    constructor(introPage: string[], returnPage: string[], like: string[], bland: string[], missingSomething: (reaction: Reaction) => string[], dislike: (reaction: Reaction) => string[]) {
        this.introPage = introPage;
        this.returnPage = returnPage;
        this.like = like
        this.bland = bland
        this.missingSomething = missingSomething;
        this.dislike = dislike;
    }
}