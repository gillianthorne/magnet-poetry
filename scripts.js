const app = document.querySelector("#app");

// import text list
// same thing as an api call but with a text file
async function loadWordList() {
    const response = await fetch("./words.json");
    const data = await response.json();
    const wordList = data["words"];
    // this is just a sanity check - should be about 370
    shuffle(wordList);

    return wordList.splice(0, 100);
}

// scatters all words
function scatterWords(words) {
    words.forEach(word => {
        var newX = Math.floor(Math.random() * (window.innerWidth - 170)) + 50;
        var newY = Math.floor(Math.random() * (window.innerHeight - 120)) + 50;

        while (newX > ((window.innerWidth / 2) - 350) && (newX < (window.innerWidth / 2) + 350)) {
            var newX = Math.floor(Math.random() * (window.innerWidth - 170)) + 50;
            console.log(newX);
        }

        while (newY > 100 && newY < (window.innerHeight - 100)) {
            var newY = Math.floor(Math.random() * (window.innerWidth - 120)) + 50;
        }

        word["xPos"] = newX;
        word["yPOs"] = newY;
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
    console.log(allWords);
    var activeWord = null;

    scatterWords(allWords);

    var offsetX, offsetY;
    

     // iterate through the word list and add each one to the screen
    allWords.forEach(word => {
        // create the word element
        const wordElement = document.createElement("span");
        wordElement.textContent = word["word"];
        wordElement.classList.add("word");
        wordElement.id = word["id"];
        wordElement.style.left = word["xPos"];
        wordElement.style.top = word["yPos"];
        app.appendChild(wordElement);

        wordElement.addEventListener("mousedown", (e) => {
            activeWord = wordElement;
            offsetX = e.clientX - wordElement.getBoundingClientRect().left;
            offsetY = e.clientY - wordElement.getBoundingClientRect().top;

            wordElement.style.zIndex = 1000;
            wordElement.style.boxShadow = "2px 2px 3px black";
            e.preventDefault();
        })
    });

    window.addEventListener('mousemove', (e) => {
        if (!activeWord) return;

        activeWord.style.left = (e.clientX - offsetX) + "px";
        activeWord.style.top = (e.clientY - offsetY) + "px";
    })

    window.addEventListener('mouseup', () => {
        if (activeWord) {
            activeWord.style.zIndex = 0;
            activeWord.style.boxShadow = "none"
            activeWord = null;
        }
        
    })

    


}

main()