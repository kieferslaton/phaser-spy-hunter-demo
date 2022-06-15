import Phaser from "phaser";
import SpyHunter from "./scenes/SpyHunter";
import button from "./assets/button.png";

export default class MyGame extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.image("button", button);
  }

  create() {
    var game = this;
    var button = this.add.image(300, 300, "button").setInteractive();
    button.once("pointerdown", () => {
      game.scene.start("Spy Hunter");
    });
  }

  update() {}
}

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 600,
  height: 600,
  scene: [MyGame, SpyHunter],
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);
