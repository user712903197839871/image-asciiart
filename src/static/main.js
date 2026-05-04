// if you ever wonder wth is choose, choosing mode, it is how we choose character limit size, either through a slider or buttons


// could be read from a .env btw
const CHOOSE_SLIDER_MODE_PROMPT = "you feel loose today? wanna slide?";
const CHOOSE_SLIDER_MODE_BUTTON_TEXT = "yes i am loose";

const CHOOSE_BUTTONS_MODE_PROMPT = "is too painfull? go back to a easier mode?";
const CHOOSE_BUTTONS_MODE_BUTTON_TEXT = "yes please";

const changeCharChooseModeButton = document.getElementById('toggle-char-choose-mode');
const changeCharChooseModeLabel = document.getElementById('toggle-char-choose-mode-label');

const CHOOSE_MODE_SLIDER_CONTAINER = document.getElementById('choose-mode-slider');
const CHOOSE_MODE_BUTTONS_CONTAINER = document.getElementById('choose-mode-buttons');

// buttons|slider
let currentChoosingMode = "buttons";


document.getElementById('img-ascii').addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop the page from reloading
    
    const formData = new FormData(e.target);
    
    const response = await fetch('/process', {
        method: 'POST',
        body: formData
    });
    
    const result = await response.text();

    // separate the body from header, process header
    // alternatively i could import a function, 5 mins of getting used to it and it's done, but i like reinventing the wheel
    gotNoErrors = processResult(result);


    if (gotNoErrors) {
        // do some cheeky calculations
        calcFontSetResult(parseInt(formData.get("char-limit")), result)
    } else {
        // default and nothing
        calcFontSetResult(16, "none")
    }


});

document.getElementById('char-limit-slider').addEventListener('input', (e) => {
    const sliderOutput = document.getElementById('char-limit');

    sliderOutput.value = e.target.value;
});

document.getElementById('char-limit-buttons').addEventListener('click', (e) => {
    if (e.target.tagName === "BUTTON") {
        document.getElementById('char-limit').value = e.target.textContent;
    }
});

document.getElementById('toggle-char-choose-mode').addEventListener('click', (e) => {
    toggleChoosingMode();
});

function init() {

    changeCharChooseModeLabel.textContent = CHOOSE_SLIDER_MODE_PROMPT;
    changeCharChooseModeButton.textContent = CHOOSE_SLIDER_MODE_BUTTON_TEXT;

    
    CHOOSE_MODE_BUTTONS_CONTAINER.style.display = "block";
    CHOOSE_MODE_SLIDER_CONTAINER.style.display = "none";

}

// ====================================================================
// 
//   helpers
// 
// ====================================================================

// basically checks for the header and sends what kind of popup we need to show, or modify other shit, or shit hit the fan
// returns wether it went ok or not
function processResult(responseString) {
    responseStatus = "";
    for (let i = 1; i < responseString.length; i++) {
        if (responseString[i] === "]") {
            break;
        } else {
            responseStatus += responseString[i];
        }
        
    }

    if (responseStatus === "SUCCESS") {
        // get a p and add it time of success
        // 3 for [] and a space
        operationTime = ""
        // 18 is characters of message + 3 characters of time
        for (let i = responseStatus.length+3; i < responseString.length && i < responseStatus.length+18; i++) {
            if (responseString[i] === "\n") {
                break;
            } else {
                operationTime += responseString[i]
            }
        }

        document.getElementById("art-status").textContent = responseString.length + " characters " + operationTime + "s";

        return true

    } else if (responseStatus === "FAIL") {
        // spank the user
        failMessage = ""
        for (let i = responseStatus.length+3; i < responseString.length; i++) {
            if (responseString[i] === "\n") {
                break;
            } else {
                failMessage += responseString[i]
            }
        }

        alert(failMessage)

        return false

    } else if (responseStatus === "ERROR") {
        alert("something went wrong")

        return false
    } else if (responseStatus === "WARNING") {
        // user tried something, or something happened, though we handled it

        return true
    }
}

function calcFontSetResult(charLimit, result) {
    // result gotten setting font size accordingly
    let output_box = document.getElementById('output-box');
    
    // set the default
    output_box.style.fontSize = 16 + "px";

    console.log(result === "none");
    if (result === "none") {
        output_box.innerText = "output here...";
        return;
    }
    
    characters_width = charLimit;

    let newSize = 1200 / characters_width;

    output_box.style.fontSize = newSize + "px";

    resultText = result.split("//split")[1]
    

    // attribuating the result
    output_box.innerText = resultText;
}

function toggleChoosingMode() {
    if (currentChoosingMode === "buttons") {
        currentChoosingMode = "slider";
        CHOOSE_MODE_SLIDER_CONTAINER.style.display = "block";
        CHOOSE_MODE_BUTTONS_CONTAINER.style.display = "none";
        
        changeCharChooseModeLabel.textContent = CHOOSE_BUTTONS_MODE_PROMPT;
        changeCharChooseModeButton.textContent = CHOOSE_BUTTONS_MODE_BUTTON_TEXT;
    } else {
        currentChoosingMode = "buttons";

        CHOOSE_MODE_BUTTONS_CONTAINER.style.display = "block";
        CHOOSE_MODE_SLIDER_CONTAINER.style.display = "none";

        changeCharChooseModeLabel.textContent = CHOOSE_SLIDER_MODE_PROMPT;
        changeCharChooseModeButton.textContent = CHOOSE_SLIDER_MODE_BUTTON_TEXT;
    }
}


// initialize stuff that must be initialized
init();
