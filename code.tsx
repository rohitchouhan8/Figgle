// This is a counter widget with buttons to increment and decrement the number.

const { widget } = figma
const { useSyncedState, usePropertyMenu, AutoLayout, Text, SVG, Input, useSyncedMap } = widget

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
].map((word) => word.toUpperCase())

const NUM_CHARS = 5
const NUM_GUESSES = 6

const lightGray = '#d1d5db'
const gray = '#374151'
const green = '#059669'
const yellow = '#eab308'
const text = '#ffffff'
const red = '#dc2626'

interface GuessedWordProps {
  guess: GuessLetter[]
  secretWord: string
  key: number
  guessedKeys: SyncedMap
}

enum GuessState {
  WRONG,
  WRONG_PLACE,
  CORRECT,
  NOT_GUESSED,
}

type GuessLetter = {
  letter: string
  idx: number
  state: GuessState
}

type Guess = GuessLetter[]

function Letter({
  letter,
  color,
  onClick,
}: {
  letter: string
  color: string
  onClick?: (letter: string) => void
}) {
  return (
    <AutoLayout
      fill={color}
      width={30}
      height={30}
      horizontalAlignItems="center"
      verticalAlignItems="center"
      onClick={onClick ? () => onClick(letter) : undefined}
      cornerRadius={4}
    >
      <Text fontWeight={color === lightGray ? 500 : 800} fill={color === lightGray ? '#000' : text}>
        {letter.toUpperCase()}
      </Text>
    </AutoLayout>
  )
}

function getMappedLetters(guess: string, secretWord: string, guessedKeys: SyncedMap) {
  const letters = guess.split('').map((s, i) => {
    let state: GuessState
    if (s === ' ') {
      state = GuessState.NOT_GUESSED
    } else if (secretWord[i] === s) {
      state = GuessState.CORRECT
    } else if (secretWord.includes(s)) {
      state = GuessState.WRONG_PLACE
    } else {
      state = GuessState.WRONG
    }
    return { letter: s, state, idx: i }
  })
  letters.forEach((l, i) => {
    guessedKeys.set(l.letter, l.state)
    if (l.state !== GuessState.WRONG_PLACE) {
      return
    }
    const numCorrectLetters = secretWord.split('').filter((s) => s === l.letter).length
    const numGuessedCorrectOrWrongPlaceLetters = letters.filter(
      (l2) =>
        (l2.state === GuessState.CORRECT || l2.state === GuessState.WRONG_PLACE) &&
        l2.letter === l.letter,
    ).length
    if (numGuessedCorrectOrWrongPlaceLetters > numCorrectLetters) {
      letters[i].state = GuessState.WRONG
      guessedKeys.set(l.letter, GuessState.WRONG)
    }
  })
  return letters
}

function GuesedWord({ key, guess, secretWord, guessedKeys }: GuessedWordProps) {
  return (
    <AutoLayout key={key} padding={2} spacing={8} cornerRadius={8}>
      {guess.map(({ state, letter }, i) => {
        let color: string
        if (state === GuessState.NOT_GUESSED) {
          color = lightGray
        } else if (state === GuessState.CORRECT) {
          color = green
        } else if (state === GuessState.WRONG_PLACE) {
          color = yellow
        } else {
          color = gray
        }
        return <Letter key={i} color={color} letter={letter} />
      })}
    </AutoLayout>
  )
}

const randomWord = words[Math.floor(Math.random() * words.length)]

function EmptyGuess({ key, guessedKeys }: { key: number; guessedKeys: SyncedMap }) {
  const emptyLetter = { letter: ' ', idx: 0, state: GuessState.NOT_GUESSED }
  return (
    <GuesedWord
      key={key}
      guess={[emptyLetter, emptyLetter, emptyLetter, emptyLetter, emptyLetter]}
      secretWord={'aaaaa'}
      guessedKeys={guessedKeys}
    ></GuesedWord>
  )
}

function KeyBoard({
  guessedKeys,
  onClick,
}: {
  guessedKeys: SyncedMap
  onClick: (letter: string) => void
}) {
  function Key({ letter }: { letter: string }) {
    let color: string
    const state = guessedKeys.get(letter.toUpperCase())
    if (state === GuessState.WRONG) {
      color = gray
    } else if (state === GuessState.WRONG_PLACE) {
      color = yellow
    } else if (state === GuessState.CORRECT) {
      color = green
    } else {
      color = lightGray
    }
    return <Letter color={color} letter={letter} onClick={onClick} />
  }
  function KeyRow({ letters }: { letters: string[] }) {
    return (
      <AutoLayout
        horizontalAlignItems="center"
        verticalAlignItems="center"
        cornerRadius={8}
        padding={4}
        spacing={4}
      >
        {letters.map((letter, i) => (
          <Key key={i} letter={letter}></Key>
        ))}
      </AutoLayout>
    )
  }

  return (
    <AutoLayout direction="vertical" horizontalAlignItems="center" spacing={2}>
      <KeyRow letters={['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']} />
      <KeyRow letters={['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']} />
      <AutoLayout spacing={4}>
        <KeyRow letters={['z', 'x', 'c', 'v', 'b', 'n', 'm']} />
        <KeyRow letters={['↵']} />
      </AutoLayout>
    </AutoLayout>
  )
}

