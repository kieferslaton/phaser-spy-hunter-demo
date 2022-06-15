export default class TimerBar {
  constructor(scene, x, y, duration) {
    this.bar = new Phaser.GameObjects.Graphics(scene);
    this.x = x;
    this.y = y;
    this.duration = duration;
    this.value = duration;
    this.p = 596 / duration;

    this.draw();
    scene.add.existing(this.bar);
  }

  decrease(time) {
    this.value = this.duration - time;
    this.draw();
  }

  draw() {
    this.bar.clear();

    this.bar.fillStyle(0x000000);
    this.bar.fillRect(this.x, this.y, 600, 16);
    this.bar.fillStyle(0xffffff);
    this.bar.fillRect(this.x + 2, this.y + 2, 596, 12);
    this.bar.fillStyle(0x00ff00);
    var d = Math.floor(this.p * this.value);
    this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
  }
}
