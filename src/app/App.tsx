import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from '../context/CartContext'
import { AppRoutes } from './routes'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </BrowserRouter>
  )
}
