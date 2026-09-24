import { createContext, useContext, useState } from 'react'
import { CURRENCIES, convertPrice, formatPrice } from '../lib/currencies'

const CurrencyContext = createContext({})

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(
    () => localStorage.getItem('kenshop-currency') || 'USD'
  )

  function changeCurrency(c) {
    if (CURRENCIES.includes(c)) {
      setCurrency(c)
      localStorage.setItem('kenshop-currency', c)
    }
  }

  function display(amount, fromCurrency) {
    const converted = convertPrice(amount, fromCurrency || 'USD', currency)
    return formatPrice(converted, currency)
  }

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, display, CURRENCIES }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export const useCurrency = () => useContext(CurrencyContext)
