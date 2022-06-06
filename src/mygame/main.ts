import * as PIXI from 'pixi.js';
import { Rectangle } from 'pixi.js';
import { game } from "../index";
import { Updater } from '../limbo/data/updater';
import { PrimitiveRenderer } from '../limbo/render/primitive';


// game().updaters.push(new Updater((dt: number) => { console.log(dt) }));


const plantRoot = game().worldContainer.addChild(new PIXI.Container());
plantRoot.x = 300;
plantRoot.y = 200;

var plantRenderer = new PrimitiveRenderer(plantRoot);
plantRenderer.circle(true, new PIXI.Point(0, 0), 25, { color: 0x00ff00 })

var primitiveRenderer = new PrimitiveRenderer(game().app.stage);

var filled = false;

primitiveRenderer.rectangle(filled, new Rectangle(100, 100, 50, 50), { width: 1, color: 0xFFAAFF });

primitiveRenderer.rectangle(filled, new Rectangle(500, 500, 50, 50), { width: 1, color: 0xFFFFAA });

var lineStyle = { color: 0xFF0000, width: 1, join: PIXI.LINE_JOIN.ROUND }

primitiveRenderer.line(new PIXI.Point(300, 300), new PIXI.Point(500, 200), lineStyle)

primitiveRenderer.circle(filled, new PIXI.Point(200, 200), 50, lineStyle);