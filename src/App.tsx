import { useEffect, useRef, useState } from 'react'
import './styles/App.css'

import { animateButtonClicks } from './hooks/animateButton.ts'

const App = () => {
  const [inputFormula, setInputFormula] = useState('')
  const [inputVariables, setInputVariables] = useState<string[]>([])
  const [result, setResult] = useState({ solution: '', answer: '' })

  const inputFormulaRef = useRef<HTMLInputElement>(null)
  const variablesWrapperMainRef = useRef<HTMLDivElement>(null)

  const isPlayingAnimation = useRef(false)
  const playEmptyAnimation = (msg: string) => {
    isPlayingAnimation.current = true

    if (!msg) {
      if (inputFormulaRef.current)
        inputFormulaRef.current.placeholder = 'Formula'

      isPlayingAnimation.current = false
      return
    }

    if (inputFormulaRef.current) {
      if (inputFormulaRef.current.placeholder === 'Formula')
        inputFormulaRef.current.placeholder = ''

      const addedLetter = msg.slice(0, 1)
      inputFormulaRef.current.placeholder += addedLetter
    }

    const updatedText = msg.slice(1)

    setTimeout(() => {
      playEmptyAnimation(updatedText)
    }, 150)
  }

  const handleFormulaSubmit = () => {
    if (inputFormulaRef.current?.value) {
      setInputFormula(inputFormulaRef.current.value)
      inputFormulaRef.current.value = ''
    } else {
      //else if its empty
      if (!isPlayingAnimation.current) playEmptyAnimation('......bruh')

      inputFormulaRef.current?.focus()
    }
  }

  const handleCalculate = () => {
    let solve = inputFormula

    const variablesWrappers = [
      ...(variablesWrapperMainRef.current
        ?.children as HTMLCollectionOf<HTMLDivElement>),
    ]

    const variablesInputs = variablesWrappers.reduce<HTMLInputElement[]>(
      (acc, v) => {
        const inputChild = v.firstChild as HTMLInputElement
        acc.push(inputChild)

        return acc
      },
      []
    )

    //add multiplication syntax

    const accumulator = []

    for (let i = 0; i < solve.length; i++) {
      if (solve[i].match(/[a-z]/g)?.length && solve[i + 1]) {
        if (solve[i + 1].match(/[a-z]/g)?.length) accumulator.unshift(i)
      }
    }

    for (let i = 0; i < accumulator.length; i++) {
      solve =
        solve.slice(0, accumulator[i] + 1) +
        '*' +
        solve.slice(accumulator[i] + 1)
    }

    if (variablesInputs) {
      for (let i = 0; i < variablesInputs.length; i++) {
        solve = solve.replaceAll(
          variablesInputs[i].placeholder,
          variablesInputs[i].value
        )
      }

      const solution = solve
      const answer = eval(solve)
      setResult({ solution, answer })
    }
  }

  const handleClear = () => {
    setResult({ solution: '', answer: '' })
  }

  useEffect(() => {
    if (inputFormula) {
      const varss = [...new Set(inputFormula.match(/[a-z]/g))]
      setInputVariables(varss)
    }
  }, [inputFormula])

  useEffect(() => {
    animateButtonClicks()
  }, [])

  return (
    <>
      <div className='wrapper'>
        <div className='formula-wrapper'>
          <input
            className='input-formula'
            placeholder='Formula'
            type='text'
            ref={inputFormulaRef}
          />

          <button
            className='submit-formula'
            data-submit-btn
            onClick={handleFormulaSubmit}
          >
            Submit
          </button>

          <span className='active-formula'>{inputFormula}</span>
        </div>

        <div className='buttom-container'>
          <div
            className='variables-wrapper-main'
            ref={variablesWrapperMainRef}
          >
            {inputVariables.map(v => (
              <div
                className='variables-wrapper'
                key={v}
              >
                <input
                  placeholder={v}
                  type='number'
                />
                <span>{v}</span>
              </div>
            ))}
          </div>

          <div className='answer-wrapper'>
            <button
              className='calculate-btn'
              data-calculate-btn
              onClick={handleCalculate}
            >
              Calculate
            </button>

            <span className='solution-tab'>{result.solution}</span>
            <span
              className='answer-tab'
              onDoubleClick={handleClear}
              onTouchStart={handleClear}
            >
              {result.answer}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
