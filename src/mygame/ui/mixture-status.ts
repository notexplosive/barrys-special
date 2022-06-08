import { Container, Sprite, Rectangle } from "pixi.js";
import { PrimitiveRenderer } from "../../limbo/render/primitive";
import { Mixture } from "../data/mixture";

export class MixtureStatus extends Container {
    public readonly mixture: Mixture;
    slots: Sprite[];

    constructor(mixture: Mixture) {
        super();
        this.mixture = mixture;
        this.sortableChildren = true

        function createSlot(): Sprite {
            const result = new Sprite()
            result.anchor.set(0.5)
            result.scale.set(0.5)
            result.zIndex += 10
            return result
        }

        this.slots = [createSlot(), createSlot(), createSlot()]
        this.addChild(this.slots[0])
        this.addChild(this.slots[1])
        this.addChild(this.slots[2])

        const spacing = 64
        this.slots[0].x = -spacing
        this.slots[2].x = spacing

        const renderer = new PrimitiveRenderer(this)
        renderer.rectangle(true, new Rectangle(-spacing - 32, -32, 64 * 3, 64), { color: 0xffffff, alpha: 0.5 })

        this.refresh()
    }

    refresh() {
        let ingredients = this.mixture.ingredients()

        if (ingredients.length == 0) {
            this.visible = false
        } else {
            this.visible = true
        }

        for (let i = 0; i < ingredients.length; i++) {
            this.slots[i].texture = ingredients[i].texture()
        }
    }
}