// ===============================
// ÉTAT GLOBAL
// ===============================
let state = {
  character: null,
  scene: "menu",
  difficulty: "normal",
  alive: true,
  flags: {},
};

// ===============================
// SAUVEGARDE
// ===============================
function saveGame() {
  if (!state.character) return;
  localStorage.setItem("DARK_" + state.character, JSON.stringify(state));
}

function loadGame(char) {
  let data = localStorage.getItem("DARK_" + char);
  if (data) {
    state = JSON.parse(data);
    playScene();
  }
}

// ===============================
// MENU
// ===============================
function showMenu() {
  document.getElementById("content").innerHTML = `
    <button onclick="newGame()">Nouvelle Partie</button>
    <button onclick="continueGame()">Continuer</button>
    <button onclick="settings()">Paramètres</button>
  `;
}

function newGame() {
  document.getElementById("content").innerHTML = `
    <h2>Choisissez un personnage</h2>
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
    <button onclick="setDifficulty('easy')">Facile</button>
    <button onclick="setDifficulty('normal')">Normal</button>
    <button onclick="setDifficulty('hard')">Difficile</button>
    <button onclick="showMenu()">Retour</button>
  `;
}

function setDifficulty(d) {
  state.difficulty = d;
  showMenu();
}

function start(char) {
  state = {
    character: char,
    scene: "intro",
    difficulty: state.difficulty,
    alive: true,
    flags: {}
  };
  saveGame();
  playScene();
}

// ===============================
// SCÈNES
// ===============================
function playScene() {
  if (!state.alive) {
    document.getElementById("content").innerHTML = `
      <h2>FIN</h2>
      <p>Le Conservateur referme son livre, lentement.</p>
      <button onclick="showMenu()">Menu</button>
    `;
    return;
  }

  if (state.character === "conrad") playConrad();
  if (state.character === "andrew") playAndrew();
  if (state.character === "rachel") playRachel();
  if (state.character === "kate") playKate();
}

// ===============================
// CONSERVATEUR
// ===============================
function conservator(text, next) {
  document.getElementById("content").innerHTML = `
    <p><em>Le Conservateur :</em><br>${text}</p>
    <button onclick="${next}">Continuer</button>
  `;
}

// ===============================
// CONRAD – MAN OF MEDAN
// ===============================
function playConrad() {
  const c = document.getElementById("content");

  switch (state.scene) {

    case "intro":
      conservator(
        "Conrad. L'humour masque souvent la peur. Voyons combien de temps le masque tiendra.",
        "state.scene='epave';saveGame();playScene();"
      );
      break;

    case "epave":
      c.innerHTML = `
        <p>L'épave surgit des flots. Le métal rouillé gémit sous les vagues noires.
        L'air sent le sel et la mort.</p>
        <button onclick="state.scene='intrus';saveGame();playScene()">Explorer</button>
        <button onclick="state.scene='mort';saveGame();playScene()">Faire demi-tour</button>
      `;
      break;

    case "intrus":
      c.innerHTML = `
        <p>Des pas résonnent. Des silhouettes armées émergent de l'obscurité.</p>
        <button onclick="qte()">Se cacher</button>
      `;
      break;

    case "fin":
      c.innerHTML = `
        <h2>CONRAD SURVIT</h2>
        <p>Un bateau apparaît à l'horizon. Tu ris, nerveusement.</p>
        <button onclick="showMenu()">Menu</button>
      `;
      break;

    case "mort":
      state.alive = false;
      saveGame();
      playScene();
      break;
  }
}

// ===============================
// ANDREW – LITTLE HOPE
// ===============================
function playAndrew() {
  const c = document.getElementById("content");

  switch (state.scene) {

    case "intro":
      conservator(
        "Andrew. La culpabilité est un poison lent. Tu en as déjà bu.",
        "state.scene='ville';saveGame();playScene();"
      );
      break;

    case "ville":
      c.innerHTML = `
        <p>Little Hope est noyée dans le brouillard. Les rues sont désertes,
        mais tu sens que quelque chose t'observe.</p>
        <button onclick="state.scene='vision';saveGame();playScene()">Avancer</button>
      `;
      break;

    case "vision":
      c.innerHTML = `
        <p>Des flammes. Des cris. Le passé refuse de rester enterré.</p>
        <button onclick="qte()">Résister</button>
      `;
      break;

    case "fin":
      c.innerHTML = `
        <h2>ANDREW ACCEPTE LA VÉRITÉ</h2>
        <p>Le brouillard se dissipe. La ville disparaît.</p>
        <button onclick="showMenu()">Menu</button>
      `;
      break;

    default:
      state.alive = false;
      saveGame();
      playScene();
  }
}

// ===============================
// RACHEL – HOUSE OF ASHES
// ===============================
function playRachel() {
  const c = document.getElementById("content");

  switch (state.scene) {

    case "intro":
      conservator(
        "Rachel. Soldat. Stratège. Mais sous terre, personne ne commande.",
        "state.scene='temple';saveGame();playScene();"
      );
      break;

    case "temple":
      c.innerHTML = `
        <p>Le temple sumérien s'effondre. Des cris résonnent sous la roche.</p>
        <button onclick="qte()">Se défendre</button>
      `;
      break;

    case "fin":
      c.innerHTML = `
        <h2>RACHEL S'ÉCHAPPE</h2>
        <p>Le soleil perce enfin les ruines.</p>
        <button onclick="showMenu()">Menu</button>
      `;
      break;

    default:
      state.alive = false;
      saveGame();
      playScene();
  }
}

// ===============================
// KATE – THE DEVIL IN ME
// ===============================
function playKate() {
  const c = document.getElementById("content");

  switch (state.scene) {

    case "intro":
      conservator(
        "Kate. Observer le mal n'immunise pas contre lui.",
        "state.scene='hotel';saveGame();playScene();"
      );
      break;

    case "hotel":
      c.innerHTML = `
        <p>Les murs de l'hôtel respirent. Les caméras te suivent.</p>
        <button onclick="qte()">Fuir</button>
      `;
      break;

    case "fin":
      c.innerHTML = `
        <h2>KATE SURVIT</h2>
        <p>Les portes se referment derrière toi.</p>
        <button onclick="showMenu()">Menu</button>
      `;
      break;

    default:
      state.alive = false;
      saveGame();
      playScene();
  }
}

// ===============================
// QTE
// ===============================
function qte() {
  let failChance = state.difficulty === "hard" ? 0.7 : 0.4;
  if (Math.random() < failChance) {
    state.alive = false;
  } else {
    state.scene = "fin";
  }
  saveGame();
  playScene();
}

// ===============================
showMenu();
