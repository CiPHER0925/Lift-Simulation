const submitBtn = document.getElementById("create");
const floor = document.getElementById("floor");
const lift = document.getElementById("lift");
let building = document.getElementById("building");


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
    upBtn.innerText = "UP"
    upBtn.classList.add("up-btn");
    upBtn.dataset.floorNo = noOfFloors;

    //this is down button
    let downBtn = document.createElement("button");
    downBtn.innerText = "DOWN";
    downBtn.classList.add("down-btn");
    downBtn.dataset.floorNo = noOfFloors;

    ///logic for lift buttons 
    if(noOfFloors === lastFloor) {
        liftsBtnsBox.append(downBtn)
    } else if(noOfFloors === 1) {
        liftsBtnsBox.append(upBtn)
    } else {
        liftsBtnsBox.append(upBtn, downBtn)
    }

    //here we are appending elements into floors
    floor.append(floorName, liftsBtnsBox);

    //here we are appending floors into building
    building.append(floor);
}

//this function is use to create lifts in building
const createLifts = (noOfLifts) => {
    //this is a lift
    let lift = document.createElement("div");
    lift.classList.add("lift");
    lift.dataset.liftNo = noOfLifts;
    lift.dataset.isMoving = false;

    //here we are appending ift on ground floor
    let firstFloor = document.getElementById("floor1");
    firstFloor.append(lift);
}


submitBtn.addEventListener("click", () => {
    const lifts = Number(lift.value);
    const floors = Number(floor.value);
    
    //this loop is use to call function and create floors
    for(let i = floors; i > 0; i--) {
        createFloors(i, floors)
    }

    //this loop is use to call function and create lifts
    for(let i = 0; i < lifts; i++) {
        createLifts(i);
    }

    //we reset the values to default
    lift.value = "";
    floor.value = "";
})




