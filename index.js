const submitBtn = document.getElementById("create");
const floor = document.getElementById("floor");
const lift = document.getElementById("lift");
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
        calledFloorQueue.shift();
        moveLift(calledFloor);
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

  //this condition is used to check if the closest lift is also busy then call the available lift on the floor
  if (closestLift === undefined) {
    availableLift.style.transition = `transform ${calledFloor}s linear`;
    availableLift.style.transform = `translateY(${-166 * (calledFloor - 1)}px)`;
    availableLift.dataset.isMoving = true;

    setTimeout(() => {
      liftAnimation(availableLift);
    }, calledFloor * 2000);

    setTimeout(() => {
      availableLift.dataset.isMoving = false;
      availableLift.dataset.liftPos = calledFloor;
    }, calledFloor * 2000 + 5000);
  } else {
    closestLift.style.transition = `transform ${calledFloor}s linear`;
    closestLift.style.transform = `translateY(${-166 * (calledFloor - 1)}px)`;
    closestLift.dataset.isMoving = true;

    setTimeout(() => {
      liftAnimation(closestLift);
    }, calledFloor * 2000);

    setTimeout(() => {
      closestLift.dataset.isMoving = false;
      closestLift.dataset.liftPos = calledFloor;
    }, calledFloor * 2000 + 5000);
  }
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
  }, 1500);

  //to remove animation
  setTimeout(() => {
    //targetedLift.style.animation = "";
    targetedLiftDoor[0].style.animation = "";
  }, 3500);
};

submitBtn.addEventListener("click", () => {
  const lifts = Number(lift.value);
  const floors = Number(floor.value);

  //this loop is use to call function and create floors
  for (let i = floors; i > 0; i--) {
    createFloors(i, floors);
  }

  //this loop is use to call function and create lifts
  for (let i = 0; i < lifts; i++) {
    createLifts(i);
  }

  //we reset the values to default
  lift.value = "";
  floor.value = "";
});
