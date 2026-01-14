let state = {
  character: null,
  scene: "menu",
  difficulty: "normal",
  alive: true,
  flags: {}
};

function saveGame() {
  localStorage.setItem("darkPicturesSave_" + state.character, JSON.stringify(state));
}

function loadGame(character) {
  const data = localStorage.getItem("darkPicturesSave_" + character);
  if (data) state = JSON.parse(data);
}

function newGame() {
  document.getElementById("content").innerHTML = `
    <h2>Choisissez un personnage</h2>
    <button onclick="startCharacter('conrad')">Conrad</button>
    <button onclick="startCharacter('andrew')">Andrew</button>
    <button onclick="startCharacter('rachel')">Rachel</button>
    <button onclick="startCharacter('kate')">Kate</button>
  `;
}

function continueGame() {
  newGame();
}

function openSettings() {
  document.getElementById("content").innerHTML = `
    <h2>Paramètres</h2>
    <button onclick="setDifficulty('easy')">Facile</button>
    <button onclick="setDifficulty('normal')">Normal</button>
    <button onclick="setDifficulty('hard')">Difficile</button>
  `;
}

function setDifficulty(diff) {
  state.difficulty = diff;
  alert("Difficulté : " + diff);
}

function startCharacter(char) {
  state.character = char;
  state.scene = "intro";
  state.alive = true;
  state.flags = {};
  saveGame();
  playScene();
}

function playScene() {
  const content = document.getElementById("content");

  if (!state.alive) {
    content.innerHTML = `<h2>FIN</h2><p>Le Conservateur referme son livre.</p>`;
    return;
  }

  if (state.scene === "intro") {
    content.innerHTML = `
      <p><em>Le Conservateur :</em><br>
      "Chaque histoire est un choix. Chaque choix, une fin."</p>
      <button onclick="nextScene()">Continuer</button>
    `;
  }

  if (state.scene === "chapter1") {
    content.innerHTML = `
      <p>L'obscurité vous entoure. Une décision doit être prise.</p>
      <button class="choice" onclick="choose('fuite')">Fuir</button>
      <button class="choice" onclick="choose('affronter')">Affronter</button>
    `;
  }
}

function nextScene() {
  state.scene = "chapter1";
  saveGame();
  playScene();
}

function choose(choice) {
  if (choice === "affronter" && state.difficulty === "hard") {
    state.alive = false;
  }
  state.scene = "end";
  saveGame();
  playScene();
}

