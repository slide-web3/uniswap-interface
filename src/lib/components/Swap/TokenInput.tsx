import { Trans } from '@lingui/macro'
import { Currency } from '@uniswap/sdk-core'
import { LoadingOpacityContainer } from 'components/Loader/styled'
import styled, { keyframes, ThemedText } from 'lib/theme'
import { FocusEvent, ReactNode, useCallback, useRef, useState } from 'react'

import Button from '../Button'
import Column from '../Column'
import { DecimalInput } from '../Input'
import Row from '../Row'
import TokenSelect from '../TokenSelect'

const TokenInputRow = styled(Row)`
  grid-template-columns: 1fr;
`

const ValueInput = styled(DecimalInput)`
  color: ${({ theme }) => theme.primary};

  :hover:not(:focus-within) {
    color: ${({ theme }) => theme.onHover(theme.primary)};
  }

  :hover:not(:focus-within)::placeholder {
    color: ${({ theme }) => theme.onHover(theme.secondary)};
  }
`

const delayedFadeIn = keyframes`
  0% {
    opacity: 0;
  }
  25% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const MaxButton = styled(Button)`
  animation: ${delayedFadeIn} 0.25s linear;
  border-radius: 0.75em;
  padding: 0.5em;
`

interface TokenInputProps {
  currency?: Currency
  amount: string
  disabled?: boolean
  onMax?: () => void
  onChangeInput: (input: string) => void
  onChangeCurrency: (currency: Currency) => void
  loading?: boolean
  children: ReactNode
}

export default function TokenInput({
  currency,
  amount,
  disabled,
  onMax,
  onChangeInput,
  onChangeCurrency,
  loading,
  children,
}: TokenInputProps) {
  const max = useRef<HTMLButtonElement>(null)
  const [showMax, setShowMax] = useState(false)
  const onFocus = useCallback(() => setShowMax(Boolean(onMax)), [onMax])
  const onBlur = useCallback((e: FocusEvent) => {
    if (e.relatedTarget !== max.current) {
      setShowMax(false)
    }
  }, [])

  return (
    <Column gap={0.25}>
      <TokenInputRow gap={0.5} onBlur={onBlur}>
        <LoadingOpacityContainer $loading={!!loading}>
          <ThemedText.H2>
            <ValueInput
              value={amount}
              onFocus={onFocus}
              onChange={onChangeInput}
              disabled={disabled || !currency}
            ></ValueInput>
          </ThemedText.H2>
        </LoadingOpacityContainer>
        {showMax && (
          <MaxButton onClick={onMax} ref={max}>
            <ThemedText.ButtonMedium>
              <Trans>Max</Trans>
            </ThemedText.ButtonMedium>
          </MaxButton>
        )}
        <TokenSelect value={currency} collapsed={showMax} disabled={disabled} onSelect={onChangeCurrency} />
      </TokenInputRow>
      {children}
    </Column>
  )
}
