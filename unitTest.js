// Unit tests for the scrambler functionality
// This file tests the scrambleText function to ensure it works correctly

// Import the scrambleText function from script.js
let scrambleText, scrambleWord;

// Try to import in Node.js environment
if (typeof require !== 'undefined') {
    try {
        const scriptModule = require('./script.js');
        scrambleText = scriptModule.scrambleText;
        scrambleWord = scriptModule.scrambleWord;
    } catch (error) {
        console.error('Could not import script.js:', error);
        process.exit(1);
    }
} else {
    // In browser environment, the function should be available globally from script.js
    if (typeof window !== 'undefined' && window.scrambleText) {
        scrambleText = window.scrambleText;
        scrambleWord = window.scrambleWord;
    } else {
        console.error('scrambleText function not found. Make sure script.js is loaded.');
    }
}

// Test helper functions
function assert(condition, message) {
    if (!condition) {
        console.error(`❌ Test failed: ${message}`);
        return false;
    }
    console.log(`✅ Test passed: ${message}`);
    return true;
}

function getLettersOnly(word) {
    // Remove punctuation to get just the letters
    const match = word.match(/^(.+?)([.!?,:;'"]*?)$/);
    return match ? match[1] : word;
}

// Test functions
function testShortWordsNotScrambled() {
    console.log('\n--- Testing Short Words (≤3 characters) ---');
    const shortWords = ['I', 'am', 'the', 'cat', 'dog', 'run', 'is', 'a'];
    let allPassed = true;
    
    shortWords.forEach(word => {
        const scrambled = scrambleText(word);
        const passed = assert(scrambled === word, 
            `Short word "${word}" should not be scrambled, got "${scrambled}"`);
        allPassed = allPassed && passed;
    });
    
    return allPassed;
}

function testFirstLastLetterPreserved() {
    console.log('\n--- Testing First/Last Letter Preservation ---');
    const longWords = ['hello', 'world', 'scrambling', 'university', 'researcher', 'important'];
    let allPassed = true;
    
    longWords.forEach(word => {
        // Test multiple times since scrambling is random
        for (let i = 0; i < 10; i++) {
            const scrambled = scrambleText(word);
            const scrambledLetters = getLettersOnly(scrambled);
            
            const firstMatch = assert(word[0] === scrambledLetters[0], 
                `First letter of "${word}" should be preserved. Got "${scrambledLetters}"`);
            const lastMatch = assert(word[word.length - 1] === scrambledLetters[scrambledLetters.length - 1], 
                `Last letter of "${word}" should be preserved. Got "${scrambledLetters}"`);
            const lengthMatch = assert(word.length === scrambledLetters.length, 
                `Length of "${word}" should be preserved. Original: ${word.length}, Scrambled: ${scrambledLetters.length}`);
            
            allPassed = allPassed && firstMatch && lastMatch && lengthMatch;
            
            if (!firstMatch || !lastMatch || !lengthMatch) break;
        }
    });
    
    return allPassed;
}

function testPunctuationPreserved() {
    console.log('\n--- Testing Punctuation Preservation ---');
    const wordsWithPunctuation = ['hello,', 'world!', 'researcher.', 'important?', 'university;', 'scrambling:'];
    let allPassed = true;
    
    wordsWithPunctuation.forEach(word => {
        const scrambled = scrambleText(word);
        const originalPunctuation = word.match(/[.!?,:;'"]+$/);
        const scrambledPunctuation = scrambled.match(/[.!?,:;'"]+$/);
        
        const punctuationMatch = assert(
            (originalPunctuation && scrambledPunctuation && originalPunctuation[0] === scrambledPunctuation[0]) ||
            (!originalPunctuation && !scrambledPunctuation),
            `Punctuation should be preserved for "${word}". Got "${scrambled}"`
        );
        
        allPassed = allPassed && punctuationMatch;
    });
    
    return allPassed;
}

function testSentenceScrambling() {
    console.log('\n--- Testing Sentence Scrambling ---');
    const sentence = "According to a researcher at Cambridge University, it doesn't matter.";
    const scrambled = scrambleText(sentence);
    const originalWords = sentence.split(' ');
    const scrambledWords = scrambled.split(' ');
    
    let allPassed = true;
    
    // Check that word count is preserved
    const wordCountMatch = assert(originalWords.length === scrambledWords.length, 
        `Word count should be preserved. Original: ${originalWords.length}, Scrambled: ${scrambledWords.length}`);
    allPassed = allPassed && wordCountMatch;
    
    // Check each word individually
    for (let i = 0; i < originalWords.length; i++) {
        const originalWord = originalWords[i];
        const scrambledWord = scrambledWords[i];
        const originalLetters = getLettersOnly(originalWord);
        const scrambledLetters = getLettersOnly(scrambledWord);
        
        if (originalLetters.length <= 3) {
            // Short words should not be scrambled
            const shortWordMatch = assert(originalWord === scrambledWord, 
                `Short word "${originalWord}" should not be scrambled. Got "${scrambledWord}"`);
            allPassed = allPassed && shortWordMatch;
        } else {
            // Long words should preserve first/last letters
            const firstLetterMatch = assert(originalLetters[0] === scrambledLetters[0], 
                `First letter of "${originalWord}" should be preserved in "${scrambledWord}"`);
            const lastLetterMatch = assert(originalLetters[originalLetters.length - 1] === scrambledLetters[scrambledLetters.length - 1], 
                `Last letter of "${originalWord}" should be preserved in "${scrambledWord}"`);
            
            allPassed = allPassed && firstLetterMatch && lastLetterMatch;
        }
    }
    
    console.log(`Original: "${sentence}"`);
    console.log(`Scrambled: "${scrambled}"`);
    
    return allPassed;
}

function testEdgeCases() {
    console.log('\n--- Testing Edge Cases ---');
    let allPassed = true;
    
    // Empty string
    const emptyTest = assert(scrambleText('') === '', 'Empty string should return empty string');
    allPassed = allPassed && emptyTest;
    
    // Single character
    const singleCharTest = assert(scrambleText('a') === 'a', 'Single character should not be scrambled');
    allPassed = allPassed && singleCharTest;
    
    // Only punctuation
    const punctuationTest = assert(scrambleText('...') === '...', 'Only punctuation should not be scrambled');
    allPassed = allPassed && punctuationTest;
    
    // Mixed short and long words
    const mixedText = 'I love programming with JavaScript';
    const mixedScrambled = scrambleText(mixedText);
    console.log(`Mixed text: "${mixedText}" -> "${mixedScrambled}"`);
    
    return allPassed;
}

function testHyphenatedWords() {
    console.log('\n--- Testing Hyphenated Words ---');
    let allPassed = true;
    
    // Test cases for hyphenated words
    const hyphenatedTests = [
        { word: 'mind-killer', shouldScramble: [true, true] },
        { word: 'red-hot', shouldScramble: [false, false] }, // Both parts too short
        { word: 'self-aware', shouldScramble: [true, true] },
        { word: 'co-op', shouldScramble: [false, false] }, // Both parts too short
        { word: 'well-being', shouldScramble: [true, true] },
        { word: 'x-ray', shouldScramble: [false, false] }, // Both parts too short
        { word: 'twenty-five', shouldScramble: [true, true] },
        { word: 'hi-tech', shouldScramble: [false, true] }, // First part short, second long
        { word: 'state-of-the-art', shouldScramble: [true, false, false, false] } // Multi-hyphen
    ];
    
    hyphenatedTests.forEach(test => {
        // Test multiple times due to randomness
        for (let i = 0; i < 5; i++) {
            const scrambled = scrambleText(test.word);
            const originalParts = test.word.split('-');
            const scrambledParts = scrambled.split('-');
            
            // Check that hyphen structure is preserved
            const hyphenCountMatch = assert(
                originalParts.length === scrambledParts.length,
                `Hyphen count should be preserved for "${test.word}". Got "${scrambled}"`
            );
            allPassed = allPassed && hyphenCountMatch;
            
            if (!hyphenCountMatch) break;
            
            // Check each part individually
            for (let j = 0; j < originalParts.length; j++) {
                const originalPart = originalParts[j];
                const scrambledPart = scrambledParts[j];
                const shouldScramble = test.shouldScramble[j];
                
                if (shouldScramble) {
                    // Long parts should preserve first and last letter
                    const firstLetterMatch = assert(
                        originalPart[0] === scrambledPart[0],
                        `First letter of "${originalPart}" in "${test.word}" should be preserved. Got "${scrambledPart}"`
                    );
                    const lastLetterMatch = assert(
                        originalPart[originalPart.length - 1] === scrambledPart[scrambledPart.length - 1],
                        `Last letter of "${originalPart}" in "${test.word}" should be preserved. Got "${scrambledPart}"`
                    );
                    const lengthMatch = assert(
                        originalPart.length === scrambledPart.length,
                        `Length of "${originalPart}" in "${test.word}" should be preserved. Got "${scrambledPart}"`
                    );
                    
                    allPassed = allPassed && firstLetterMatch && lastLetterMatch && lengthMatch;
                } else {
                    // Short parts should not be scrambled
                    const noScrambleMatch = assert(
                        originalPart === scrambledPart,
                        `Short part "${originalPart}" in "${test.word}" should not be scrambled. Got "${scrambledPart}"`
                    );
                    allPassed = allPassed && noScrambleMatch;
                }
            }
            
            if (!allPassed) break;
        }
        
        console.log(`✅ Hyphenated word test: "${test.word}" -> scrambled correctly`);
    });
    
    // Test sentence with hyphenated words
    const sentence = "The mind-killer is a well-being state-of-the-art technique.";
    const scrambledSentence = scrambleText(sentence);
    console.log(`Hyphenated sentence: "${sentence}"`);
    console.log(`Scrambled sentence: "${scrambledSentence}"`);
    
    return allPassed;
}

// Run all tests
function runAllTests() {
    console.log('🧪 Running Scrambler Unit Tests 🧪');
    console.log('=====================================');
    
    const testResults = [
        testShortWordsNotScrambled(),
        testFirstLastLetterPreserved(),
        testPunctuationPreserved(),
        testSentenceScrambling(),
        testHyphenatedWords(),
        testEdgeCases()
    ];
    
    const passedTests = testResults.filter(result => result).length;
    const totalTests = testResults.length;
    
    console.log('\n=====================================');
    console.log(`📊 Test Results: ${passedTests}/${totalTests} test suites passed`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! The scrambler function is working correctly.');
    } else {
        console.log('❌ Some tests failed. Please check the implementation.');
    }
    
    return passedTests === totalTests;
}

// Run tests if this file is executed directly (in Node.js)
if (typeof require !== 'undefined' && require.main === module) {
    // Running in Node.js directly
    runAllTests();
} else if (typeof module !== 'undefined' && module.exports) {
    // Being imported as a module
    module.exports = { scrambleText, runAllTests };
} else {
    // Run tests immediately if in browser
    runAllTests();
}
