import { AssetLoader, prepareLoad } from '../limbo/core/assets';
import { gridBasedSpriteSheetData } from '../limbo/data/grid-based-sprite-sheet-data';

export function preload() {
    prepareLoad(AssetLoader.Texture, "background", "background.png")
    prepareLoad(AssetLoader.Sound, "ouch", "ouch.ogg")
    prepareLoad(AssetLoader.Spritesheet, "ingredients", "barrys-ingredients.json")
    prepareLoad(AssetLoader.dynamicSpritesheet({ width: 128, height: 128 }, gridBasedSpriteSheetData), "glass", "barrys-glass.png")
}