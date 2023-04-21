const submitBtn = document.getElementById("create");
const floor = document.getElementById("floor");
const lift = document.getElementById("lift");
const inputBox = document.getElementById("input");
const building = document.getElementById("building");
const toast = document.getElementById("show-toast");
const closeToastBtn = document.getElementById("close-btn");
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
  let differenceArray = [];

  for(let i  =0; i < lifts.length; i++) {
    differenceArray.push(Math.abs(calledFloor - Number(lifts[i].dataset.liftPos)));
    differenceArray.sort();
    if(differenceArray[0] === Math.abs(calledFloor - Number(lifts[i].dataset.liftPos))) {
        console.log("im working");
    }
  }

  let lift = lifts.find((lift) => lift.dataset.isMoving === "false" && differenceArray[0] === Math.abs(calledFloor - Number(lift.dataset.liftPos)));
  let liftDuration = Math.abs(lift.dataset.liftPos -calledFloor) * 2;

  lift.style.transform = `translateY(${-166 * (calledFloor - 1)}px)`;
  lift.style.transition = `transform ${Math.abs((lift.dataset.liftPos - calledFloor) * 2)}s linear`;
  lift.dataset.isMoving = "true";

  setTimeout(() => {
    liftAnimation(lift);
  }, liftDuration * 1000);

  setTimeout(() => {
    lift.dataset.isMoving = "false";
    lift.dataset.liftPos = calledFloor;
  }, liftDuration * 1000 + 6000)
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

//toast function to display toast
const showToast = () => {
  let isShow = false;

  if(!isShow) {
    isShow = true;
    toast.style.display = "block";
    setTimeout(() => {
      toast.style.display = "none";
      clicked = false;
    }, 2000);
  }
}

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
    showToast()
    //alert("Please enter a valid floor number or lift number (>=1)");
  }

  //we reset the values to default
  lift.value = "";
  floor.value = "";
});

closeToastBtn.addEventListener("click", () => toast.style.display = "none");