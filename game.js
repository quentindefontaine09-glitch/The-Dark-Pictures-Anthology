// ==================================================
// ÉTAT GLOBAL
// ==================================================
let state = {
  character: null,
  scene: "menu",
  chapter: 0,
  alive: true,
  difficulty: "normal",
  flags: {},
  log: ""
};

// ==================================================
// SAUVEGARDE
// ==================================================
function saveGame() {
  if (!state.character) return;
  localStorage.setItem("DP_V2_" + state.character, JSON.stringify(state));
}

function loadGame(char) {
  const data = localStorage.getItem("DP_V2_" + char);
  if (data) {
    state = JSON.parse(data);
    playScene();
  }
}

// ==================================================
// MENUS
// ==================================================
function showMenu() {
  document.getElementById("content").innerHTML = `
    <button onclick="newGame()">Nouvelle Partie</button>
    <button onclick="continueGame()">Continuer</button>
    <button onclick="settings()">Paramètres</button>
  `;
}

function newGame() {
  document.getElementById("content").innerHTML = `
    <h2>Sélection du personnage</h2>
    <button onclick="start('conrad')">Conrad</button>
    <button onclick="start('andrew')">Andrew</button>
    <button onclick="start('rachel')">Rachel</button>
    <button onclick="start('kate')">Kate</button>
  `;
}

function continueGame() {
  newGame();
}

function settings() {
  document.getElementById("content").innerHTML = `
    <h2>Difficulté</h2>
    <button onclick="state.difficulty='easy';showMenu()">Facile</button>
    <button onclick="state.difficulty='normal';showMenu()">Normal</button>
    <button onclick="state.difficulty='hard';showMenu()">Difficile</button>
  `;
}

function start(char) {
  state = {
    character: char,
    scene: "intro",
    chapter: 1,
    alive: true,
    difficulty: state.difficulty,
    flags: {
      peur: 0,
      blessure: false,
      juliaVivante: true,
      bradVivant: true
    },
    log: ""
  };
  saveGame();
  playScene();
}

// ==================================================
// CONSERVATEUR
// ==================================================
function conservateur(text, next) {
  document.getElementById("content").innerHTML = `
    <p><em>Le Conservateur :</em><br>${text}</p>
    <button onclick="state.scene='${next}';saveGame();playScene()">Continuer</button>
  `;
}

// ==================================================
// QTE
// ==================================================
function qte(success, fail) {
  let key = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  let time = state.difficulty === "hard" ? 1800 : 3000;

  document.getElementById("content").innerHTML = `
    <p class="qte">APPUYEZ SUR : ${key}</p>
    <p class="timer">${time / 1000}s</p>
  `;

  let t = setTimeout(() => {
    state.scene = fail;
    saveGame();
    playScene();
  }, time);

  document.onkeydown = e => {
    if (e.key.toUpperCase() === key) {
      clearTimeout(t);
      document.onkeydown = null;
      state.scene = success;
      saveGame();
      playScene();
    }
  };
}

// ==================================================
// SCÈNES
// ==================================================
function playScene() {
  if (!state.alive) {
    document.getElementById("content").innerHTML = `
      <h2>PERSONNAGE DÉCÉDÉ</h2>
      <p>${state.log}</p>
      <p><em>Le Conservateur referme son livre.</em></p>
      <button onclick="showMenu()">Menu</button>
    `;
    return;
  }

  if (state.character === "conrad") playConrad();
  if (state.character === "andrew") playAndrewPlaceholder();
  if (state.character === "rachel") playRachelPlaceholder();
  if (state.character === "kate") playKatePlaceholder();
}

