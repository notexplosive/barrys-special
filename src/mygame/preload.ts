import { AssetLoader, prepareLoad } from '../limbo/core/assets';
import { gridBasedSpriteSheetData } from '../limbo/data/grid-based-sprite-sheet-data';

export function preload() {
    prepareLoad(AssetLoader.Texture, "background", "background.png")
    prepareLoad(AssetLoader.Sound, "ouch", "ouch.ogg")
    prepareLoad(AssetLoader.dynamicSpritesheet({ width: 128, height: 128 }, gridBasedSpriteSheetData), "ingredients", "barrys-ingredients.png")
    prepareLoad(AssetLoader.dynamicSpritesheet({ width: 128, height: 128 }, gridBasedSpriteSheetData), "glass", "barrys-glass.png")
    prepareLoad(AssetLoader.dynamicSpritesheet({ width: 128, height: 128 }, gridBasedSpriteSheetData), "buttons", "buttons.png")
}