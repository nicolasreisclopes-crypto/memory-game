export const LEVELS = {
    iniciante: { label: "Iniciante", pairs: 6 },
    intermediario: { label: "Intermediário", pairs: 8 },
    avancado: { label: "Avançado", pairs: 12 },
};

export const state = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    seconds: 0,
    gameStarted: false,
    lockBoard: false,
    selectedLevel: "iniciante",
    selectedPlayers: 1,
    currentPlayer: 0,
    playerScores: [0, 0]
};

export function resetState() {
    state.cards = [];
    state.flippedCards = [];
    state.matchedPairs = 0;
    state.moves = 0;
    state.seconds = 0;
    state.currentPlayer = 0;
    state.playerScores = [0, 0];
    state.gameStarted = false;
    state.lockBoard = false;
}
