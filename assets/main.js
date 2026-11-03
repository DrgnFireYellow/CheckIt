var userData = JSON.parse(localStorage.getItem("CheckItUserData")) || {streak: 0, last_streak_day: null, coins: 0};
var quests = JSON.parse(localStorage.getItem("CheckItQuests")) || [];

if (userData.last_streak_day && dayjs().diff(dayjs(userData.last_streak_day), "day") >= 2) {
    userData.streak = 0
}

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(SplitText);
    displayQuests()
    displayUserData()
});

const questCompletedChime = new Audio("assets/sfx/quest-completed.mp3");

function displayQuests() {
    const questList = document.getElementById("quest-list");

    questList.replaceChildren();

    quests.forEach((quest, i) => {
        const questLi = document.createElement("li");
        questLi.className = "quest";

        const completeButton = document.createElement("button");
        completeButton.onclick = () => completeQuest(i);
        completeButton.textContent = "Complete"
        questLi.appendChild(completeButton);
        
        const taskParagraph = document.createElement("p");
        taskParagraph.textContent = quest.task;
        questLi.appendChild(taskParagraph);

        questList.appendChild(questLi);
    });
}

function saveQuests() {
    localStorage.setItem("CheckItQuests", JSON.stringify(quests));
}

function newQuest() {
    const task = prompt("Task to complete the quest:");
    
    if (task == null || task.trim() === "") {
        return;
    }

    quests.push({task: task});
    saveQuests();
    displayQuests();
}

function completeQuest(id) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    let animate_streak = false;
    
    if (userData.last_streak_day !== currentDate.toISOString()) {
        userData.last_streak_day = currentDate.toISOString();
        userData.streak++;
        animate_streak = true;
    }

    userData.coins += Math.floor(Math.random() * 75);

    quests.splice(id, 1);
    saveQuests();
    saveUserData();
    displayQuests();
    displayUserData();

    if (animate_streak) {
        animateStreakUp();
    }

    animateCoinsUp();

    questCompletedChime.play();
}

function displayUserData() {
    const streakSpan = document.getElementById("streak-indicator");
    streakSpan.textContent = userData.streak;

    const coinsSpan = document.getElementById("coins-indicator");
    coinsSpan.textContent = userData.coins;
}

function saveUserData() {
    localStorage.setItem("CheckItUserData", JSON.stringify(userData));
}

function playTextBounceAnimation(split) {
    gsap.fromTo(split.chars, { y: 0 }, {
        y: -5,
        duration: 0.125,
        stagger: 0.05,
        yoyo: true,
        repeat: 1,
        onComplete: () => {split.revert()}}
    );
}

function animateStreakUp() {
    const streakSplit = new SplitText("#streak-indicator", {type: "chars"});
    playTextBounceAnimation(streakSplit);
}

function animateCoinsUp() {
    const coinsSplit = new SplitText("#coins-indicator", {type: "chars"});
    playTextBounceAnimation(coinsSplit);
}  