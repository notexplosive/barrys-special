import { Container, Text } from 'pixi.js';
export class Tooltip extends Container {
    readonly titleText: Text;
    readonly subtitleText: Text;

    constructor() {
        super()
        this.titleText = new Text("", { fontFamily: "Concert One", fill: ['#ffffff'], stroke: 0x000000, strokeThickness: 5, fontSize: 40 })
        this.titleText.anchor.set(0.5)
        this.subtitleText = new Text("Foobar", { fontFamily: "Concert One", fill: ['#ffffff'], stroke: 0x000000, strokeThickness: 5, fontSize: 30 })
        this.subtitleText.anchor.set(0.5)
        this.subtitleText.y = 40
        this.addChild(this.titleText)
        this.addChild(this.subtitleText)
    }

    setText(title: string, subtitle: string) {
        this.titleText.text = title
        this.subtitleText.text = subtitle
    }

    clear() {
        this.setText("", "")
    }
}