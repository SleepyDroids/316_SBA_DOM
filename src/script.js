// Jacqueline LaFontaine
// 316 SBA for the Documnet Object Model

/*
GOAL OF THIS PROJECT:
Create a clickable D20 die that gives a random die number on each click and also
changes color. Will consider adding some sort of animation and/or 
sound after it functions. Maybe also a space to contain the output of previous
die roll values (up to 5). 

I want to practice manipulating the DOM using things like frags and templates in
the hopes I can make the information stick. Could have the frag deploy the die. Or
have a frag set up for future dice. ie. roll for advantage or disadvantage

Things I know I will need:
1. Div container for the die aka a dice bag
2. Button for user to click on to roll said dice
3. A visible number value/counter (probably text over where a die would be)
4. A second div to mimic the die (maybe I can find a free to use image/transparent png)

Probably.textContent to clear on the die div itself

5. Math.floor((math.random() * 20) + 1) to randomize the dice roll
6. Clicking outside of the die shouldn't trigger the die roll

Order in which the D20 roll should function: 
1. Starts at 0
2. On button click it changes to a random value
3. Stores that random value as previous rolls
4. Clicking on it again rolls and stores a random value up to 5 times
5. Find a way to make it user cannot click on it anymore after storing 5 values
6. Reset button to wipe the stored values and reset the die to 0

EVENTUALLY: 
1. Add a functionality that considers roll with advantage or disadvantage (toggle?)
2. Add more dice types/color options
3. Also indicates on previous dice rolls whether or not the roll was done with advantage or disadvantage
*/

// Can use this function to roll a d20 and also in the case of advantage
// use logic to use only the higher roll
// set up variables that only log the lowest numer
// maybe pushing both vaules into an array
// and then only return the lowest or highest roll
// depending if rolling with advantage or disadvantage
// as in if this number is higher than lowerInteger, return higherInteger

const diceRolls = []; // array to store up to 10 previous dice rolls
let initialRoll = 0; // initialized at 0
let isAdvantage = false; // start off false
let isDisadvantage = false; // start off false
let advantageRolls = []; // array to hold the two advantage rolls - takes the highest value - could also account for rolling a nat 20
let disadvantageRolls = []; // array to hold the two advantage rolls - takes the lowest value - also needs to account for rolling a nat 1

const rollBtn = document.getElementById("roll_btn");
const diceBag = document.getElementById("dice_bag");
const bodyEl = document.querySelector("body");
const addDiv = document.createElement("div");

bodyEl.prepend(document.createElement("h1"));
bodyEl.firstChild.id = "title_text";

const titleText = document.querySelector("#title_text");
titleText.textContent = "Roll for initiative!";
// use input elements to allow user to put their
// character name and class
// so like "Bob the rogue has rolled."
// so an input for name of character and an input for character class

bodyEl.style.backgroundColor = "var(--magenta)";
diceBag.style.border = "2px solid var(--black)";
diceBag.style.display = "grid";
diceBag.style.placeContent = "center";
// diceBag.style.display = "flex";
// diceBag.style.justifyContent = "center";
// diceBag.style.alignItems = "center";
// diceBag.style.flexFlow = "column wrap";

diceBag.prepend(addDiv);
diceBag.firstElementChild.setAttribute("id", "deeTwenty");

const d20 = document.getElementById("deeTwenty");
d20.appendChild(document.createElement("h1"));
d20.firstChild.textContent = 0;

d20.style.backgroundImage = "url(./src/dice-svg.svg)";
d20.style.border = "1px solid var(--white)";
d20.style.width = "165px";
d20.style.height = "165px";
d20.style.margin = "25px";
d20.style.display = "flex";
d20.style.justifyContent = "center";
d20.style.alignItems = "center";
d20.style.flexFlow = "column wrap";

const visibleNum = d20.firstChild;

// Creating additional buttons for more functionality
const addBtn = document.createElement("button");

diceBag.appendChild(addBtn);
diceBag.lastChild.innerText = "Roll with Advantage";

diceBag.appendChild(document.createElement("button"));
diceBag.lastChild.innerText = "Roll with Disadvantage";

diceBag.appendChild(document.createElement("button"));
diceBag.lastChild.innerText = "Reset";

// selects the reset button as the 5th child inside of the dice_bag parent element
document.querySelector("#dice_bag :nth-child(5)").id = "resetBtn";
document.querySelector("#dice_bag :nth-child(4)").id = "disadvantageBtn";
document.querySelector("#dice_bag :nth-child(3)").id = "advantageBtn";

// adding IDs to the new buttons to be able to easily attach an event listener to each button
const disadvantageBtn = document.getElementById("disadvantageBtn");
const advantageBtn = document.getElementById("advantageBtn");
const resetBtn = document.getElementById("resetBtn");

// DOCUMENT FRAGMENT ********************************************************************************************************

// first I am going to set up a div to house the dice rolls I wish to keep
bodyEl.appendChild(document.createElement("div"));
bodyEl.lastChild.id = "roll_log";
const rollLog = document.querySelector("#roll_log");
rollLog.appendChild(document.createElement("ul"));
rollLog.firstChild.id = "ul_list";

const ulList = document.querySelector("#ul_list");

