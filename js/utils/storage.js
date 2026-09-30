const BEST_SCORE_PREFIX = "memoria-motor-best";

export function getBestScore(level) {
    try {
        const storedScore = localStorage.getItem(`${BEST_SCORE_PREFIX}-${level}`);
        return storedScore ? JSON.parse(storedScore) : null;
    } catch {
        return null;
    }
}

export function saveBestScore(selectedPlayers, selectedLevel, moves, seconds) {
    if (selectedPlayers !== 1) return;

    const currentScore = { moves, time: seconds };
    const bestScore = getBestScore(selectedLevel);
    const isNewBest =
        !bestScore ||
        currentScore.moves < bestScore.moves ||
        (currentScore.moves === bestScore.moves && currentScore.time < bestScore.time);

    if (isNewBest) {
        localStorage.setItem(
            `${BEST_SCORE_PREFIX}-${selectedLevel}`,
            JSON.stringify(currentScore),
        );
    }
}
