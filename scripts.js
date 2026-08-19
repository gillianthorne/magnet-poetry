// import { html2canvas } from "./html2canvas.js";

const app = document.querySelector("#app");
const saveBtn = document.querySelector("#save-btn")

// import text list
// same thing as an api call but with a local json file
async function loadWordList() {
    const response = await fetch("./words.json");
    const data = await response.json();
    const wordList = data["words"];

    // shuffle the list so the words are randomized, then take the first 90
    shuffle(wordList);
    return wordList.splice(0, 90);
}

// scatters all words
// NO LONGER USED
function scatterWords(words) {
    // for every word
    words.forEach(word => {
        // x can be anywhere between 50 px from the left and 50px from the right, y can be anywhere from 50px from the top and 70px from the bottom (accounts for height)
        var newX = Math.floor(Math.random() * (window.innerWidth - 100)) + 50;
        var newY = Math.floor(Math.random() * (window.innerHeight - 120)) + 50;

        // while the new x is within 300px of the midpoint (600px wide blank canvas), redo the math (400 on the left because we're checking the leftmost point)
        while (newX > ((window.innerWidth / 2) - 400) && (newX < (window.innerWidth / 2) + 300)) {
            newX = Math.floor(Math.random() * (window.innerWidth - 100)) + 10;
        }

        // the xPos and yPos aren't super important, they just make it easier to give the words a space, this is the only time they're used
        word["xPos"] = newX;
        word["yPos"] = newY;
})
}

// this makes the words nice and into columns
function organizeWords(words) {
    // divide into four subsets
    const subset1 = words.slice(0, 15);
    const subset2 = words.slice(15, 30);
    const subset3 = words.slice(30, 45);
    const subset4 = words.slice(45, 60);
    const subset5 = words.slice(60, 75);
    const subset6 = words.slice(75, 90);

    // for each subset we set a fixed xPos (column) and then a dynamic yPos based on how far down the list it is
    subset1.forEach((word, index) => {
        word["xPos"] = 20;
        word["yPos"] = 20 + 50 * index;
    })

    subset2.forEach((word, index) => {
        word["xPos"] = 200;
        word["yPos"] = 20 + 50 * index;
    })

    subset3.forEach((word, index) => {
        word["xPos"] = 380;
        word["yPos"] = 20 + 50 * index;
    })

    subset4.forEach((word, index) => {
        word["xPos"] = (window.innerWidth / 2) + 400;
        word["yPos"] = 20 + 50 * index;
    })

    subset5.forEach((word, index) => {
        word["xPos"] = (window.innerWidth / 2) + 580;
        word["yPos"] = 20 + 50 * index;
    })

    subset6.forEach((word, index) => {
        word["xPos"] = (window.innerWidth / 2) + 760;
        word["yPos"] = 20 + 50 * index;
    })
}

// Source - https://stackoverflow.com/a/2450976
// Posted by ChristopheD, modified by community. See post 'Timeline' for change history
// Retrieved 2026-08-15, License - CC BY-SA 4.0

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

// https://stackoverflow.com/a/51478809
function saveAs(uri, fileName) {
    var link = document.createElement("a");

    if (typeof link.download === "string") {
        link.href = uri;
        link.download = fileName;

        // firefox requires the link to be in the body
        document.body.appendChild(link);
        
        // simulate clicking the link
        link.click();

        // and now we remove the link from te body
        document.body.removeChild(link);
    } else {
        window.open(uri);
    }
}

function setColour() {
    const colours = ["#F2B705", "#F2789F", "#6EC6E0", "#F2884B"];

    const index = Math.floor(Math.random() * 4);
    return colours[index];
}

async function main() {
    // set a variable for the word list
    const allWords = await loadWordList();
    // there is no currently selected word
    var activeWord = null;

    // initialize offset variables
    var offsetX, offsetY;

    // scatter the words throughout allowed space on the screen
    organizeWords(allWords);

     // iterate through the word list and add each one to the screen
    allWords.forEach(word => {
        // create the word element and set all initialized properties, then add it to the page
        const wordElement = document.createElement("span");
        wordElement.textContent = word["word"];
        wordElement.classList.add("word");
        wordElement.id = word["id"];
        wordElement.style.left = word["xPos"] + "px";
        wordElement.style.top = word["yPos"] + "px";
        wordElement.style.backgroundColor = setColour();
        app.appendChild(wordElement);

        // each word element needs to listen for mousedown
        wordElement.addEventListener("mousedown", (e) => {
            // active word and the change in x/y
            activeWord = wordElement;
            // offsetX = mouse's x position - wordelement's leftmost x position: basically just makes sure the block ends at the exact right location
            // and doesn't shift left or right because the mouse doesn't pick it up at exactly (0, 0)
            offsetX = e.clientX - wordElement.getBoundingClientRect().left;
            offsetY = e.clientY - wordElement.getBoundingClientRect().top;

            // bring it to the very front, add a drop shadow to mimic being "picked up"
            wordElement.style.zIndex = 1000;
            wordElement.style.boxShadow = "2px 2px 3px black";

            // don't let the element do its default action
            e.preventDefault();
        })
    });

    window.addEventListener('mousemove', (e) => {
        // if there's no word selected do nothing
        if (!activeWord) return;

        // otherwise, set the style offset to the current mouse position - the offset shift
        activeWord.style.left = (e.clientX - offsetX) + "px";
        activeWord.style.top = (e.clientY - offsetY) + "px";
    })

    // when the mouseup (magnet is dropped)
    window.addEventListener('mouseup', () => {
        // if we have an active word, put it down, remove its shadow, rotate it between -5 and 5 degrees, and unselect it as the active word
        if (activeWord) {
            activeWord.style.zIndex = 0;
            activeWord.style.boxShadow = "none"

            activeWord.style.transform = "rotate(" + (Math.floor(Math.random() * 11) - 5) + "deg)";

            activeWord = null;
        }
        
    })

// https://stackoverflow.com/a/51478809
    saveBtn.addEventListener("click", (e) => {
        console.log(window.innerWidth);
        e.preventDefault();
        html2canvas(app, {
            width: 600,
            height: window.innerHeight
            // x: (window.innerWidth / 2) - 300
        }).then(function(canvas) {
            saveAs(canvas.toDataURL(), `magnet-poetry-${Date.now().toString()}.png`)
        });
    });
}


// this runs it
main()