rollLog.style.width = "300px";
rollLog.style.height = "200px";
rollLog.style.border = "1px solid red";
rollLog.style.display = "grid";
rollLog.style.placeContent = "center";
// rollLog.style.alignContet = "center";
rollLog.style.padding = ".15px";

// creating the document fragment
const docFrag = document.createDocumentFragment();

// EVENT LISTENERS ********************************************************************************************************
rollBtn.addEventListener("click", () => {
  const diceSound = new Audio("./src/dice-roll-sound.mp3");
  diceSound.play();
  const rollItem = document.createElement("li");
  rollItem.classList.add("roll_item");
  // timeout set to 1 sec, so that the full audio plays (its duration is 1 sec)
  // before the die value is displayed
  // so it's like the user rolled first and THEN you see your dice roll
  d20.classList.toggle("shake_animation");

  setTimeout(function () {
    d20.firstChild.textContent = `${rollDie()}`;
    d20.classList.remove("shake_animation");
    rollItem.textContent = d20.firstChild.textContent;
    docFrag.appendChild(rollItem);
    ulList.appendChild(docFrag);
  }, 1000);
}); // end of normal D20 roll event handler

advantageBtn.addEventListener("click", () => {
  const diceSound = new Audio("./src/dice-roll-sound.mp3");
  diceSound.play();
  const rollItem = document.createElement("li");
  rollItem.classList.add("roll_item");
  d20.classList.toggle("shake_animation");
  setTimeout(function () {
    d20.firstChild.textContent = `${rollAdvantage()}`;
    d20.classList.remove("shake_animation");
    rollItem.textContent = d20.firstChild.textContent;
    docFrag.appendChild(rollItem);
    ulList.appendChild(docFrag);
  }, 1000);
}); // end of advantage D20 roll event handler

disadvantageBtn.addEventListener("click", () => {
  const diceSound = new Audio("./src/dice-roll-sound.mp3");
  diceSound.play();
  const rollItem = document.createElement("li");
  rollItem.classList.add("roll_item");
  d20.classList.toggle("shake_animation");
  setTimeout(function () {
    d20.firstChild.textContent = `${rollDisadvantage()}`;
    d20.classList.remove("shake_animation");
    rollItem.textContent = d20.firstChild.textContent;
    docFrag.appendChild(rollItem);
    ulList.appendChild(docFrag);
  }, 1000);
}); // end of advantage D20 roll event handler

resetBtn.addEventListener("click", () => {
  // refreshes the page / returns to the default value of zero
  window.location.reload();
}); // end of reset button event handler

// FUNCTIONS ********************************************************************************************************
function rollDie() {
  const randomNum = Math.floor(Math.random() * 20 + 1); // traditional d20 range of 1-20
  if (randomNum === 20) {
    console.log("Congratulations! You got a critical roll!");
  } else if (randomNum === 1) {
    console.log("You unfortunately rolled a nat 1. Critical failure.");
  }
  return randomNum;
}

// START OF ROLL WITH ADVANTAGE FUNCTION *********************
function rollAdvantage() {
  advantageRolls = [];
  let roll1;
  let roll2;

  roll1 = rollDie();
  roll2 = rollDie();
  let diceTray = 0;

  // push the two rolls into the array
  advantageRolls.push(roll1, roll2);
  console.log(advantageRolls); // showing me the two rolls my rollDie() function produced

  for (let i = 0; i < advantageRolls.length; i++) {
    // Updated: ultimately didn't need this additional logic to make this function work
    // not quite clear while I added it initially but we're learning! 🧠
    // if (advantageRolls[i] >= 1) {
    //   // console.log(`${advantageRolls[i]} is greater than 1`);
    // }

    // if (advantageRolls[i] <= 20) {
    //   // console.log(`${advantageRolls[i]} is less than 20`);
    //   // advantageRolls.push(advantageRolls[i]); - gave me an infinite loop, since I was always adding to the advantageRolls.length value so it always remained true
    // }

    // this is the key logic I was missing, thank you for the help Quinn!
    // the first roll will also beat the value of 0 so that first roll becomes the new
    // dice tray roll and ONLY gets replaced if the second roll is higher
    // basically: roll1 is always higher than zero, but checks to see if roll2 is higher (as the for loop is iterating over the dice tray)
    // and if it is - it boots out the first roll and replace it in the diceTray variable
    // so when I return diceTray OUTSIDE of the loop, it is returning the highest value
    if (advantageRolls[i] > diceTray) {
      diceTray = advantageRolls[i];
    }
  }

  return diceTray;
} // end of rollAdvantage function

// START OF ROLL WITH DISADVANTAGE FUNCTION *********************
function rollDisadvantage() {
  disadvantageRolls = [];
  let roll1;
  let roll2;

  roll1 = rollDie();
  roll2 = rollDie();
  let diceTray = 21; // now needs to be the inverse of my rollAdvantage function

  // push the two rolls into the array
  disadvantageRolls.push(roll1, roll2);
  console.log(disadvantageRolls);

  for (let i = 0; i < disadvantageRolls.length; i++) {
    if (disadvantageRolls[i] < diceTray) {
      // inverse of my rollAdvantage function
      diceTray = disadvantageRolls[i];
    }
  }

  return diceTray;
} // end of rollDisadvantage function
