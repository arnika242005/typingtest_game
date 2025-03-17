const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");
let quote = "";
let time = 60;
let timer = "";

const renderNewQuote = async () => {
    const response = await fetch(quoteApiUrl);
    let data = await response.json();
    quote = data.content;

    let arr = quote.split("").map((value) => `<span class='quote-chars'>${value}</span>`);
    quoteSection.innerHTML = arr.join("");
};

userInput.addEventListener("input", () => {
    let quoteChars = Array.from(document.querySelectorAll(".quote-chars"));
    let userInputChars = userInput.value.split("");

    quoteChars.forEach((char, index) => {
        if (userInputChars[index] == null) {
            char.classList.remove("success", "fail");
        } else if (char.innerText === userInputChars[index]) {
            char.classList.add("success");
            char.classList.remove("fail");
        } else {
            char.classList.add("fail");
            char.classList.remove("success");
        }
    });

    let check = quoteChars.every((element) => element.classList.contains("success"));
    if (check && userInput.value.length === quote.length) {
        displayResult();
    }
});

function updateTimer() {
    if (time === 0) {
        displayResult();
    } else {
        document.getElementById("timer").innerText = --time + "s";
    }
}

const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
};

const displayResult = () => {
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;

    let timeTaken = (60 - time) / 60;
    let wpm = timeTaken > 0 ? (userInput.value.length / 5 / timeTaken).toFixed(2) : 0;
    let accuracy = userInput.value.length > 0 
        ? Math.round((userInput.value.length - document.querySelectorAll(".fail").length) / userInput.value.length * 100) 
        : 0;

    document.getElementById("wpm").innerText = wpm + " wpm";
    document.getElementById("accuracy").innerText = accuracy + "%";
};

const startTest = () => {
    time = 60;
    userInput.value = "";
    userInput.disabled = false;
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
    renderNewQuote();
};

window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
};

