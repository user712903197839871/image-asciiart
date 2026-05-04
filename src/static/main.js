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
        calcFontSetResult(parseInt(formData.get("char_limit")), result)
    } else {
        // default and nothing
        calcFontSetResult(16, "none")
    }


});

document.getElementById('char_limit_slider').addEventListener('input', (e) => {
    const sliderOutput = document.getElementById('char_limit');

    sliderOutput.value = e.target.value;
});

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