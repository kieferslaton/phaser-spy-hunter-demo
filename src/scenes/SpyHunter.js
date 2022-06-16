import Phaser from "phaser";
import trash from "../assets/paper.png";
import rock from "../assets/rock.png";
import car1 from "../assets/car.png";
import car2 from "../assets/car2.png";
import bg from "../assets/background.png";

import TimerBar from "../components/TimerBar";

export default class SpyHunter extends Phaser.Scene {
  constructor() {
    //Scene needs a key if there's more than one scene in the game
    super({
      key: "Spy Hunter",
    });
  }

  preload() {
    //Loading assets
    this.load.image("trash", trash);
    this.load.image("rock", rock);
    this.load.image("car1", car1);
    this.load.image("car2", car2);
    this.load.image("bg", bg);
  }

  create() {
    this.duration = 50000; //Time until Chip runs out of gas
    this.bg = this.add.tileSprite(300, 300, 600, 600, "bg"); //Scrolling highway
    this.player = this.physics.add.sprite(300, 300, "car1");
    this.player.setCollideWorldBounds(true);

    this.chip = this.physics.add.sprite(300, 550, "car2");
    this.chip.setCollideWorldBounds(true);

    this.physics.add.overlap(
      this.player,
      this.chip,
      () => this.endGame("lose") //Game over if Chip touches you
    );

    //Bottom "gas" bar - logic is in components/TimerBar.js
    this.timerBar = new TimerBar(this, 0, 584, this.duration);
    this.timerBar.bar.setDepth(1);

    //Setting a couple refs so we can access inside functions
    var scene = this;
    var timer = this.time;
    var physics = this.physics;
    var player = this.player;

    //Create new rocks or trash at random intervals between 3-5s
    timer.addEvent({
      delay: Phaser.Math.Between(1000, 3000),
      callback: updateTimer,
      repeat: 0,
    });

    //Store upper and lower bounds and decrement them a bit each round so rocks and trash get more frequent
    var lower = 1000;
    var upper = 3000;

    //Slightly shift frequency of rocks over trash as game goes on
    var trashBounds = 0.5;

    //Slightly speed up game over time
    this.highwaySpeed = 4.25;
    var objectVelocity = 255;

    function updateTimer() {
      lower -= 25;
      upper -= 25;
      trashBounds += 0.02;
      this.highwaySpeed += 0.075;
      objectVelocity += 0.22;
      //Randomizer to make either trash or a rock
      if (Phaser.Math.Between(0, 1) > trashBounds) {
        var trash = physics.add.sprite(
          Phaser.Math.Between(50, 550), //X Bounds on the board
          0,
          "trash"
        );
        physics.add.overlap(player, trash, vacuum, null, this);
        function vacuum(player, trash) {
          trash.disableBody(true, true); //Make the trash vanish
          player.setVelocityY(-30); //"Speed" the player up
          timer.addEvent({
            delay: 1000, //After 1s, have player resume normal velocity
            callback: () => player.setVelocityY(0),
            repeat: 0,
          });
        }
        trash.setVelocityY(objectVelocity); //Make trash scroll down the screen
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
        rock.setVelocityY(objectVelocity);
      }
      timer.addEvent({
        delay: Phaser.Math.Between(1000, 3000),
        callback: updateTimer,
        repeat: 0,
      });
    }

    this.endGame = (state) => {
      scene.scene.pause(); //Pause the game
      scene.add.rectangle(300, 300, 600, 600, 0x000000, 0.25); //Add a gray overlay
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
    this.bg.tilePositionY -= this.highwaySpeed; //Scroll the highway
    this.timerBar.decrease(this.time.now); //Decrease time on each update
    if (this.time.now >= this.duration) this.endGame("win"); //If time is up, you win
    const cursors = this.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) {
      this.player.setVelocityX(-300);
      //Have Chip chase you horizontally after 0.25s
      this.time.addEvent({
        delay: 250,
        callback: () => this.chip.setVelocityX(-300),
        repeat: 0,
      });
    } else if (cursors.right.isDown) {
      this.player.setVelocityX(300);
      this.time.addEvent({
        delay: 250,
        callback: () => this.chip.setVelocityX(300),
        repeat: 0,
      });
    } else {
      this.player.setVelocityX(0);
      this.time.addEvent({
        delay: 250,
        callback: () => this.chip.setVelocityX(0),
        repeat: 0,
      });
    }
  }
}
