import React from 'react'
import { render } from '@testing-library/react'
import App from './App'

test('renders add habit button', () => {
   const { getByText } = render(<App />)
   const linkElement = getByText(/Add Habits/i)
   expect(linkElement).toBeInTheDocument()
})
