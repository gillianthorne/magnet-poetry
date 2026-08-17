const app = document.querySelector("#app");

// import text list
// same thing as an api call but with a local json file
async function loadWordList() {
    const response = await fetch("./words.json");
    const data = await response.json();
    const wordList = data["words"];

    // shuffle the list so the words are randomized, then take the first 100
    shuffle(wordList);
    return wordList.splice(0, 100);
}

// scatters all words
function scatterWords(words) {
    // for every word
    words.forEach(word => {
        // x can be anywhere between 50 px from the left and 50px from the right, y can be anywhere from 50px from the top and 70px from the bottom (accounts for height)
        var newX = Math.floor(Math.random() * (window.innerWidth - 100)) + 50;
        var newY = Math.floor(Math.random() * (window.innerHeight - 120)) + 50;

        // while the new x is within 300px of the midpoint (600px wide blank canvas), redo the math
        while (newX > ((window.innerWidth / 2) - 300) && (newX < (window.innerWidth / 2) + 300)) {
            newX = Math.floor(Math.random() * (window.innerWidth - 100)) + 50;
        }

        // the xPos and yPos aren't super important, they just make it easier to give the words a space, this is the only time they're used
        word["xPos"] = newX;
        word["yPos"] = newY;
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


async function main() {
    // set a variable for the word list
    const allWords = await loadWordList();
    // there is no currently selected word
    var activeWord = null;

    // initialize offset variables
    var offsetX, offsetY;

    // scatter the words throughout allowed space on the screen
    scatterWords(allWords);

     // iterate through the word list and add each one to the screen
    allWords.forEach(word => {
        // create the word element and set all initialized properties, then add it to the page
        const wordElement = document.createElement("span");
        wordElement.textContent = word["word"];
        wordElement.classList.add("word");
        wordElement.id = word["id"];
        wordElement.style.left = word["xPos"] + "px";
        wordElement.style.top = word["yPos"] + "px";
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
        // if we have an active word, put it down, remove its shadow, and unselect it as the active word
        if (activeWord) {
            activeWord.style.zIndex = 0;
            activeWord.style.boxShadow = "none"
            activeWord = null;
        }
        
    })
}


// this runs it
main()