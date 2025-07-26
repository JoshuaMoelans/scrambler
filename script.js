// Scrambling function
function scrambleText(text) {
    const words = text.split(' ');
    let scrambled = words.map(word => {
        // Handle hyphenated words by splitting on hyphens
        if (word.includes('-')) {
            const parts = word.split('-');
            const scrambledParts = parts.map(part => scrambleWord(part));
            return scrambledParts.join('-');
        } else {
            return scrambleWord(word);
        }
    });
    return scrambled.join(' ');
}

// Helper function to scramble a single word
function scrambleWord(word) {
    if (word.length <= 3) return word; // No scrambling for short words

    // Extract punctuation from the end of the word
    const punctuationMatch = word.match(/^(.+?)([.!?,:;'`"]*?)$/);
    const letters = punctuationMatch ? punctuationMatch[1] : word;
    const punctuation = punctuationMatch ? punctuationMatch[2] : '';

    // TODO add proper way to handle words with multiple punctuation marks (e.g. `'No!'` -> should never get scrambled)

    if (letters.length <= 3) return word; // No scrambling if letters part is too short
    
    const chars = letters.split('');
    // Only scramble the middle characters (keep first and last)
    for (let i = chars.length - 2; i > 1; i--) {
        const j = Math.floor(Math.random() * (i - 1)) + 1;
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join('') + punctuation;
}

// Function to create hoverable output with word highlighting
function createHoverableOutput(inputText, scrambledText) {
    const inputWords = inputText.split(' ');
    const scrambledWords = scrambledText.split(' ');
    
    // Create spans for each scrambled word with data attributes
    const hoverableOutput = scrambledWords.map((word, index) => {
        return `<span class="hoverable-word" data-word-index="${index}">${word}</span>`;
    }).join(' ');
    
    return hoverableOutput;
}

// Function to highlight word in input text
function highlightInputWord(inputText, wordIndex) {
    const words = inputText.split(' ');
    return words.map((word, index) => {
        if (index === wordIndex) {
            return `<span class="highlighted-word">${word}</span>`;
        }
        return word;
    }).join(' ');
}

// Function to remove all highlights from input text
function removeHighlights(text) {
    return text.replace(/<span class="highlighted-word">(.*?)<\/span>/g, '$1');
}

// Event listeners - only set up in browser environment
if (typeof document !== 'undefined') {
    let currentInputText = '';
    
    document.getElementById('scrambleButton').addEventListener('click', function() {
        const inputElement = document.getElementById('inputText');
        inputElement.textContent = inputElement.textContent || inputElement.dataset.placeholder;
        let inputText = inputElement.textContent || inputElement.dataset.placeholder;
        currentInputText = inputText; // Store for hover functionality
        const scrambledText = scrambleText(inputText);
        
        // Create hoverable output and set as innerHTML
        const outputElement = document.getElementById('outputText');
        const hoverableOutput = createHoverableOutput(inputText, scrambledText);
        outputElement.innerHTML = hoverableOutput;
        
        // Add hover event listeners to each word span
        const hoverableWords = outputElement.querySelectorAll('.hoverable-word');
        hoverableWords.forEach(span => {
            span.addEventListener('mouseenter', function() {
                const wordIndex = parseInt(this.dataset.wordIndex);
                const highlightedInput = highlightInputWord(currentInputText, wordIndex);
                inputElement.innerHTML = highlightedInput;
            });
            
            span.addEventListener('mouseleave', function() {
                inputElement.innerHTML = currentInputText; // Restore original text
            });
        });
    });

    document.getElementById('beeButton').addEventListener('click', function() {
        const altText = "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black.";
        const inputElement = document.getElementById('inputText');
        inputElement.textContent = altText;
        document.getElementById('scrambleButton').click();
    });

    document.getElementById('duneButton').addEventListener('click', function() {
        const altText = "I must not fear. Fear is the mind-killer. Fear is the little-death that brings total obliteration. I will face my fear. I will permit it to pass over me and through me. And when it has gone past I will turn the inner eye to see its path. Where the fear has gone there will be nothing. Only I will remain.";
        const inputElement = document.getElementById('inputText');
        inputElement.textContent = altText;
        document.getElementById('scrambleButton').click();
    });

    document.getElementById('bioshockButton').addEventListener('click', function() {
        const altText = "I am Andrew Ryan, and I’m here to ask you a question. Is a man not entitled to the sweat of his brow? ‘No!’ says the man in Washington, ‘It belongs to the poor.’ ‘No!’ says the man in the Vatican, ‘It belongs to God.’ ‘No!’ says the man in Moscow, ‘It belongs to everyone.’ I rejected those answers; instead, I chose something different. I chose the impossible. I chose… Rapture, a city where the artist would not fear the censor, where the scientist would not be bound by petty morality, Where the great would not be constrained by the small! And with the sweat of your brow, Rapture can become your city as well.";
        const inputElement = document.getElementById('inputText');
        inputElement.textContent = altText;
        document.getElementById('scrambleButton').click();
    });

    document.getElementById('inputText').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default Enter behavior (new line)
            document.getElementById('scrambleButton').click();
        }
    });
}

// Export for Node.js if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { scrambleText, scrambleWord };
}
