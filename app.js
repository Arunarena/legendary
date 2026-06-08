const eras = {
  sporting: {
    years: "2002-2003",
    title: "The spark in Lisbon",
    body: "A fearless teenage winger starts bending matches with speed, stepovers, and a refusal to play small.",
    trait: "Fearless",
    moment: "Breakout night against United",
    vibe: "Raw electricity"
  },
  united: {
    years: "2003-2009, 2021-2022",
    title: "From showman to superstar",
    body: "Manchester sharpened the tricks into end product: pace, strength, free kicks, headers, and ruthless confidence.",
    trait: "Explosive",
    moment: "2008 Ballon d'Or season",
    vibe: "Premier League fire"
  },
  madrid: {
    years: "2009-2018",
    title: "The goal machine peaks",
    body: "Madrid Ronaldo became a record-breaking force, turning Champions League nights into his personal stage.",
    trait: "Relentless",
    moment: "Three-peat European crown",
    vibe: "White-hot dominance"
  },
  juve: {
    years: "2018-2021",
    title: "Italian precision",
    body: "In Turin, he adapted again: smarter movement, brutal timing, and the same hunger for decisive goals.",
    trait: "Clinical",
    moment: "Atletico comeback hat trick",
    vibe: "Tactical edge"
  },
  portugal: {
    years: "2003-present",
    title: "The national icon",
    body: "For Portugal, Ronaldo's story is leadership, longevity, and the joy of carrying a country's football dreams.",
    trait: "Captain",
    moment: "Euro 2016 triumph",
    vibe: "Legacy mode"
  }
};

const questions = [
  {
    question: "Which club did Ronaldo join after leaving Sporting CP?",
    answers: ["Manchester United", "Real Madrid", "Juventus"],
    correct: "Manchester United"
  },
  {
    question: "How many Ballon d'Or awards has Ronaldo won?",
    answers: ["5", "4", "7"],
    correct: "5"
  },
  {
    question: "Which country does Ronaldo captain?",
    answers: ["Portugal", "Spain", "Brazil"],
    correct: "Portugal"
  },
  {
    question: "Which trophy did Portugal win in 2016?",
    answers: ["UEFA Euro", "World Cup", "Copa America"],
    correct: "UEFA Euro"
  },
  {
    question: "Which club era is most associated with Ronaldo's Champions League three-peat?",
    answers: ["Real Madrid", "Juventus", "Sporting CP"],
    correct: "Real Madrid"
  },
  {
    question: "What shirt number is Ronaldo most famous for?",
    answers: ["7", "9", "10"],
    correct: "7"
  }
];

let questionIndex = 0;
let fanEnergy = 0;
let audioContext;
let masterGain;
let musicAudio;
let musicTimer;
let isMusicOn = false;

const musicStateKey = "ronaldoPulseMusicOn";
const musicTimeKey = "ronaldoPulseMusicTime";

const eraButtons = document.querySelectorAll(".era-tab");
const eraYears = document.querySelector("#eraYears");
const eraTitle = document.querySelector("#eraTitle");
const eraBody = document.querySelector("#eraBody");
const eraTrait = document.querySelector("#eraTrait");
const eraMoment = document.querySelector("#eraMoment");
const eraVibe = document.querySelector("#eraVibe");

const quizQuestion = document.querySelector("#quizQuestion");
const quizAnswers = document.querySelector("#quizAnswers");
const quizResult = document.querySelector("#quizResult");
const nextQuestion = document.querySelector("#nextQuestion");

const fanName = document.querySelector("#fanName");
const fanPower = document.querySelector("#fanPower");
const fanRating = document.querySelector("#fanRating");
const cardTheme = document.querySelector("#cardTheme");
const randomCard = document.querySelector("#randomCard");
const fanCard = document.querySelector("#fanCard");
const cardName = document.querySelector("#cardName");
const cardPower = document.querySelector("#cardPower");
const cardRating = document.querySelector("#cardRating");
const fanScore = document.querySelector("#fanScore");
const fanMeter = document.querySelector("#fanMeter");
const matchMood = document.querySelector("#matchMood");
const eventFeed = document.querySelector("#eventFeed");
const resetMatch = document.querySelector("#resetMatch");
const eventButtons = document.querySelectorAll("[data-points]");
const badges = document.querySelectorAll(".badge");
const badgeMessage = document.querySelector("#badgeMessage");
const musicButtons = document.querySelectorAll("[data-music-toggle]");

