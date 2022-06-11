import { AssetLoader, prepareLoad } from '../limbo/core/assets';
import { gridBasedSpriteSheetData } from '../limbo/data/grid-based-sprite-sheet-data';
import WebFont from 'webfontloader';

export function preload() {
    prepareLoad(AssetLoader.Texture, "background", "background.png")
    prepareLoad(AssetLoader.Texture, "solid-color-bg", "solid-color-bg.png")
    prepareLoad(AssetLoader.Sound, "ouch", "ouch.ogg")
    prepareLoad(AssetLoader.Sound, "pickup", "pickup.ogg")
    prepareLoad(AssetLoader.Sound, "metal-impact", "metal-impact.ogg")
    prepareLoad(AssetLoader.Sound, "quick-pour", "quick-pour.ogg")
    prepareLoad(AssetLoader.Sound, "gulp", "gulp.ogg")
    prepareLoad(AssetLoader.Sound, "footstep", "footstep.ogg")
    prepareLoad(AssetLoader.Sound, "ice-shake", "ice-shake.ogg")
    prepareLoad(AssetLoader.Sound, "gurgle", "gurgle.ogg")
    prepareLoad(AssetLoader.Sound, "fwp", "fwp.ogg")
    prepareLoad(AssetLoader.dynamicSpritesheet({ width: 128, height: 128 }, gridBasedSpriteSheetData), "ingredients", "barrys-ingredients.png")
    prepareLoad(AssetLoader.dynamicSpritesheet({ width: 128, height: 128 }, gridBasedSpriteSheetData), "icons", "icons.png")
    prepareLoad(AssetLoader.dynamicSpritesheet({ width: 128, height: 128 }, gridBasedSpriteSheetData), "glass", "barrys-glass.png")
    prepareLoad(AssetLoader.dynamicSpritesheet({ width: 128, height: 128 }, gridBasedSpriteSheetData), "buttons", "buttons.png")

    prepareLoad(AssetLoader.dynamicSpritesheet({ width: 256, height: 256 }, gridBasedSpriteSheetData), "beep", "beep.png")
    prepareLoad(AssetLoader.dynamicSpritesheet({ width: 256, height: 256 }, gridBasedSpriteSheetData), "zap", "zap.png")
    prepareLoad(AssetLoader.dynamicSpritesheet({ width: 256, height: 256 }, gridBasedSpriteSheetData), "creature", "creature.png")
    prepareLoad(AssetLoader.dynamicSpritesheet({ width: 256, height: 256 }, gridBasedSpriteSheetData), "psycho-x", "psycho-x.png")
    prepareLoad(AssetLoader.dynamicSpritesheet({ width: 256, height: 256 }, gridBasedSpriteSheetData), "jim", "jim.png")
    prepareLoad(AssetLoader.dynamicSpritesheet({ width: 256, height: 256 }, gridBasedSpriteSheetData), "mrw", "mrw.png")
    prepareLoad(AssetLoader.dynamicSpritesheet({ width: 256, height: 256 }, gridBasedSpriteSheetData), "donny", "donny.png")

    WebFont.load({
        google: {
            families: ['Concert One']
        }
    });
}