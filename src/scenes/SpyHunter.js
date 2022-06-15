import Phaser from "phaser";
import trash from "../assets/paper.png";
import rock from "../assets/rock.png";
import car1 from "../assets/car.png";
import car2 from "../assets/car2.png";
import bg from "../assets/background.png";

import TimerBar from "../components/TimerBar";

export default class SpyHunter extends Phaser.Scene {
  constructor() {
    super({
      key: "Spy Hunter",
    });
  }

  preload() {
    this.load.image("trash", trash);
    this.load.image("rock", rock);
    this.load.image("car1", car1);
    this.load.image("car2", car2);
    this.load.image("bg", bg);
  }

  create() {
    this.duration = 50000;
    this.playing = true;
    this.bg = this.add.tileSprite(300, 300, 600, 600, "bg");
    this.player = this.physics.add.sprite(300, 300, "car1");
    this.player.setCollideWorldBounds(true);

    this.chip = this.physics.add.sprite(300, 550, "car2");
    this.chip.setCollideWorldBounds(true);

    this.playerPrevPosX = 400;
    this.playerDeltaX = 0;

    this.physics.add.overlap(this.player, this.chip, () =>
      this.endGame("lose")
    );
    this.timerBar = new TimerBar(this, 0, 584, this.duration);

    var scene = this;
    var timer = this.time;
    var physics = this.physics;
    var player = this.player;
    timer.addEvent({
      delay: Phaser.Math.Between(3000, 5000),
      callback: updateTimer(physics, player, timer),
      repeat: 0,
    });

    function updateTimer() {
      if (Phaser.Math.Between(0, 1) > 0.5) {
        var trash = physics.add.sprite(
          Phaser.Math.Between(50, 550),
          0,
          "trash"
        );
        physics.add.overlap(player, trash, vacuum, null, this);
        function vacuum(player, trash) {
          trash.disableBody(true, true);
          player.setVelocityY(-30);
          timer.addEvent({
            delay: 1000,
            callback: () => player.setVelocityY(0),
            repeat: 0,
          });
        }
        trash.setVelocityY(250);
      } else {
        var rock = physics.add.sprite(Phaser.Math.Between(50, 550), 0, "rock");
        physics.add.overlap(player, rock, slowdown, null, this);
        function slowdown(player, rock) {
          rock.disableBody(true, true);
          player.setVelocityY(30);
          timer.addEvent({
            delay: 1000,
            callback: () => player.setVelocityY(0),
            repeat: 0,
          });
        }
        rock.setVelocityY(250);
      }
      timer.addEvent({
        delay: Phaser.Math.Between(1000, 3000),
        callback: updateTimer,
        repeat: 0,
      });
    }

    this.endGame = (state) => {
      scene.scene.pause();
      scene.add.rectangle(300, 300, 600, 600, 0x000000, 0.25);
      var style = {
        font: "bold 60px Arial",
        fill: "#fff",
        align: "center",
      };
      if (state === "win") {
        scene.add.text(300, 300, "YOU WIN", style).setOrigin(0.5);
      } else {
        scene.add.text(300, 300, "YOU LOSE", style).setOrigin(0.5);
      }
    };
  }

  update() {
    this.timerBar.decrease(this.time.now);
    if (this.time.now >= this.duration) this.endGame("win");
    const cursors = this.input.keyboard.createCursorKeys();
    this.bg.tilePositionY -= 4.25;
    if (cursors.left.isDown && this.playing) {
      this.player.setVelocityX(-300);
      setTimeout(() => this.chip.setVelocityX(-300), 250);
    } else if (cursors.right.isDown && this.playing) {
      this.player.setVelocityX(300);
      setTimeout(() => this.chip.setVelocityX(300), 250);
    } else {
      this.player.setVelocityX(0);
      setTimeout(() => this.chip.setVelocityX(0), 250);
    }
    this.playerDeltaX = this.player.getBottomCenter().x - this.playerPrevPosX;
    this.playerPrevPosX = this.player.getBottomCenter().x;
  }
}
