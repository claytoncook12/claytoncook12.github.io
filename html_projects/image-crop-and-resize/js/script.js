const fileInput = document.querySelector(".file-input"),
chooseImgBtn = document.querySelector(".choose-img"),
addImgSvg = document.querySelector("#temp-image"),
imageContainer = document.querySelector(".image-container"),
workingImage = document.getElementById("working-image"),
overlay = document.querySelector(".overlay"),
cropX = document.getElementById("cropX"),
cropXLength = document.getElementById("cropXLength"),
cropY = document.getElementById("cropY"),
cropYLength = document.getElementById("cropYLength");

var workingImageHeight = 0,
workingImageWidth = 0;

const updateWorkingImage = () => {
    workingImageHeight = workingImage.getBoundingClientRect().height;
    workingImageWidth = workingImage.getBoundingClientRect().width;
    defaultOverlayLocation();
    scaleOverlay();
    setImageCropParameters();
    hideAddImgSvg();
}

const defaultOverlayLocation = () => {
    overlay.style.top = "0";
    overlay.style.left = "0";
}

const scaleOverlay = () => {
    // Set Overlay to Image Size
    overlay.style.height = `${workingImageHeight}px`;
    overlay.style.width = `${workingImageWidth}px`;
    overlay.removeAttribute("hidden");
}

const setImageCropParameters = () => {
    cropX.value = 0;
    cropX.max = Math.round(workingImageWidth);
    cropXLength.value = Math.round(workingImageWidth);
    cropXLength.max = Math.round(workingImageWidth);
    
    cropY.value = 0;
    cropY.max = Math.round(workingImageHeight);
    cropYLength.value = Math.round(workingImageHeight);
    cropYLength.max = Math.round(workingImageHeight);
}

const hideAddImgSvg = () => {
    addImgSvg.hidden = true;
}

const cropOutsideWidthBound = () => {
    return ((parseInt(cropX.value) + parseInt(cropXLength.value)) > workingImageWidth)
}

const cropOutsideHeightBound = () => {
    return ((parseInt(cropY.value) + parseInt(cropYLength.value)) > workingImageHeight)
}

cropY.addEventListener("change", (event) => {
    if (cropOutsideHeightBound()) {
        // Update Overlay Height
        overlay.style.top = `${event.target.value}px`;
        const newOverlayHeight = workingImageHeight - event.target.value;
        overlay.style.height = `${newOverlayHeight}px`;
        // Update Crop Y Length
        cropYLength.value = Math.round(workingImageHeight - event.target.value);
    } else {
        // Update Overlay Location
        overlay.style.top = `${event.target.value}px`;
    }
})

cropX.addEventListener("change", (event) => {
    if (cropOutsideWidthBound()) {
        // Update Overlay Width
        overlay.style.left = `${event.target.value}px`;
        const newOverlayWidth = workingImageWidth - event.target.value;
        overlay.style.width = `${newOverlayWidth}px`;
        // Update Crop X Length
        cropXLength.value = Math.round(workingImageWidth - event.target.value);
    } else {
        // Update Overlay Location
        overlay.style.left = `${event.target.value}px`;
    }
})

cropXLength.addEventListener("change", (event) => {
    if (parseInt(cropX.value) > 0) {
        if (cropOutsideWidthBound()) {
            // Update Form Values
            cropXLength.max = cropX.max - parseInt(cropX.value);
            cropXLength.value = (cropX.max - parseInt(cropX.value)).toString();
            showSnackbar("Crop Length Outside Picture Bounds.");
        }
        // Update Overlay
        overlay.style.width = `${cropXLength.value}px`;
    } else {
    overlay.style.width = `${event.target.value}px`;
    }
})

cropYLength.addEventListener("change", (event) => {
    if (parseInt(cropY.value) > 0) {
        if (cropOutsideHeightBound()) {
            // Update Form Values
            cropYLength.max = cropY.max - parseInt(cropY.value);
            cropYLength.value = (cropY.max - parseInt(cropY.value)).toString();
            showSnackbar("Crop Height Outside Picture Bounds.");
        }
        // Update Overlay
        overlay.style.height = `${cropYLength.value}px`;
    } else {
    overlay.style.height = `${event.target.value}px`;
    }
})

const reset = () => {
    defaultOverlayLocation();
    scaleOverlay();
    setImageCropParameters();
}

const loadImage = () => {
    let file = fileInput.files[0];
    if(!file) return;
    workingImage.src = URL.createObjectURL(file);
    workingImage.addEventListener("load", () => {
        imageContainer.removeAttribute("hidden");
        updateWorkingImage();
        imageContainer.style.height = overlay.style.height;
    });
}

const saveCropImage = () => {
    console.log("Saving Crop Image File.");

    // Get Source Image Scale
    scaleFactor =  workingImage.naturalWidth / workingImage.clientWidth;
    
    // Source Image Properties
    sx = parseInt(cropX.value * scaleFactor);
    sy = parseInt(cropY.value * scaleFactor);
    sWidth = parseInt(cropXLength.value * scaleFactor);
    sHeight = parseInt(cropYLength.value * scaleFactor);

    // Destination Canvas
    dx = 0;
    dy = 0;
    dWidth = parseInt(cropXLength.value);
    dHeight = parseInt(cropYLength.value);
    
    // Create New Image
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = dWidth;
    canvas.height = dHeight;
    ctx.drawImage(workingImage, sx, sy, sWidth, sHeight,
        dx, dy, dWidth, dHeight);
    
    // Down Load New Image
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}

// Snack Bar Functions
const showSnackbar = (textString) => {
    const snackbar = document.getElementById("snackbar");
    snackbar.innerHTML = textString;
    snackbar.className = "show";
    setTimeout(function(){ snackbar.className = snackbar.className.replace("show",""); },3000);
}

fileInput.addEventListener("change", loadImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());
addImgSvg.addEventListener("click", () => fileInput.click());