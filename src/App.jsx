import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { CartProvider } from './contexts/CartContext'
import { CurrencyProvider } from './contexts/CurrencyContext'
import Layout from './components/layout/Layout'
import RequireAuth from './components/auth/RequireAuth'

// Pages
import HomePage from './pages/HomePage'
import BrowsePage from './pages/BrowsePage'
import ListingDetailPage from './pages/ListingDetailPage'
import SellPage from './pages/SellPage'
import EditListingPage from './pages/EditListingPage'
import MyListingsPage from './pages/MyListingsPage'
import OrdersPage from './pages/OrdersPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import MessagesPage from './pages/MessagesPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <CurrencyProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
                success: { iconTheme: { primary: '#f97316', secondary: '#fff' } },
              }}
            />
            <Routes>
              <Route path="/" element={<Layout />}>
                {/* Public routes */}
                <Route index element={<HomePage />} />
                <Route path="browse" element={<BrowsePage />} />
                <Route path="listing/:id" element={<ListingDetailPage />} />
                <Route path="profile/:id" element={<ProfilePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />

                {/* Protected routes */}
                <Route element={<RequireAuth />}>
                  <Route path="sell" element={<SellPage />} />
                  <Route path="listing/:id/edit" element={<EditListingPage />} />
                  <Route path="my-listings" element={<MyListingsPage />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="messages" element={<MessagesPage />} />
                  <Route path="messages/:listingId/:receiverId" element={<MessagesPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </CurrencyProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
