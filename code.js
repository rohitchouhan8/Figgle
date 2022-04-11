// This is a counter widget with buttons to increment and decrement the number.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { widget } = figma;
const { useSyncedState, usePropertyMenu, AutoLayout, Text, SVG, Input, useSyncedMap } = widget;
const words = [
    'happy',
    'later',
    'sadly',
    'tweet',
    'right',
    'fruit',
    'dizzy',
    'adult',
    'bread',
    'chain',
    'green',
    'index',
    'knife',
    'shape',
    'sight',
    'smile',
    'river',
    'trial',
    'world',
    'eagle',
    'evens',
    'extra',
    'shady',
    'sizes',
    'seven',
    'laser',
    'adieu',
    'brief',
    'candy',
    'cargo',
    'cents',
    'chaos',
    'cheer',
    'pride',
    'silly',
    'siren',
    'couch',
    'trick',
    'hurry',
    'worry',
    'inbox',
    'quake',
].map((word) => word.toUpperCase());
const NUM_CHARS = 5;
const NUM_GUESSES = 6;
const lightGray = '#d1d5db';
const gray = '#374151';
const green = '#059669';
const yellow = '#eab308';
const text = '#ffffff';
const red = '#dc2626';
var GuessState;
(function (GuessState) {
    GuessState[GuessState["WRONG"] = 0] = "WRONG";
    GuessState[GuessState["WRONG_PLACE"] = 1] = "WRONG_PLACE";
    GuessState[GuessState["CORRECT"] = 2] = "CORRECT";
    GuessState[GuessState["NOT_GUESSED"] = 3] = "NOT_GUESSED";
})(GuessState || (GuessState = {}));
function Letter({ letter, color, onClick, }) {
    return (figma.widget.h(AutoLayout, { fill: color, width: 30, height: 30, horizontalAlignItems: "center", verticalAlignItems: "center", onClick: onClick ? () => onClick(letter) : undefined, cornerRadius: 4 },
        figma.widget.h(Text, { fontWeight: color === lightGray ? 500 : 800, fill: color === lightGray ? '#000' : text }, letter.toUpperCase())));
}
function getMappedLetters(guess, secretWord, guessedKeys) {
    const letters = guess.split('').map((s, i) => {
        let state;
        if (s === ' ') {
            state = GuessState.NOT_GUESSED;
        }
        else if (secretWord[i] === s) {
            state = GuessState.CORRECT;
        }
        else if (secretWord.includes(s)) {
            state = GuessState.WRONG_PLACE;
        }
        else {
            state = GuessState.WRONG;
        }
        return { letter: s, state, idx: i };
    });
    letters.forEach((l, i) => {
        guessedKeys.set(l.letter, l.state);
        if (l.state !== GuessState.WRONG_PLACE) {
            return;
        }
        const numCorrectLetters = secretWord.split('').filter((s) => s === l.letter).length;
        const numGuessedCorrectOrWrongPlaceLetters = letters.filter((l2) => (l2.state === GuessState.CORRECT || l2.state === GuessState.WRONG_PLACE) &&
            l2.letter === l.letter).length;
        if (numGuessedCorrectOrWrongPlaceLetters > numCorrectLetters) {
            letters[i].state = GuessState.WRONG;
            guessedKeys.set(l.letter, GuessState.WRONG);
        }
    });
    return letters;
}
function GuesedWord({ key, guess, secretWord, guessedKeys }) {
    return (figma.widget.h(AutoLayout, { key: key, padding: 2, spacing: 8, cornerRadius: 8 }, guess.map(({ state, letter }, i) => {
        let color;
        if (state === GuessState.NOT_GUESSED) {
            color = lightGray;
        }
        else if (state === GuessState.CORRECT) {
            color = green;
        }
        else if (state === GuessState.WRONG_PLACE) {
            color = yellow;
        }
        else {
            color = gray;
        }
        return figma.widget.h(Letter, { key: i, color: color, letter: letter });
    })));
}
const randomWord = words[Math.floor(Math.random() * words.length)];
function EmptyGuess({ key, guessedKeys }) {
    const emptyLetter = { letter: ' ', idx: 0, state: GuessState.NOT_GUESSED };
    return (figma.widget.h(GuesedWord, { key: key, guess: [emptyLetter, emptyLetter, emptyLetter, emptyLetter, emptyLetter], secretWord: 'aaaaa', guessedKeys: guessedKeys }));
}
function KeyBoard({ guessedKeys, onClick, }) {
    function Key({ letter }) {
        let color;
        const state = guessedKeys.get(letter.toUpperCase());
        if (state === GuessState.WRONG) {
            color = gray;
        }
        else if (state === GuessState.WRONG_PLACE) {
            color = yellow;
        }
        else if (state === GuessState.CORRECT) {
            color = green;
        }
        else {
            color = lightGray;
        }
        return figma.widget.h(Letter, { color: color, letter: letter, onClick: onClick });
    }
    function KeyRow({ letters }) {
        return (figma.widget.h(AutoLayout, { horizontalAlignItems: "center", verticalAlignItems: "center", cornerRadius: 8, padding: 4, spacing: 4 }, letters.map((letter, i) => (figma.widget.h(Key, { key: i, letter: letter })))));
    }
    return (figma.widget.h(AutoLayout, { direction: "vertical", horizontalAlignItems: "center", spacing: 2 },
        figma.widget.h(KeyRow, { letters: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'] }),
        figma.widget.h(KeyRow, { letters: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'] }),
        figma.widget.h(AutoLayout, { spacing: 4 },
            figma.widget.h(KeyRow, { letters: ['z', 'x', 'c', 'v', 'b', 'n', 'm'] }),
            figma.widget.h(KeyRow, { letters: ['↵'] }))));
}
function Widget() {
    const [input, setInput] = useSyncedState('textEnd', '');
    const [secretWord, setSecretWord] = useSyncedState('secretWord', randomWord);
    const [guesses, setGuesses] = useSyncedState('guesses', []);
    const [emptyGuesses, setEmptyGuesses] = useSyncedState('emptyGuesses', [...Array(NUM_GUESSES)]);
    const [message, setMessage] = useSyncedState('message', '');
    const [msgColor, setMsgColor] = useSyncedState('msgColor', '');
    const guessedKeys = useSyncedMap('guessedKeys');
    const id = widget.useWidgetId();
    usePropertyMenu([
        {
            itemType: 'action',
            tooltip: 'Reset',
            propertyName: 'reset',
        },
    ], (e) => {
        if (e.propertyName === 'reset') {
            setGuesses([]);
            const idx = words.indexOf(secretWord) || 0;
            setSecretWord(words[idx + (1 % words.length)]);
            setMessage('');
            guessedKeys.keys().forEach((k) => guessedKeys.delete(k));
        }
    });
    function showIframe() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve) => {
                figma.showUI(`
    ${__html__}
  `, {
                    width: 400,
                    height: 519,
                });
            });
        });
    }
    function onSubmit(characters) {
        const guess = characters.toUpperCase();
        if (guesses.length === NUM_GUESSES) {
            return;
        }
        if (guess.length !== NUM_CHARS) {
            setMessage(`Guess must be ${NUM_CHARS} letters long.`);
            setMsgColor(red);
            return;
        }
        const mappedGuess = getMappedLetters(guess, secretWord, guessedKeys);
        setInput('');
        setGuesses([...guesses, mappedGuess]);
        setMessage('');
        if (guess === secretWord) {
            setMessage('Good job you beat Figgle!');
            setMsgColor(green);
            return;
        }
        if (guesses.length + 1 >= NUM_GUESSES) {
            setMessage(`The right answer is ${secretWord}`);
            setMsgColor(red);
            return;
        }
    }
    return (figma.widget.h(AutoLayout, { verticalAlignItems: 'center', horizontalAlignItems: "center", spacing: 8, padding: 16, cornerRadius: 8, fill: '#fff', stroke: gray, direction: 'vertical' },
        figma.widget.h(AutoLayout, { verticalAlignItems: "center", spacing: 8 },
            figma.widget.h(Text, { fontSize: 24, fontFamily: "Roboto Mono", fontWeight: 700 }, "Figgle"),
            figma.widget.h(AutoLayout, { width: 24, height: 24, cornerRadius: 100, fill: gray, horizontalAlignItems: "center", verticalAlignItems: "center", onClick: showIframe, tooltip: "Show instructions" },
                figma.widget.h(Text, { fill: text }, "?"))),
        figma.widget.h(AutoLayout, { direction: "vertical", spacing: 4, horizontalAlignItems: "center" },
            guesses.map((g, i) => (figma.widget.h(GuesedWord, { key: i, guess: g, secretWord: secretWord, guessedKeys: guessedKeys }))),
            emptyGuesses.map((_, i) => i < NUM_GUESSES - guesses.length ? (figma.widget.h(EmptyGuess, { key: i, guessedKeys: guessedKeys })) : null),
            figma.widget.h(Input, { value: input, placeholder: 'Type a guess', onTextEditEnd: (e) => {
                    onSubmit(e.characters);
                }, width: 'fill-parent', placeholderProps: {
                    fill: gray,
                    opacity: 1,
                    letterSpacing: 0,
                }, fontWeight: 800, inputFrameProps: {
                    stroke: gray,
                    padding: {
                        top: 12,
                        bottom: 12,
                        left: 8,
                        right: 8,
                    },
                    cornerRadius: 8,
                } })),
        figma.widget.h(Text, { fill: msgColor }, message !== null && message !== void 0 ? message : ' '),
        figma.widget.h(KeyBoard, { guessedKeys: guessedKeys, onClick: (letter) => {
                letter === '↵' ? onSubmit(input) : setInput(input + letter);
            } })));
}
widget.register(Widget);
