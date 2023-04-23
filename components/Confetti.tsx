import type { Props as IConfettiOptions } from 'react-confetti'

import { useState } from 'react'
import Confetti from 'react-confetti'
import { useWindowSize } from 'react-use'

function useConfetti(
  options?: Partial<IConfettiOptions>
): [() => void, React.ReactElement | null] {
  const { width, height } = useWindowSize()
  const [confetti, setConfetti] = useState<React.ReactElement | null>(null)

  function createConfetti() {
    const confetti = (
      <Confetti
        width={width}
        height={height}
        recycle={false}
        onConfettiComplete={() => setConfetti(null)}
        {...options}
      />
    )
    setConfetti(confetti)
  }

  return [createConfetti, confetti]
}

export default useConfetti
