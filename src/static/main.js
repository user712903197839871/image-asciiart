document.getElementById('img-ascii').addEventListener('submit', async (e) => {
    e.preventDefault(); // Stop the page from reloading
    
    const formData = new FormData(e.target);
    
    const response = await fetch('/process', {
        method: 'POST',
        body: formData
    });
    
    const result = await response.text();

    // result gotten setting font size accordingly
    let output_box = document.getElementById('output-box');

    // set the default
    output_box.style.fontSize = 16 + "px";
    
    characters_width = parseInt(formData.get("char_limit"));

    let newSize = 1200 / characters_width;

    output_box.style.fontSize = newSize + "px";
    console.log(window.getComputedStyle(output_box).fontSize)
    

    // attribuating the result
    output_box.innerText = result;
});

document.getElementById('char_limit_slider').addEventListener('input', (e) => {
    const sliderOutput = document.getElementById('char_limit');

    sliderOutput.value = e.target.value;
});