const randomNames = ["CR7 Mode", "Siuuu Storm", "Clutch King", "Aerial Boss", "Goal Rush"];
const randomPowers = ["Clutch Finisher", "Aerial Threat", "Free-Kick Focus", "Wing Sprint"];
const themes = ["classic", "red", "green", "steel"];

function setEra(key) {
  const era = eras[key];
  if (!era || !eraYears) {
    return;
  }
  eraYears.textContent = era.years;
  eraTitle.textContent = era.title;
  eraBody.textContent = era.body;
  eraTrait.textContent = era.trait;
  eraMoment.textContent = era.moment;
  eraVibe.textContent = era.vibe;

  eraButtons.forEach((button) => {
    const isActive = button.dataset.era === key;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
}

function renderQuestion() {
  if (!quizQuestion || !quizAnswers || !quizResult) {
    return;
  }

  const current = questions[questionIndex];
  quizQuestion.textContent = current.question;
  quizAnswers.innerHTML = "";
  quizResult.textContent = "";

  current.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.className = "answer";
    button.type = "button";
    button.textContent = answer;
    button.addEventListener("click", () => checkAnswer(button, answer, current.correct));
    quizAnswers.append(button);
  });
}

function checkAnswer(button, answer, correct) {
  const allAnswers = quizAnswers.querySelectorAll(".answer");
  allAnswers.forEach((answerButton) => {
    answerButton.disabled = true;
    if (answerButton.textContent === correct) {
      answerButton.classList.add("is-correct");
    }
  });

  if (answer === correct) {
    quizResult.textContent = "Correct. Cold finish.";
  } else {
    button.classList.add("is-wrong");
    quizResult.textContent = `Almost. The answer is ${correct}.`;
  }
}

function updateCard() {
  if (!cardName || !cardPower || !cardRating || !fanCard) {
    return;
  }

  cardName.textContent = fanName.value.trim() || "CR7 Mode";
  cardPower.textContent = fanPower.value;
  cardRating.textContent = fanRating.value;
  fanCard.className = `fan-card theme-${cardTheme.value}`;
}

function getMatchMood() {
  if (fanEnergy >= 80) {
    return "Stadium shaking";
  }
  if (fanEnergy >= 55) {
    return "Pressure rising";
  }
  if (fanEnergy >= 28) {
    return "Momentum building";
  }
  return "Kickoff calm";
}

function updateBadges() {
  const unlocks = [
    { key: "speed", points: 20, message: "Speed Mode unlocked." },
    { key: "air", points: 50, message: "Air Power unlocked." },
    { key: "clutch", points: 80, message: "Clutch Time unlocked." }
  ];

  let latestMessage = "Build enough fan energy to light up the badges.";

  unlocks.forEach((unlock) => {
    const badge = document.querySelector(`[data-badge="${unlock.key}"]`);
    if (!badge) {
      return;
    }
    const isUnlocked = fanEnergy >= unlock.points;
    badge.classList.toggle("is-unlocked", isUnlocked);
    badge.classList.toggle("is-locked", !isUnlocked);
    if (isUnlocked) {
      latestMessage = unlock.message;
    }
  });

  badgeMessage.textContent = latestMessage;
}

function updateMatch(eventName = "Waiting for the first big moment.") {
  if (!fanScore || !fanMeter || !matchMood || !eventFeed) {
    return;
  }

  fanScore.textContent = fanEnergy;
  fanMeter.style.width = `${fanEnergy}%`;
  matchMood.textContent = getMatchMood();
  eventFeed.textContent = eventName;
  updateBadges();
}

function addMatchEvent(button) {
  const points = Number(button.dataset.points);
  fanEnergy = Math.min(100, fanEnergy + points);
  updateMatch(`${button.dataset.event}: +${points} fan energy.`);
}

function resetMatchLab() {
  fanEnergy = 0;
  updateMatch("Match lab reset. Ready for another run.");
}

function randomizeCard() {
  if (!fanName || !fanPower || !cardTheme || !fanRating) {
    return;
  }

  const name = randomNames[Math.floor(Math.random() * randomNames.length)];
  const power = randomPowers[Math.floor(Math.random() * randomPowers.length)];
  const theme = themes[Math.floor(Math.random() * themes.length)];
  const rating = Math.floor(Math.random() * 20) + 80;

  fanName.value = name;
  fanPower.value = power;
  cardTheme.value = theme;
  fanRating.value = rating;
  updateCard();
}

function playTone(frequency, startTime, duration, gainLevel, type = "triangle", destination = masterGain) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(gainLevel, startTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  oscillator.connect(gain);
  gain.connect(destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.03);
}

