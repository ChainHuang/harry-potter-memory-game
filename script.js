// Harry Potter Memory Game Characters
const characters = [
    'harry', 'hermione', 'ron', 'dumbledore', 
    'snape', 'tomriddle', 'ginny', 'cedric', 
    'luna', 'draco', 'mcgonagall', 'grindelwald'
];

class MemoryGame {
    constructor() {
        this.cardsElement = document.getElementById('cards');
        this.movesElement = document.getElementById('moves-count');
        this.timeElement = document.getElementById('time');
        this.resultElement = document.getElementById('result');
        this.startButton = document.getElementById('start-btn');
        this.resetButton = document.getElementById('reset-btn');

        this.moves = 0;
        this.time = 0;
        this.timer = null;
        this.selectedCards = [];
        this.matchedPairs = 0;

        this.startButton.addEventListener('click', () => this.startGame());
        this.resetButton.addEventListener('click', () => this.resetGame());
    }

    generateCards() {
        // Duplicate characters to create pairs and shuffle
        const cardPairs = [...characters, ...characters]
            .sort(() => Math.random() - 0.5);

        this.cardsElement.innerHTML = '';
        cardPairs.forEach((character, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.character = character;

            const img = document.createElement('img');
            img.src = `images/${character}.jpg`;
            img.alt = character;
            img.style.opacity = '0';

            card.appendChild(img);
            card.addEventListener('click', () => this.flipCard(card));
            this.cardsElement.appendChild(card);
        });
    }

    flipCard(card) {
        // Prevent flipping already matched or currently selected cards
        if (card.classList.contains('matched') || 
            this.selectedCards.includes(card) || 
            this.selectedCards.length >= 2) return;

        card.classList.add('flipped');
        card.querySelector('img').style.opacity = '1';
        this.selectedCards.push(card);

        if (this.selectedCards.length === 2) {
            this.incrementMoves();
            this.checkMatch();
        }
    }

    checkMatch() {
        const [card1, card2] = this.selectedCards;
        const character1 = card1.dataset.character;
        const character2 = card2.dataset.character;

        if (character1 === character2) {
            // Match found
            card1.classList.add('matched');
            card2.classList.add('matched');
            this.matchedPairs++;

            if (this.matchedPairs === characters.length) {
                this.endGame(true);
            }
        } else {
            // No match, flip back after a short delay
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                card1.querySelector('img').style.opacity = '0';
                card2.querySelector('img').style.opacity = '0';
            }, 1000);
        }

        this.selectedCards = [];
    }

    incrementMoves() {
        this.moves++;
        this.movesElement.textContent = this.moves;
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.time++;
            const minutes = Math.floor(this.time / 60);
            const seconds = this.time % 60;
            this.timeElement.textContent = 
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    startGame() {
        this.resetGame();
        this.generateCards();
        this.startTimer();
        this.startButton.disabled = true;
    }

    resetGame() {
        // Clear existing game state
        clearInterval(this.timer);
        this.moves = 0;
        this.time = 0;
        this.matchedPairs = 0;
        this.selectedCards = [];

        // Reset UI elements
        this.movesElement.textContent = '0';
        this.timeElement.textContent = '00:00';
        this.resultElement.textContent = '';
        this.startButton.disabled = false;

        this.generateCards();
    }

    endGame(won) {
        clearInterval(this.timer);
        const resultMessage = won 
            ? `Congratulations! You won in ${this.moves} moves and ${this.time} seconds!`
            : 'Game Over';
        
        this.resultElement.textContent = resultMessage;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MemoryGame();
});
