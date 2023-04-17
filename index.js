const submitBtn = document.getElementById("create");
const floor = document.getElementById("floor");
const lift = document.getElementById("lift");
const inputBox = document.getElementById("input");
let building = document.getElementById("building");
let calledFloorQueue = [];

//this function is use to create floors in building
const createFloors = (noOfFloors, lastFloor) => {
  //this will be the floor
  let floor = document.createElement("div");
  floor.id = `floor${noOfFloors}`;
  floor.classList.add("floor");

  //this will be the floor name
  let floorName = document.createElement("p");
  floorName.innerText = `Floor ${noOfFloors}`;
  floorName.classList.add("floor-name");

  //this is a button box where we put our lift interaction
  let liftsBtnsBox = document.createElement("div");
  liftsBtnsBox.classList.add("btn-wrapper");

  //this is up button
  let upBtn = document.createElement("button");
  upBtn.innerText = "UP";
  upBtn.classList.add("up-btn");
  upBtn.dataset.floorNo = noOfFloors;

  //this is down button
  let downBtn = document.createElement("button");
  downBtn.innerText = "DOWN";
  downBtn.classList.add("down-btn");
  downBtn.dataset.floorNo = noOfFloors;

  ///logic for lift buttons
  if (noOfFloors === lastFloor) {
    liftsBtnsBox.append(downBtn);
  } else if (noOfFloors === 1) {
    liftsBtnsBox.append(upBtn);
  } else {
    liftsBtnsBox.append(upBtn, downBtn);
  }

  //here we are appending elements into floors
  floor.append(floorName, liftsBtnsBox);

  //here we are appending floors into building
  building.append(floor);
};

//this function is use to create lifts in building
const createLifts = (noOfLifts) => {
  //this is a lift
  let lift = document.createElement("div");
  let door = document.createElement("div"); //lift door

  lift.classList.add("lift");
  door.classList.add("door");
  lift.dataset.liftPos = 1;
  lift.dataset.liftNo = noOfLifts;
  lift.dataset.isMoving = false;

  lift.style.left = ``;

  lift.appendChild(door); //added door inside lift

  //here we are appending ift on ground floor
  let firstFloor = document.getElementById("floor1");
  firstFloor.append(lift);
};

//we are adding this event to know that you are clicking on button of which floor
addEventListener("click", (e) => {
  if (
    e.target.classList.contains("up-btn") ||
    e.target.classList.contains("down-btn")
  ) {
    console.log(`Call lift on ${e.target.dataset.floorNo} floor`);
    calledFloorQueue.push(Number(e.target.dataset.floorNo));
    //moveLift(Number(e.target.dataset.floorNo));
    console.log(calledFloorQueue);
  }
});

//it will check there is any availablelift
const checkAvailableLift = () => {
  let lifts = Array.from(document.querySelectorAll(".lift"));
  let availableLift = lifts.find((lift) => lift.dataset.isMoving === "false");

  if (availableLift) {
    return true;
  } else {
    return false;
  }
};

//it will check the array
const checkQueue = () => {
  //console.log("inside fn", calledFloorQueue)
  if (calledFloorQueue.length === 0) {
    return;
  } else {
    let calledFloor = calledFloorQueue[0];
    for (let i = calledFloorQueue.length; i > 0; i--) {
      if (checkAvailableLift()) {
        moveLift(calledFloor);
        calledFloorQueue.shift();
      } else {
        return;
      }
    }
  }
};

setInterval(checkQueue, 200);

const moveLift = (calledFloor) => {
  //this will move our lift on up or down based on calculation
  // console.log(`${-166 * (calledFloor - 1)}`);

  let lifts = Array.from(document.querySelectorAll(".lift"));
  let availableLift = lifts.find((lift) => lift.dataset.isMoving === "false");
  let closestLift = lifts.find(
    (lift) =>
      lift.dataset.isMoving === "false" &&
      Number(lift.dataset.liftPos - calledFloor) <= calledFloor
  );
  console.log(closestLift);

  let closestLiftDuration = Math.abs(
    (closestLift.dataset.liftPos - calledFloor) * 2
  );

  closestLift.style.transition = `transform ${Math.abs(
    (closestLift.dataset.liftPos - calledFloor) * 2
  )}s linear`;
  closestLift.style.transform = `translateY(${-166 * (calledFloor - 1)}px)`;
  closestLift.dataset.isMoving = true;

  setTimeout(() => {
    liftAnimation(closestLift);
  }, closestLiftDuration * 1000);

  setTimeout(() => {
    closestLift.dataset.isMoving = false;
    closestLift.dataset.liftPos = calledFloor;
  }, closestLiftDuration * 1000 + 5000);

  //this condition is used to check if the closest lift is also busy then call the available lift on the floor
  // if (closestLift === undefined) {
  //     //it will give  you transition duration for available lift
  // let availableLiftDuration = Math.abs((availableLift.dataset.liftPos - calledFloor) * 2);

  //   availableLift.style.transition = `transform ${availableLiftDuration}s linear`;
  //   availableLift.style.transform = `translateY(${-166 * (calledFloor - 1)}px)`;
  //   availableLift.dataset.isMoving = true;

  //   setTimeout(() => {
  //     liftAnimation(availableLift);
  //   }, availableLiftDuration * 1000);

  //   setTimeout(() => {
  //     availableLift.dataset.isMoving = false;
  //     availableLift.dataset.liftPos = calledFloor;
  //   }, availableLiftDuration * 1000 + 5000);
  // } else {
  //   //it will give  you transition duration for closest lift
  //   let closestLiftDuration = Math.abs((closestLift.dataset.liftPos - calledFloor) * 2)

  //   closestLift.style.transition = `transform ${Math.abs((closestLift.dataset.liftPos - calledFloor) * 2)}s linear`;
  //   closestLift.style.transform = `translateY(${-166 * (calledFloor - 1)}px)`;
  //   closestLift.dataset.isMoving = true;

  //   setTimeout(() => {
  //     liftAnimation(closestLift);
  //   }, closestLiftDuration * 1000);

  //   setTimeout(() => {
  //     closestLift.dataset.isMoving = false;
  //     closestLift.dataset.liftPos = calledFloor;
  //   }, closestLiftDuration * 1000 + 5000);
  // }
};

const liftAnimation = (targetedLift) => {
  //used children cause want to access the door div which is indside of lift
  let targetedLiftDoor = targetedLift.children;

  //to open door
  setTimeout(() => {
    //targetedLift.style.animation = 'openTheDoor 2.5s linear';
    targetedLiftDoor[0].style.animation = "openTheDoor 2.5s linear";
  }, 500);

  //to close door
  setTimeout(() => {
    //targetedLift.style.animation = `closeTheDoor 2.5s linear`;
    targetedLiftDoor[0].style.animation = `closeTheDoor 2.5s linear`;
  }, 3000);

  //to remove animation
  setTimeout(() => {
    //targetedLift.style.animation = "";
    targetedLiftDoor[0].style.animation = "";
  }, 5500);
};

submitBtn.addEventListener("click", () => {
  const lifts = Number(lift.value);
  const floors = Number(floor.value);

  if (lifts > 0 && floors > 0) {
    inputBox.style.display = "none";
    //this loop is use to call function and create floors
    for (let i = floors; i > 0; i--) {
      createFloors(i, floors);
    }

    //this loop is use to call function and create lifts
    for (let i = 0; i < lifts; i++) {
      createLifts(i);
    }
  } else {
    alert("Please enter a valid floor number or lift number (>=1)");
  }

  //we reset the values to default
  lift.value = "";
  floor.value = "";
});