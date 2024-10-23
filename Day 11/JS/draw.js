const canvasBoard = document.querySelector("canvas");
// getcontext() method returns a drawing context on the canvas
const canvasSheet = canvasBoard.getContext("2d");
const tools = document.querySelectorAll(".tool");
const toolActive = document.querySelector(".options .active");
const fillColor = document.querySelector(".fill-color");
const size = document.querySelector(".sizeRadius");
const colorpicker = document.querySelector(".color-picker");
const eraserBtn = document.querySelector("#eraser-tool");
const clearBtn = document.querySelector(".clear");
const clearicon = document.querySelector(".clear-icon")
const saveBtn = document.querySelector(".save");
let fillinpute = document.querySelector(".fill-color2");
let fillbox = document.querySelector(".fillbox");

// global variables
let prevMouseX, prevMouseY, snapshot, drawTool = "brush", brushWidth = 5, draw = false;

// after saving background is white
const background = () => {
    canvasSheet.fillStyle = "#fff";
    canvasSheet.fillRect(0, 0, canvasSheet.canvas.width, canvasSheet.canvas.height);
    canvasSheet.fillStyle = "#000";
}

// load event
window.addEventListener("load", function () {
    // returns width/height
    canvasBoard.width = canvasBoard.offsetWidth;
    canvasBoard.height = canvasBoard.offsetHeight;
    background();
    saveBtn.disabled = true;
})

// change cursor 
const setCursor = () => {
    if (drawTool == "rectangle-tool" || drawTool == "circle-tool" || drawTool == "triangle-tool") {
        canvasBoard.style.cursor = "crosshair";
    }
    else if (drawTool == "eraser-tool") {
        canvasBoard.style.cursor = `url(./images/square1.png), auto`;
    }
    else if (drawTool == "brush-tool") {
        canvasBoard.style.cursor = `url(./images/icon-brush.png), auto`;
    }
    else {
        canvasBoard.style.cursor = "auto";
    }
}


let fillShapes = false; // Add this global flag

fillbox.addEventListener("click", (e) => {
    if (!fillinpute.checked) {
        fillbox.style.color = "";
        fillShapes = false; // Update the fillShapes flag
    } else {
        fillbox.style.color = "#6dd400a3";
        fillShapes = true; // Update the fillShapes flag
    }
});

const drawRectangle = (e) => {
    const x = e.clientX - canvasBoard.getBoundingClientRect().left;
    const y = e.clientY - canvasBoard.getBoundingClientRect().top;

    if (fillShapes) {
        canvasSheet.fillRect(
            Math.min(prevMouseX, x),
            Math.min(prevMouseY, y),
            Math.abs(x - prevMouseX),
            Math.abs(y - prevMouseY)
        );
    } else {
        canvasSheet.strokeRect(
            Math.min(prevMouseX, x),
            Math.min(prevMouseY, y),
            Math.abs(x - prevMouseX),
            Math.abs(y - prevMouseY)
        );
    }
};

const drawCircle = (e) => {
    const x = e.clientX - canvasBoard.getBoundingClientRect().left;
    const y = e.clientY - canvasBoard.getBoundingClientRect().top;

    canvasSheet.beginPath();
    let radius = Math.sqrt(Math.pow((prevMouseX - x), 2) + Math.pow((prevMouseY - y), 2));

    canvasSheet.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);

    if (fillShapes) {
        canvasSheet.fill();
    } else {
        canvasSheet.stroke();
    }
};

const drawTriangle = (e) => {
    const x = e.clientX - canvasBoard.getBoundingClientRect().left;
    const y = e.clientY - canvasBoard.getBoundingClientRect().top;

    canvasSheet.beginPath();
    canvasSheet.moveTo(prevMouseX, prevMouseY);
    canvasSheet.lineTo(x, y);
    canvasSheet.lineTo(prevMouseX * 2 - x, y);
    canvasSheet.closePath();

    if (fillShapes) {
        canvasSheet.fill();
    } else {
        canvasSheet.stroke();
    }
};


