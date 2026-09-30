import { ui } from './elements.js';
import { formatTime } from '../utils/helpers.js';
import { getBestScore } from '../utils/storage.js';
import { state, LEVELS } from '../game/state.js';

export function updateStats() {
    ui.movesElement.textContent = state.moves;
    ui.timerElement.textContent = formatTime(state.seconds);

    if (state.selectedPlayers === 1) {
        ui.turnLabel.textContent = "Pontos";
        ui.turnValue.textContent = state.playerScores[0];
    } else {
        ui.turnLabel.textContent = "Vez de";
        ui.turnValue.textContent = `P${state.currentPlayer + 1}`;
    }

    ui.playerOneScore.querySelector("strong").textContent = state.playerScores[0];
    ui.playerTwoScore.querySelector("strong").textContent = state.playerScores[1];
    ui.playerOneScore.classList.toggle("is-active", state.currentPlayer === 0);
    ui.playerTwoScore.classList.toggle("is-active", state.currentPlayer === 1);
}

export function updateModeText() {
    const level = LEVELS[state.selectedLevel];
    const playerText = state.selectedPlayers === 1 ? "1 jogador" : "2 jogadores";
    ui.gameModeLabel.textContent = `Fase ${level.label.toLowerCase()} · ${playerText}`;
    ui.gameSubtitle.textContent = state.selectedPlayers === 1
        ? "Vire duas cartas por vez e encontre os carros iguais."
        : "Encontre os pares e marque pontos. Quem fizer mais, vence!";
    ui.playerTwoScore.classList.toggle("is-hidden", state.selectedPlayers === 1);
    ui.board.className = `board level-${state.selectedLevel}`;
}

export function animateBoard(stateClass) {
    ui.board.classList.remove("is-success", "is-error");
    void ui.board.offsetWidth;
    ui.board.classList.add(stateClass);
    window.setTimeout(() => ui.board.classList.remove(stateClass), 650);
}

export function renderBestScore() {
    const bestScore = getBestScore(state.selectedLevel);
    ui.bestScoreElement.textContent = bestScore
        ? `${bestScore.moves} / ${formatTime(bestScore.time)}`
        : "—";
}

function createCard(card, index, onFlip) {
    const button = document.createElement("button");
    button.className = "card";
    button.type = "button";
    button.dataset.name = card.name;
    button.dataset.index = index;
    button.setAttribute("role", "gridcell");
    button.setAttribute("aria-label", "Carta fechada");
    button.innerHTML = `
      <span class="card-face card-front" aria-hidden="true">▰</span>
      <span class="card-face card-back" aria-hidden="true">${card.emoji}</span>
    `;
    button.addEventListener("click", () => onFlip(button));
    return button;
}

export function renderBoard(onFlip) {
    ui.board.innerHTML = "";
    state.cards.forEach((card, index) => ui.board.appendChild(createCard(card, index, onFlip)));
}
