import Phaser from "phaser";
import SpyHunter from "./scenes/SpyHunter";
import button from "./assets/button.png";

//Bulk of the actual scene logic is in scenes/SpyHunter.
//This is basically meant to be a "start menu" and practice scene transition
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
    //Open game scene on button click
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