const drawing = (e) => {
    if (!draw) return;  // if draw is false return
    const touch = e.touches ? e.touches[0] : e;
    canvasSheet.putImageData(snapshot, 0, 0);    // add copy canvas data on to this canvas
    if (drawTool === "eraser-tool") {   // if draw tool is eraser then strokeStyle is white 
        canvasSheet.strokeStyle = "white";
    } else {
        canvasSheet.strokeStyle = colorpicker.value;
    }
    if (drawTool === "brush" || drawTool === "eraser-tool") {
        canvasSheet.lineTo(touch.clientX - canvasBoard.getBoundingClientRect().left, touch.clientY - canvasBoard.getBoundingClientRect().top);  // creates a new line
        canvasSheet.stroke();   // draw/fill line with color
    } else if (drawTool === "brush-tool") {
        canvasSheet.lineTo(touch.clientX - canvasBoard.getBoundingClientRect().left, touch.clientY - canvasBoard.getBoundingClientRect().top);
        canvasSheet.stroke();
    } else if (drawTool === "rectangle-tool") {
        drawRectangle(touch);
    } else if (drawTool === "circle-tool") {
        drawCircle(touch);
    } else if (drawTool === "triangle-tool") {
        drawTriangle(touch);
    }

    setCursor()  // call setCursor function

    if (draw) {     // Enable save button when drawing
        saveBtn.disabled = false;

    }
}

const startdrawing = (e) => {
    draw = true;
    const touch = e.touches ? e.touches[0] : e;
    // pass current mouseX position as prevMouseX value
    prevMouseX = touch.clientX - canvasBoard.getBoundingClientRect().left;
    // pass current mouseY position as prevMouseY value
    prevMouseY = touch.clientY - canvasBoard.getBoundingClientRect().top;
    // create new path to draw
    canvasSheet.beginPath();
    // brushWidth equal to lineWidth
    canvasSheet.lineWidth = brushWidth;
    // copy canvasBoard data & pass as snapshot value
    snapshot = canvasSheet.getImageData(0, 0, canvasBoard.width, canvasBoard.height);
    setCursor();
}

const drawingup = () => {
    draw = false;
}

// Radius
const changeSize = () => {
    brushWidth = size.value; // pass range value as brushSize
}

// color input
const colorPicker = () => {
    canvasSheet.strokeStyle = colorpicker.value;
    canvasSheet.fillStyle = colorpicker.value;
}

//clear button
const clear = () => {
    canvasSheet.clearRect(0, 0, canvasBoard.width, canvasBoard.height); //clear whole canvas
    background();
}

// save button
const save = () => {
    const link = document.createElement("a");  // create <a> element
    link.download = `${Date.now()}.jpg`;  // pass current date as link download value
    link.href = canvasBoard.toDataURL();  // pass canvas data as link href value
    link.click();     // click link to download
    let changtext=document.querySelector(".mytext")
    changtext.innerHTML="Saved!"
    setTimeout(()=>{

        changtext.innerHTML="Save"

    }, 2000)
}

let activeTool = null;
tools.forEach(function (toolbtn) {
    toolbtn.addEventListener('click', function () {
        const isActive = toolbtn.classList.toggle("active");
        drawTool = toolbtn.id;

        const svgIcon = toolbtn.querySelector('.draw-icons');
        const spanText = toolbtn.querySelector('span');

        if (isActive) {
            svgIcon.style.color = '#6dd400a3';
            spanText.style.color = '#6dd400a3';
        } else {
            svgIcon.style.color = '';
            spanText.style.color = '';
        }

        if (activeTool && activeTool !== toolbtn) {
            activeTool.classList.remove("active");
            const activeSvgIcon = activeTool.querySelector('.draw-icons');
            const activeSpanText = activeTool.querySelector('span');
            activeSvgIcon.style.color = ''; // revert to default color
            activeSpanText.style.color = ''; // revert to default color
        }

        activeTool = isActive ? toolbtn : null;
        setCursor();
    });
});



// events
saveBtn.addEventListener("click", save);
clearBtn.addEventListener("click", clear);
colorpicker.addEventListener("change", colorPicker);
size.addEventListener("change", changeSize);
canvasBoard.addEventListener("mousemove", drawing);
canvasBoard.addEventListener("mousedown", startdrawing);
canvasBoard.addEventListener("mouseup", drawingup);


// for mobile devices
canvasBoard.addEventListener("touchmove", function (e) {
    e.preventDefault();
    drawing(e.touches[0]);
    if (draw) {   // Enable save button when drawing on mobile devices
        saveBtn.disabled = false;
    }
});

canvasBoard.addEventListener("touchstart", function (e) {
    e.preventDefault();
    startdrawing(e.touches[0]);
});

canvasBoard.addEventListener("touchend", function (e) {
    e.preventDefault();
    drawingup();
});



