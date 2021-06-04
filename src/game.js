"use strict";

import * as sound from "./sound.js";
import { Field, ItemType } from "./field.js";

export const Reason = Object.freeze({
  win: "win",
  lose: "lose",
  cancel: "cancel",
});

// Builder Pattern
export class GameBuilder {
  withGameDuration(duration) {
    this.gameDuration = duration;
    // 엘리 설명: array에서 map, reduce를 쓰면 array 자체를 리턴해서 메소드를 체이닝해서 호출할 수 있다. 이 원리임
    return this;
  }

  withCarrotCount(num) {
    this.carrotCount = num;
    return this;
  }

  withBugCount(num) {
    this.bugCount = num;
    return this;
  }

  build() {
    return new Game(
      this.gameDuration, //
      this.carrotCount, //
      this.bugCount
    );
  }
}

class Game {
  constructor(gameDuration, carrotCount, bugCount) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.timerBox = document.querySelector(".game__timer");
    this.countBox = document.querySelector(".game__score");
    this.playBtn = document.querySelector(".game__button");
    this.playBtn.addEventListener("click", () => {
      if (this.started) {
        this.stop();
      } else {
        this.start();
      }
    });

    this.gameField = new Field(carrotCount, bugCount);
    this.gameField.setClickListener(this.onItemClick);

    this.started = false;
    this.score = 0;
    this.timer = undefined;
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
  }

  start() {
    this.started = true;
    this.init();
    this.showStopButton();
    this.showTimerAndCountBox();
  }

  stop(reason) {
    this.started = false;
    this.hidePlayButton();
    this.stopTimer();
    sound.stopBg();

    this.onGameStop && this.onGameStop(reason);
  }

  init() {
    this.score = 0;
    this.countBox.textContent = this.carrotCount;
    this.startTimer(this.gameDuration);
    this.gameField.init();
    sound.playBg();
  }

  onItemClick = (item) => {
    if (!this.started) return;

    if (item === ItemType.carrot) {
      // 당근
      this.score++;
      this.updateScoreBoard();
      if (this.score === this.carrotCount) {
        this.stop(Reason.win);
      }
    } else if (item === ItemType.bug) {
      this.stop(Reason.lose);
    }
  };

  setClickListener(onPlayBtnClick) {
    this.onPlayBtnClick = onPlayBtnClick;
  }

  // Timer

  startTimer() {
    let remainingTimeSec = this.gameDuration;
    this.updateTimerText(remainingTimeSec);
    this.timer = setInterval(() => {
      if (remainingTimeSec <= 0) {
        this.stopTimer();
        this.stop(Reason.lose);
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }

  updateTimerText(gameDuration) {
    const minutes = Math.floor(gameDuration / 60);
    const seconds = gameDuration % 60;
    this.timerBox.innerText = `${minutes}:${seconds}`;
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  // playBtn
  showStopButton() {
    this.playBtn.textContent = "◼︎";
    this.playBtn.style.visibility = "visible";
  }
  hidePlayButton() {
    this.playBtn.style.visibility = "hidden";
  }

  showTimerAndCountBox() {
    this.timerBox.style.visibility = "visible";
    this.countBox.style.visibility = "visible";
  }

  // score
  updateScoreBoard() {
    this.countBox.textContent = this.carrotCount - this.score;
  }
}
