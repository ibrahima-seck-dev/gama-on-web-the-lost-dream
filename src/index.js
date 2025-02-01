import { Engine } from "@babylonjs/core";
import Game from "./Game.js";

window.onload = () => {
    const canvas = document.getElementById("renderCanvas");
    const engine = new Engine(canvas, true);

    window.addEventListener("resize", () => {
        engine.resize();
    });

    const game = new Game(engine, canvas);
    game.start();
    game.unit();
};
