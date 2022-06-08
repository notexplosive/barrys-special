import { Container, Text } from 'pixi.js';
export class Tooltip extends Container {
    readonly text: Text;

    constructor() {
        super()
        this.text = new Text("", { fontFamily: "Concert One", fill: ['#ffffff'], stroke: 0x000000, strokeThickness: 5, fontSize: 40 })
        this.text.anchor.set(0.5)
        this.addChild(this.text)
    }

    setText(text: string) {
        this.text.text = text
    }
}