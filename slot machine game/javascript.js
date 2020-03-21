console.clear();

var handleSound = new Audio('./handle.mp3');
var coinsSound = new Audio('./coins.mp3');
var losingSound = new Audio('./lose.mp3');

const combinations = {
  "2": [
    ["7️⃣", "🍉", "🍒"],
    ["7️⃣", "💯", "🍒"],
    ["7️⃣", "🍒", "🍒"],
    ["🍉", "7️⃣", "🍒"],
    ["🍉", "🍒", "🍒"],
    ["🍉", "💯", "🍒"],
    ["💯", "7️⃣", "🍒"],
    ["💯", "🍉", "🍒"],
    ["💯", "🍒", "🍒"],
    ["🍒", "💯", "🍒"],
    ["🍒", "7️⃣", "🍒"],
    ["🍒", "🍉", "🍒"]
  ],
  "5": [
    ["7️⃣", "7️⃣", "🍒"],
    ["🍉", "🍉", "🍒"],
    ["💯", "💯", "🍒"]
  ],
  "10": [["🍒", "🍒", "🍒"]],
  "30": [["7️⃣", "7️⃣", "7️⃣"]],
  "100": [["💯", "💯", "💯"]]
};

class SlotMachine {
  constructor(el) {
    this.element = el;
    this.handle = this.getEl(".handle")[0];
    this.containers = this.getEl(".container");
    this.values = ["7️⃣", "🍒", "🍉", "💯"];
    this.registerEvents();
    this.result = ["7️⃣", "🍒", "🍉"];
    this.currentPlay = "";
    this.credits = 100;
    this.bet = 5;
    this.winnings = 0;
    this.playing = false;

    this.render();
  }

  getEl(el) {
    return this.element.querySelectorAll(el);
  }

  play() {
    if (this.playing || this.credits == 0 || this.bet > this.credits)
      return false;

    this.credits -= this.bet;
    let i = 30;

    this.playing = true;

    this.currentPlay = setInterval(() => {
      const values = this.generateResult();
      this.renderValues(values);

      i--;

      if (i <= 0) {
        clearInterval(this.currentPlay);
        i = 0;
        this.winnings = this.checkWinnings(values);
        this.credits += this.winnings;
        this.playing = false;
        this.render();
      }
    }, 100);
  }

  render() {
    this.getEl(".total-bet .value").forEach(el => {
      console.log(el);
      el.innerHTML = this.bet;
    });

    this.getEl(".credits .value").forEach(el => {
      el.innerHTML = this.credits;
    });

    this.getEl(".winnings .value").forEach(el => {
      el.innerHTML = this.winnings;
    });
  }

  checkWinnings(result) {
    let values = JSON.stringify(result),
      winnings = 0;

    Object.entries(combinations).forEach((a, b) => {
      a[1].forEach((c, d) => {
        if (values == JSON.stringify(c)) {
          winnings = this.bet * parseInt(a[0]);

          coinsSound.play();
          document.querySelector('.winnings').classList.add('winner')

          setTimeout(() => {
            document.querySelector('.winnings').classList.remove('winner')
          },3700)
        }
        losingSound.play();
      });
    });
    return winnings;
  }

  registerEvents() {
    this.handle.onclick = e => {
      this.triggerHandle(e);
      this.play();
    };

    /** UI controls **/

    let increaseBetBtn = this.getEl(".increase-bet")[0],
      decreaseBetBtn = this.getEl(".decrease-bet")[0];

    increaseBetBtn.onclick = () => this.increaseBet();
    decreaseBetBtn.onclick = () => this.decreaseBet();
  }

  increaseBet() {
    if (this.bet < this.credits) {
      this.bet += 5;
      this.render();
    }
  }

  decreaseBet() {
    if (this.bet > 5) {
      this.bet -= 5;
      this.render();
    }
  }

  triggerHandle(e) {
    this.handle.className += " playing";
    handleSound.play();

    setTimeout(() => {
      this.handle.className = "handle";
    }, 1000);
  }

  generateResult() {
    return [
      this.values[Math.floor(Math.random() * this.values.length - 1) + 1],
      this.values[Math.floor(Math.random() * this.values.length - 1) + 1],
      this.values[Math.floor(Math.random() * this.values.length - 1) + 1]
    ];
  }

  renderValues(values) {
    this.containers[0].innerHTML = values[0];
    this.containers[1].innerHTML = values[1];
    this.containers[2].innerHTML = values[2];
  }
}

const mySlot = new SlotMachine(document.querySelectorAll(".slot-machine")[0]);
