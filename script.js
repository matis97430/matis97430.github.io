// Variables globales
let score = 0;
const bonnesReponses = {
  q1: '20/06/2024',
  q2: 'eglise',
  q3: 'blue lock',
  q4: '408',
  q5: 'innuc',
  q6: '21h12'
};



// Timer challenge
let timerInterval;
let tempsParQuestion = 20; // secondes restantes

function demarrerTimer() {
  const timeText = document.getElementById("timeText");
  const timeBar = document.getElementById("timeBar");
  tempsParQuestion = 20; // reset

  if (!timeText || !timeBar) return; // sécurité si éléments absents

  timeText.textContent = `${tempsParQuestion}s`;
  timeBar.style.animation = 'none'; // reset animation
  // Force reflow pour relancer animation CSS
  void timeBar.offsetWidth;
  timeBar.style.animation = `timeBarAnim ${tempsParQuestion}s linear forwards`;

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    tempsParQuestion--;
    if (tempsParQuestion >= 0) {
      timeText.textContent = `${tempsParQuestion}s`;
    }
    if (tempsParQuestion <= 0) {
      clearInterval(timerInterval);
      // Auto-passage à la page suivante si temps écoulé et pas sur dernière page
      const currentPage = document.querySelector('section[style*="block"]');
      if (currentPage) {
        const id = currentPage.id; // ex: "page1"
        const pageNum = parseInt(id.replace('page',''), 10);
        if (pageNum < 4) { // évite de dépasser la finale
          suivant(pageNum);
        }
      }
    }
  }, 1000);
}

// Intro écran
window.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("introScreen");
  setTimeout(() => {
    intro.style.display = "none";
  }, 5000); // masque après 5 secondes
});

// Gère la navigation des pages
function suivant(pageActuelle) {
  document.getElementById(`page${pageActuelle}`).style.display = 'none';
  const suivante = document.getElementById(`page${pageActuelle + 1}`);
  suivante.style.display = 'block';

  if (pageActuelle + 1 === 4) {
    lancerConfettis(); // Lance les confettis à la page finale
  }
}

function precedent(pageActuelle) {
  document.getElementById(`page${pageActuelle}`).style.display = 'none';
  document.getElementById(`page${pageActuelle - 1}`).style.display = 'block';
  if (pageActuelle === 4) {
    arreterConfettis();
  }
}

// Vérifie la réponse et affiche feedback + animation coeur
function verifier(id, bonneReponse) {
  const input = document.getElementById(id);
  const feedback = document.getElementById('f' + id.charAt(1));
  const reponse = input.value.trim().toLowerCase();
  feedback.classList.remove("visible");

  if (reponse === bonneReponse.toLowerCase()) {
    if(!input.dataset.correct) {
      score++;
      input.dataset.correct = "true";
    }
    feedback.textContent = '✔️ c\'était facile aussi !';
    feedback.style.color = 'green';
    showHeart(input);
  } else {
    if(input.dataset.correct) {
      score--;
      input.dataset.correct = "";
    }
    feedback.textContent = '❌ tes nullllll wtfffffff';
    feedback.style.color = 'red';
  }
  setTimeout(() => {
    feedback.classList.add("visible");
  }, 50);
}

// Affiche un cœur qui pulse à côté de l’input
function showHeart(input) {
  const heart = document.createElement('span');
  heart.textContent = '❤️';
  heart.className = 'heart';
  const rect = input.getBoundingClientRect();
  heart.style.top = (rect.top + window.scrollY - 10) + 'px';
  heart.style.left = (rect.left + window.scrollX + rect.width - 30) + 'px';
  document.body.appendChild(heart);
  setTimeout(() => {
    heart.remove();
  }, 800);
}

// Affiche le message final avec score personnalisé
function showFinalMessage() {
  const finalMsg = document.getElementById('finalMessage');
  if(score === Object.keys(bonnesReponses).length) {
    finalMsg.textContent = "Tu me connais par cœur 😍 ! Tu es mon évidence 💘";
  } else {
    finalMsg.textContent = `Tu as ${score} bonne${score>1?'s':''} réponse${score>1?'s':''} sur ${Object.keys(bonnesReponses).length}. Mais pour moi, tu es toujours la plus belle. 💖`;
  }
}

