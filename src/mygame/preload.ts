import { AssetType, prepareLoad, finishLoad, Assets } from '../limbo/core/assets';

export function preload() {
    prepareLoad(AssetType.Spritesheet, "glass", "barrys-glass.json")
    prepareLoad(AssetType.Texture, "background", "background.png")
    // prepareLoad(AssetType.Texture, "ingredients", "barrys-ingredients.png")
    prepareLoad(AssetType.Sound, "ouch", "ouch.ogg")
    prepareLoad(AssetType.Spritesheet, "ingredients", "barrys-ingredients.json")
}