function Widget() {
  const [input, setInput] = useSyncedState('textEnd', '')
  const [secretWord, setSecretWord] = useSyncedState('secretWord', randomWord)

  const [guesses, setGuesses] = useSyncedState<Guess[]>('guesses', [])
  const [emptyGuesses, setEmptyGuesses] = useSyncedState('emptyGuesses', [...Array(NUM_GUESSES)])

  const [message, setMessage] = useSyncedState('message', '')
  const [msgColor, setMsgColor] = useSyncedState('msgColor', '')

  const guessedKeys = useSyncedMap('guessedKeys')

  const id = widget.useWidgetId()

  usePropertyMenu(
    [
      {
        itemType: 'action',
        tooltip: 'Reset',
        propertyName: 'reset',
      },
    ],
    (e) => {
      if (e.propertyName === 'reset') {
        setGuesses([])
        const idx = words.indexOf(secretWord) || 0
        setSecretWord(words[idx + (1 % words.length)])
        setMessage('')
        guessedKeys.keys().forEach((k) => guessedKeys.delete(k))
      }
    },
  )

  async function showIframe() {
    await new Promise((resolve) => {
      figma.showUI(
        `
    ${__html__}
  `,
        {
          width: 400,
          height: 519,
        },
      )
    })
  }

  function onSubmit(characters: string) {
    const guess = characters.toUpperCase()
    if (guesses.length === NUM_GUESSES) {
      return
    }
    if (guess.length !== NUM_CHARS) {
      setMessage(`Guess must be ${NUM_CHARS} letters long.`)
      setMsgColor(red)
      return
    }

    const mappedGuess = getMappedLetters(guess, secretWord, guessedKeys)

    setInput('')

    setGuesses([...guesses, mappedGuess])
    setMessage('')

    if (guess === secretWord) {
      setMessage('Good job you beat Figgle!')
      setMsgColor(green)
      return
    }

    if (guesses.length + 1 >= NUM_GUESSES) {
      setMessage(`The right answer is ${secretWord}`)
      setMsgColor(red)
      return
    }
  }
  return (
    <AutoLayout
      verticalAlignItems={'center'}
      horizontalAlignItems="center"
      spacing={8}
      padding={16}
      cornerRadius={8}
      fill={'#fff'}
      stroke={gray}
      direction={'vertical'}
    >
      <AutoLayout verticalAlignItems="center" spacing={8}>
        <Text fontSize={24} fontFamily="Roboto Mono" fontWeight={700}>
          Figgle
        </Text>
        <AutoLayout
          width={24}
          height={24}
          cornerRadius={100}
          fill={gray}
          horizontalAlignItems="center"
          verticalAlignItems="center"
          onClick={showIframe}
          tooltip="Show instructions"
        >
          <Text fill={text}>?</Text>
        </AutoLayout>
      </AutoLayout>

      <AutoLayout direction="vertical" spacing={4} horizontalAlignItems="center">
        {guesses.map((g, i) => (
          <GuesedWord key={i} guess={g} secretWord={secretWord} guessedKeys={guessedKeys} />
        ))}
        {emptyGuesses.map((_, i) =>
          i < NUM_GUESSES - guesses.length ? (
            <EmptyGuess key={i} guessedKeys={guessedKeys} />
          ) : null,
        )}
        <Input
          value={input}
          placeholder={'Type a guess'}
          onTextEditEnd={(e: { characters: string }) => {
            onSubmit(e.characters)
          }}
          width={'fill-parent'}
          placeholderProps={{
            fill: gray,
            opacity: 1,
            letterSpacing: 0,
          }}
          fontWeight={800}
          inputFrameProps={{
            stroke: gray,
            padding: {
              top: 12,
              bottom: 12,
              left: 8,
              right: 8,
            },
            cornerRadius: 8,
          }}
        />
      </AutoLayout>
      <Text fill={msgColor}>{message ?? ' '}</Text>
      <KeyBoard
        guessedKeys={guessedKeys}
        onClick={(letter) => {
          letter === '↵' ? onSubmit(input) : setInput(input + letter)
        }}
      />
    </AutoLayout>
  )
}

widget.register(Widget)
