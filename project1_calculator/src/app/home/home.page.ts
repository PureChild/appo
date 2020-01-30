import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor() {}
}

window.onload = () => {
  const calScreen = document.getElementById("calScreen") as HTMLInputElement;
  const calHistory = document.getElementById("calHistory") as HTMLInputElement;
  var currentValue = "0";
  var currentSymbol = "";
  var lastChar = "";
  var isWrongFomula = false;
  var isMinus = false;
  var isStampedDecimalPoint = false;
  var screenValueIsResult = false;
  function setBtnEvent(btnElement){
    calScreen.style.fontSize = "300%";
    if(isWrongFomula){
      currentValue = "";
    }
    // if(calHistory.value === "" && isMinus){
    //   currentValue = "-";
    // } else {
      currentValue = "";
    // }
    if(!isNaN(parseInt(btnElement.value))){
      if(!isWrongFomula){
        if(calHistory.value.length > 2
           && calHistory.value[calHistory.value.length - 1] === "0"
           && isNaN(parseInt(calHistory.value[calHistory.value.length - 2]))){
             calHistory.value = calHistory.value.substr(0, calHistory.value.length - 1);
        }
        currentValue += btnElement.value;
        calScreen.value += parseInt(currentValue).toString();
        calScreen.style.color = "#008485";
        // calScreen.value = parseInt(currentValue).toLocaleString();
      }
    } else {
      switch (btnElement.value) {
        case "<":
          if(!isWrongFomula){
            if(calScreen.value === ""){
              calHistory.value = calHistory.value.substr(0, calHistory.value.length - 1);
            } else {
              if(parseInt(currentValue) < 0){
                currentValue = (Math.floor((parseInt(currentValue) * -1) / 10) * -1).toString();
              } else {
                currentValue = Math.floor(parseInt(currentValue) / 10).toString();
              }

              if(currentValue === "0" || currentValue === "" || isNaN(parseInt(currentValue))){
                calScreen.value = "";
                screenValueIsResult = false;
              } else {
                calScreen.value = parseInt(currentValue).toString();
                // calScreen.value = parseInt(currentValue).toLocaleString();
              }
            }
          } else {
            calScreen.value = "";
            isWrongFomula = false;
          }
          break;
        case ".":
          if(screenValueIsResult){
            calHistory.value = "";
          }
          if(!isStampedDecimalPoint){
            if(calScreen.value === ""){
              calScreen.value = "0";
            }
            calScreen.value += ".";
            isStampedDecimalPoint = true;
          }
          break;
        case "=":
          if(!isWrongFomula){
            calHistory.value += calScreen.value;
            var numberOfCloseParenthesis = (calHistory.value.match(/\(/g) || []).length
                                         - (calHistory.value.match(/\)/g) || []).length
            if(numberOfCloseParenthesis > 0){
              calHistory.value += ")".repeat(numberOfCloseParenthesis);
            }
            try {
              var calResult = eval(calHistory.value
                                    .replace(new RegExp("-","g"), "-")
                                    .replace(new RegExp("×","g"), "*")
                                    .replace(new RegExp("÷","g"), "/"));
              currentValue = calResult.toString();
              calScreen.value = (Math.round(calResult * 1000) / 1000).toString();
              if(calScreen.value === "Infinity"){
                throw "div0";
              }
              isWrongFomula = false;
              screenValueIsResult = true;
            } catch (error) {
              if(calHistory.value === ""){
                calScreen.value = "0";
              } else {
                isWrongFomula = true;
                calScreen.style.color = "#D60036";
                if(error === "div0"){
                  calScreen.style.fontSize = "200%";
                  calScreen.value = "0으로 나눌 수 없습니다";
                } else {
                  calScreen.value = "잘못된 수식";
                }
              }
            }

            if(!calScreen.value.includes(".")){
              isStampedDecimalPoint = false;
            }
          } else {

          }
          break;
        case "−":
          if(!isWrongFomula){
            isStampedDecimalPoint = false;
            if(calHistory.value === "" && isNaN(parseInt(calScreen.value))){
              if(isMinus){
                isMinus = false;
                calScreen.value = "";
              } else {
                isMinus = true;
                calScreen.value = "-";
              }
            } else {
              if(calScreen.value === ""){
                lastChar = calHistory.value[calHistory.value.length - 1];
                if(lastChar === "+"
                || lastChar === "-"
                || lastChar === "×"
                || lastChar === "÷" ){
                  calHistory.value += "(-";
                }
              } else {
                calHistory.value = calScreen.value + "-";
                calScreen.value = "";
                currentValue = "0";
              }
            }
          }
          break;
        default:
          if(!isWrongFomula){
            isStampedDecimalPoint = false;
            currentSymbol = btnElement.value;
            if(calScreen.value !== ""){
              if(screenValueIsResult){
                calHistory.value = "";
                screenValueIsResult = false;
              }
              var numberOfCloseParenthesis = (calHistory.value.match(/\(/g) || []).length
                                           - (calHistory.value.match(/\)/g) || []).length
              if(numberOfCloseParenthesis > 0){
                calHistory.value += calScreen.value
                                 + ")".repeat(numberOfCloseParenthesis)
                                 + currentSymbol;
              } else {
                calHistory.value += calScreen.value + currentSymbol;
              }
              calScreen.value = "";
              currentValue = "0";
            }
            lastChar = calHistory.value[calHistory.value.length - 1];
            if(lastChar === "+"
              || lastChar === "-"
              || lastChar === "×"
              || lastChar === "÷" ){
              calHistory.value = calHistory.value.substr(0, calHistory.value.length - 1)
                               + currentSymbol;
            }
          }
          break;
      }
    }
  }



  const squareBtns = document.getElementsByClassName("btn_cal") as HTMLCollectionOf<HTMLElement>;
  for(var index in squareBtns){
    if(squareBtns[index].style){
      squareBtns[index].addEventListener("click", function(e){
        setBtnEvent(e.target);
      });

      if(!squareBtns[index].className.includes("btn_small")){
        squareBtns[index].style.height = document.getElementById("btnNum").offsetWidth + "px";
      } else {
        squareBtns[index].style.height = document.getElementById("symbol1").offsetWidth + "px";
      }
    }
  }
};
