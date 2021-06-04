"use strict";

import * as sound from "./sound.js";

const carrotSound = new Audio("./sound/carrot_pull.mp3");
const CARROT_SIZE = 80;

export const ItemType = Object.freeze({
  carrot: "carrot",
  bug: "bug",
});

export class Field {
  constructor(carrotCount, bugCount) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.field = document.querySelector(".game__field");
    this.fieldReact = this.field.getBoundingClientRect();
    // this.onClick = this.onClick.bind(this);
    // this.field.addEventListener("click", (event) => this.onClick(event));
    this.field.addEventListener("click", this.onClick);
  }

  init() {
    this.field.innerHTML = "";
    this._addItem("carrot", this.carrotCount, "img/carrot.png");
    this._addItem("bug", this.bugCount, "img/bug.png");
  }

  setClickListener(onItemClick) {
    this.onItemClick = onItemClick;
  }

  _addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    const x2 = this.fieldReact.width - CARROT_SIZE;
    const y2 = this.fieldReact.height - CARROT_SIZE;
    for (let i = 0; i < count; i++) {
      const item = document.createElement("img");
      item.setAttribute("src", imgPath);
      item.setAttribute("class", className);
      item.style.position = "absolute";
      const x = randomNumber(x1, x2);
      const y = randomNumber(y1, y2);
      item.style.top = `${y}px`;
      item.style.left = `${x}px`;
      this.field.appendChild(item);
    }
  }

  onClick = (event) => {
    this.event = event;

    const target = event.target;
    if (target.matches(".carrot")) {
      // 당근
      target.remove();
      sound.playCarrot();
      // A && b. A면 B실행됨
      this.onItemClick && this.onItemClick(ItemType.carrot);
    } else if (target.matches(".bug")) {
      this.onItemClick && this.onItemClick(ItemType.bug);
    }
  };
}

function randomNumber(min, max) {
  return Math.random() * (max - min + 1) + min;
}
