"use strict";

export default class PopUp {
  constructor() {
    this.popUp = document.querySelector(".pop-up");
    this.popUpBtn = document.querySelector(".pop-up__refresh");
    this.popUpMessage = document.querySelector(".pop-up__message");
    this.popUpBtn.addEventListener("click", () => {
      this.onClick && this.onClick();
      this.hide();
    });
  }

  setClickListener(onClick) {
    this.onClick = onClick;
  }

  showWithText(text) {
    // this.popUp.style.visibility = "visible";
    this.popUpMessage.textContent = text;
    this.popUp.classList.remove("pop-up--hide");
  }

  hide() {
    this.popUp.classList.add("pop-up--hide");
    // this.popUp.style.visibility = "hidden";
  }
}
