export const FALLBACK_CARDS = [
    { name: "Carro esportivo", emoji: "🏎️" },
    { name: "Carro clássico", emoji: "🚗" },
    { name: "Táxi", emoji: "🚕" },
    { name: "SUV", emoji: "🚙" },
    { name: "Ônibus", emoji: "🚌" },
    { name: "Carro de polícia", emoji: "🚓" },
    { name: "Ambulância", emoji: "🚑" },
    { name: "Caminhão de bombeiros", emoji: "🚒" },
    { name: "Caminhão", emoji: "🚚" },
    { name: "Picape", emoji: "🛻" },
    { name: "Minivan", emoji: "🚐" },
    { name: "Sedã", emoji: "🚘" },
];

let cardTypes = [];

export async function initCards() {
    try {
        const response = await fetch("../../data/packeage.json");
        if (!response.ok) throw new Error("Não foi possível carregar cards.json");
        const data = await response.json();
        cardTypes = data.cards;
    } catch (error) {
        console.warn("Usando cartas padrão:", error.message);
        cardTypes = FALLBACK_CARDS;
    }
}

export function getCards() {
    return cardTypes;
}