// ==================================================
// CONRAD – MAN OF MEDAN (VERSION LONGUE)
// ==================================================
function playConrad() {
  const c = document.getElementById("content");

  switch (state.scene) {

    case "intro":
      conservateur(
        "Conrad. Charmeur, imprudent… mais même les plaisanteries se taisent quand la mort écoute.",
        "plongee"
      );
      break;

    case "plongee":
      c.innerHTML = `
        <p>L’eau est noire et glaciale. Autour de toi, l’épave repose comme un cadavre
        oublié par le temps. Le silence est total, oppressant.</p>
        <button onclick="state.scene='epave';saveGame();playScene()">Explorer l'épave</button>
        <button onclick="state.scene='retour';saveGame();playScene()">Remonter</button>
      `;
      break;

    case "retour":
      state.flags.peur++;
      c.innerHTML = `
        <p>Tu hésites. Une mauvaise intuition te serre la poitrine.
        Mais quelque chose te pousse à continuer.</p>
        <button onclick="state.scene='epave';saveGame();playScene()">Redescendre</button>
      `;
      break;

    case "epave":
      c.innerHTML = `
        <p>À l’intérieur, les couloirs sont étroits. Des ombres dansent sur les parois.
        Une silhouette… non, juste ton reflet.</p>
        <button onclick="qte('chute','mort_chute')">Traverser la passerelle</button>
      `;
      break;

    case "chute":
      state.flags.blessure = true;
      c.innerHTML = `
        <p>La passerelle cède. Tu te rattrapes de justesse, mais ta jambe heurte le métal.
        La douleur est vive. Tu boiteras.</p>
        <button onclick="state.scene='pirates';saveGame();playScene()">Continuer</button>
      `;
      break;

    case "pirates":
      c.innerHTML = `
        <p>Des voix. Des armes. Les pirates.
        Julia te regarde, terrorisée.</p>
        <button onclick="state.scene='distraction';saveGame();playScene()">Créer une diversion</button>
        <button onclick="state.scene='cachette';saveGame();playScene()">Se cacher</button>
      `;
      break;

    case "distraction":
      c.innerHTML = `
        <p>Tu attires leur attention. Un coup part.</p>
        <button onclick="qte('sauver_julia','mort_balle')">Plonger</button>
      `;
      break;

    case "sauver_julia":
      c.innerHTML = `
        <p>Julia est saine et sauve. Elle te serre le bras.</p>
        <button onclick="state.scene='final';saveGame();playScene()">Avancer</button>
      `;
      break;

    case "cachette":
      state.flags.juliaVivante = false;
      c.innerHTML = `
        <p>Un cri. Trop tard.
        Tu sais que tu aurais pu agir.</p>
        <button onclick="state.scene='final';saveGame();playScene()">Continuer</button>
      `;
      break;

    case "final":
      if (state.flags.blessure) {
        state.log = "Blessé lors de l’exploration, Conrad n’a pas pu fuir à temps.";
        state.alive = false;
      } else {
        c.innerHTML = `
          <h2>CONRAD SURVIT</h2>
          <p>Le bateau de secours apparaît à l’horizon.
          Tu ris nerveusement. Cette fois, tu es vivant.</p>
          <button onclick="showMenu()">Menu</button>
        `;
        saveGame();
        return;
      }
      saveGame();
      playScene();
      break;

    case "mort_chute":
      state.log = "La passerelle a cédé. La chute a été fatale.";
      state.alive = false;
      saveGame();
      playScene();
      break;

    case "mort_balle":
      state.log = "Le tir était précis. Conrad est tombé pour sauver Julia.";
      state.alive = false;
      saveGame();
      playScene();
      break;
  }
}

// ==================================================
// PLACEHOLDERS (REMPLACÉS AU PROCHAIN MESSAGE)
// ==================================================
function playAndrewPlaceholder() {
  document.getElementById("content").innerHTML =
    "<p>Andrew arrive dans le prochain message.</p><button onclick='showMenu()'>Menu</button>";
}
function playRachelPlaceholder() {
  document.getElementById("content").innerHTML =
    "<p>Rachel arrive dans le prochain message.</p><button onclick='showMenu()'>Menu</button>";
}
function playKatePlaceholder() {
  document.getElementById("content").innerHTML =
    "<p>Kate arrive dans le prochain message.</p><button onclick='showMenu()'>Menu</button>";
}

showMenu();
