import { initCards, getCards } from './utils/cards.js';
import { shuffle, formatTime } from './utils/helpers.js';
import { getBestScore, saveBestScore } from './utils/storage.js';
import { ui } from './ui/elements.js';
import { 
    updateStats, 
    updateModeText, 
    renderBoard, 
    animateBoard, 
    renderBestScore 
} from './ui/render.js';
import { state, resetState, LEVELS } from './game/state.js';

let timerId = null;

function startTimer() {
    if (timerId) return;
    timerId = window.setInterval(() => {
        state.seconds += 1;
        ui.timerElement.textContent = formatTime(state.seconds);
    }, 1000);
}

function stopTimer() {
    window.clearInterval(timerId);
    timerId = null;
}

function flipCard(cardElement) {
    if (
        state.lockBoard ||
        cardElement.classList.contains("is-flipped") ||
        cardElement.classList.contains("is-matched")
    ) {
        return;
    }

    if (!state.gameStarted) {
        state.gameStarted = true;
        startTimer();
        ui.gameMessage.textContent = state.selectedPlayers === 1
            ? "Boa corrida. Continue procurando!"
            : `Valendo! É a vez do Jogador ${state.currentPlayer + 1}.`;
    }

    cardElement.classList.add("is-flipped");
    cardElement.setAttribute("aria-label", `Carta: ${cardElement.dataset.name}`);
    state.flippedCards.push(cardElement);

    if (state.flippedCards.length !== 2) return;

    state.moves += 1;
    updateStats();
    checkMatch();
}

function checkMatch() {
    const [firstCard, secondCard] = state.flippedCards;
    const isMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (isMatch) {
        animateBoard("is-success");
        firstCard.classList.add("is-matched");
        secondCard.classList.add("is-matched");
        firstCard.disabled = true;
        secondCard.disabled = true;
        state.matchedPairs += 1;
        state.playerScores[state.currentPlayer] += 1;
        state.flippedCards = [];
        updateStats();

        ui.gameMessage.textContent = state.matchedPairs === state.cards.length / 2
            ? "Perfeito! Todos os pares foram encontrados."
            : state.selectedPlayers === 1
                ? "Par encontrado! Continue assim."
                : `Par encontrado! O Jogador ${state.currentPlayer + 1} joga novamente.`;

        if (state.matchedPairs === state.cards.length / 2) {
            finishGame();
        }
        return;
    }

    animateBoard("is-error");
    state.lockBoard = true;
    ui.gameMessage.textContent = state.selectedPlayers === 1
        ? "Quase! Tente mais uma vez."
        : `Não foi dessa vez. A vez passa para o Jogador ${state.currentPlayer === 0 ? 2 : 1}.`;

    window.setTimeout(() => {
        firstCard.classList.remove("is-flipped");
        secondCard.classList.remove("is-flipped");
        firstCard.setAttribute("aria-label", "Carta fechada");
        secondCard.setAttribute("aria-label", "Carta fechada");
        state.flippedCards = [];

        if (state.selectedPlayers === 2) {
            state.currentPlayer = state.currentPlayer === 0 ? 1 : 0;
            updateStats();
            ui.gameMessage.textContent = `Agora é a vez do Jogador ${state.currentPlayer + 1}.`;
        }

        state.lockBoard = false;
    }, 850);
}

function finishGame() {
    stopTimer();
    saveBestScore(state.selectedPlayers, state.selectedLevel, state.moves, state.seconds);
    renderBestScore(); // Refresh UI after saving if needed

    ui.finalTimeElement.textContent = formatTime(state.seconds);
    ui.finalMovesElement.textContent = `${state.moves} ${state.moves === 1 ? "jogada" : "jogadas"}`;

    if (state.selectedPlayers === 1) {
        ui.winTitle.textContent = "Você encontrou todos!";
        ui.finalScoreElement.textContent = `Pontuação: ${state.playerScores[0]} pares`;
    } else {
        const [scoreOne, scoreTwo] = state.playerScores;
        const winner = scoreOne === scoreTwo
            ? "Empate! Que corrida equilibrada."
            : `Jogador ${scoreOne > scoreTwo ? 1 : 2} venceu a disputa!`;
        ui.winTitle.textContent = winner;
        ui.finalScoreElement.textContent = `Placar final: Jogador 1 ${scoreOne} × ${scoreTwo} Jogador 2`;
    }

    ui.winModal.classList.add("is-visible");
    ui.winModal.setAttribute("aria-hidden", "false");
    window.setTimeout(() => ui.playAgainButton.focus(), 100);
}

function startGame() {
    const level = LEVELS[state.selectedLevel];
    const cardTypes = getCards();
    const selectedTypes = cardTypes.slice(0, level.pairs);

    resetState();
    state.cards = shuffle(selectedTypes.flatMap((card) => [card, card]));

    stopTimer();
    updateModeText();
    updateStats();
    renderBestScore();
    renderBoard(flipCard); // pass the callback 
    ui.gameMessage.textContent = state.selectedPlayers === 1
        ? "Boa sorte. Você consegue!"
        : "Jogador 1 começa. Boa sorte!";
    ui.setupScreen.classList.add("is-hidden");
    ui.gameScreen.classList.remove("is-hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function showSetup() {
    stopTimer();
    ui.winModal.classList.remove("is-visible");
    ui.winModal.setAttribute("aria-hidden", "true");
    ui.gameScreen.classList.add("is-hidden");
    ui.setupScreen.classList.remove("is-hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function selectOption(button, selector) {
    document.querySelectorAll(selector).forEach((option) => {
        const isSelected = option === button;
        option.classList.toggle("is-selected", isSelected);
        option.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });
}

// Event Listeners
document.querySelectorAll("[data-level]").forEach((button) => {
    button.addEventListener("click", () => {
        state.selectedLevel = button.dataset.level;
        selectOption(button, "[data-level]");
    });
});

document.querySelectorAll("[data-players]").forEach((button) => {
    button.addEventListener("click", () => {
        state.selectedPlayers = Number(button.dataset.players);
        selectOption(button, "[data-players]");
    });
});

ui.startButton.addEventListener("click", startGame);
ui.restartButton.addEventListener("click", showSetup);
ui.playAgainButton.addEventListener("click", startGame);

// Init
ui.startButton.disabled = true;
initCards().then(() => {
    ui.startButton.disabled = false;
});