// Confettis
const confettiColors = ['#f08080', '#f4a8a8', '#ffa8a8', '#e66767', '#d94f4f'];
let confettiInterval;
function lancerConfettis() {
  const confettiContainer = document.getElementById('confettis');
  confettiContainer.style.display = 'block';

  confettiInterval = setInterval(() => {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.backgroundColor = confettiColors[Math.floor(Math.random()*confettiColors.length)];
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.animationDuration = (3 + Math.random()*2) + 's';
    confetti.style.width = (8 + Math.random()*6) + 'px';
    confetti.style.height = confetti.style.width;
    confettiContainer.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 5000);
  }, 150);
}

function arreterConfettis() {
  const confettiContainer = document.getElementById('confettis');
  confettiContainer.style.display = 'none';
  clearInterval(confettiInterval);
  while (confettiContainer.firstChild) {
    confettiContainer.removeChild(confettiContainer.firstChild);
  }
}

// Musique de fond
const music = document.getElementById('music');
const musicBtn = document.getElementById('musicBtn');

musicBtn.addEventListener('click', () => {
  if (music.paused) {
    music.play();
    musicBtn.textContent = '🔈 Couper la musique';
  } else {
    music.pause();
    musicBtn.textContent = '▶️ Jouer la musique';
  }
});

// Effet machine à écrire sur la page finale
const msg = "Ma Léana, chaque moment passé avec toi est un trésor. Ta douceur, ton rire, ta manière unique de rendre la vie plus belle me rappellent chaque jour combien je suis chanceux de t’avoir. Tu es mon présent, mon avenir, mon univers. Je t’aime infiniment, et je te le redirai jusqu’au dernier souffle. Joyeux anniversaire mon amour tes le meilleur cadeaux que j'ai eu dans ma vie."; 
const typingEl = document.getElementById("typingMessage");
const page4 = document.getElementById("page4");

const observer = new MutationObserver(() => {
  if (page4.style.display !== "none" && typingEl.innerHTML === "") {
    let i = 0;
    function type() {
      if (i < msg.length) {
        typingEl.innerHTML += msg.charAt(i);
        i++;
        setTimeout(type, 40); // vitesse de frappe
      }
    }
    type();
  }
});

observer.observe(page4, { attributes: true, attributeFilter: ["style"] });

// --- MODE SOMBRE ---

// Création du bouton mode sombre
const darkModeBtn = document.createElement('button');
darkModeBtn.id = 'darkModeBtn';
darkModeBtn.textContent = '🌙 Mode sombre';
darkModeBtn.style.position = 'fixed';
darkModeBtn.style.bottom = '20px';
darkModeBtn.style.right = '20px';
darkModeBtn.style.padding = '10px 15px';
darkModeBtn.style.backgroundColor = '#f08080';
darkModeBtn.style.color = 'white';
darkModeBtn.style.border = 'none';
darkModeBtn.style.borderRadius = '10px';
darkModeBtn.style.cursor = 'pointer';
darkModeBtn.style.boxShadow = '0 0 6px #f08080';
darkModeBtn.style.zIndex = '10000';
darkModeBtn.style.userSelect = 'none';
darkModeBtn.style.transition = 'background-color 0.3s ease';

document.body.appendChild(darkModeBtn);

darkModeBtn.addEventListener('mouseenter', () => {
  darkModeBtn.style.backgroundColor = '#e66767';
});
darkModeBtn.addEventListener('mouseleave', () => {
  darkModeBtn.style.backgroundColor = '#f08080';
});

darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  if(document.body.classList.contains('dark-mode')) {
    darkModeBtn.textContent = '☀️ Mode clair';
  } else {
    darkModeBtn.textContent = '🌙 Mode sombre';
  }
});