function playNoiseHit(startTime, duration, gainLevel) {
  const sampleRate = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < data.length; index += 1) {
    data[index] = (Math.random() * 2 - 1) * (1 - index / data.length);
  }

  const source = audioContext.createBufferSource();
  const gain = audioContext.createGain();
  source.buffer = buffer;
  gain.gain.setValueAtTime(gainLevel, startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  source.connect(gain);
  gain.connect(masterGain);
  source.start(startTime);
}

function scheduleBeat() {
  if (!isMusicOn || !audioContext) {
    return;
  }

  const now = audioContext.currentTime;
  const bass = [82.41, 98, 110, 98];
  const arp = [164.81, 196, 246.94, 329.63, 246.94, 196, 220, 293.66];
  const lead = [329.63, 392, 493.88, 440];

  bass.forEach((note, index) => {
    const start = now + index * 0.48;
    playTone(note, start, 0.28, 0.22, "sawtooth");
    playTone(note * 2, start + 0.02, 0.2, 0.08, "square");
    playNoiseHit(start, 0.07, 0.055);
  });

  arp.forEach((note, index) => {
    playTone(note, now + index * 0.12, 0.1, 0.075, "triangle");
  });

  lead.forEach((note, index) => {
    playTone(note, now + 0.24 + index * 0.36, 0.18, 0.1, "square");
  });

  playTone(65.41, now, 1.86, 0.085, "sine");
  musicTimer = window.setTimeout(scheduleBeat, 1920);
}

function setMusicButtonText() {
  musicButtons.forEach((button) => {
    button.textContent = "Music";
    button.classList.toggle("is-playing", isMusicOn);
    button.setAttribute("aria-pressed", String(isMusicOn));
  });
}

function createMusicAudio() {
  if (!musicAudio) {
    musicAudio = new Audio("assets/music-from-1min.mp3");
    musicAudio.loop = true;
    musicAudio.volume = 0.85;
    const savedTime = Number(localStorage.getItem(musicTimeKey));
    if (Number.isFinite(savedTime) && savedTime > 0) {
      musicAudio.currentTime = savedTime;
    }

    musicAudio.addEventListener("timeupdate", () => {
      localStorage.setItem(musicTimeKey, String(musicAudio.currentTime));
    });
  }

  return musicAudio;
}

function saveMusicState() {
  localStorage.setItem(musicStateKey, isMusicOn ? "on" : "off");
  if (musicAudio) {
    localStorage.setItem(musicTimeKey, String(musicAudio.currentTime));
  }
}

function playMusic() {
  const audio = createMusicAudio();
  isMusicOn = true;
  setMusicButtonText();
  saveMusicState();
  audio.play().catch(() => {
    if (eventFeed) {
      eventFeed.textContent = "Music is ready. Tap Music once to let the browser start it.";
    }
  });
}

function pauseMusic() {
  if (musicAudio) {
    musicAudio.pause();
  }
  isMusicOn = false;
  setMusicButtonText();
  saveMusicState();
}

function toggleMusic() {
  if (isMusicOn) {
    pauseMusic();
  } else {
    playMusic();
  }
}

function restoreMusicState() {
  isMusicOn = localStorage.getItem(musicStateKey) === "on";
  setMusicButtonText();
  if (isMusicOn) {
    playMusic();
  }
}

window.addEventListener("beforeunload", saveMusicState);

eraButtons.forEach((button) => {
  button.addEventListener("click", () => setEra(button.dataset.era));
});

if (nextQuestion) {
  nextQuestion.addEventListener("click", () => {
    questionIndex = (questionIndex + 1) % questions.length;
    renderQuestion();
  });
}

[fanName, fanPower, fanRating, cardTheme].forEach((control) => {
  if (control) {
    control.addEventListener("input", updateCard);
  }
});

eventButtons.forEach((button) => {
  button.addEventListener("click", () => addMatchEvent(button));
});

badges.forEach((badge) => {
  badge.addEventListener("click", () => {
    if (badge.classList.contains("is-unlocked")) {
      badgeMessage.textContent = `${badge.textContent} is active on your fan card energy.`;
    } else {
      badgeMessage.textContent = "Keep tapping match events to unlock this badge.";
    }
  });
});

if (resetMatch) {
  resetMatch.addEventListener("click", resetMatchLab);
}

if (randomCard) {
  randomCard.addEventListener("click", randomizeCard);
}

musicButtons.forEach((button) => {
  button.addEventListener("click", toggleMusic);
});

renderQuestion();
updateCard();
updateMatch();
restoreMusicState();
