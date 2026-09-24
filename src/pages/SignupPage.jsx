import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import Spinner from '../components/ui/Spinner'

export default function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [showPw, setShowPw] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  function set(k, v) {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => { const n = { ...e }; delete n[k]; return n })
  }

  function validate() {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Your name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 8) e.password = 'At least 8 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      await signUp(form.email, form.password, form.fullName)
      toast.success('Account created! Check your email to verify.')
      navigate('/login')
    } catch (err) {
      toast.error(err.message || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true)
    try {
      await signInWithGoogle()
    } catch (err) {
      toast.error(err.message)
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 justify-center mb-4">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-extrabold text-xl">K</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Start buying and selling on Kenshop today</p>
        </div>

        <div className="card p-6 sm:p-8">
          <button onClick={handleGoogle} disabled={googleLoading} className="btn-secondary w-full gap-3 mb-5">
            {googleLoading ? <Spinner size="sm" /> : (
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
            )}
            Continue with Google
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700" /></div>
            <div className="relative flex justify-center text-xs text-gray-400 bg-white dark:bg-gray-900 px-3 w-fit mx-auto">or sign up with email</div>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label htmlFor="fullName" className="label">Full Name</label>
              <input
                id="fullName" type="text" autoComplete="name"
                value={form.fullName} onChange={e => set('fullName', e.target.value)}
                placeholder="Jane Doe"
                className={`input ${errors.fullName ? 'border-red-400' : ''}`}
                aria-required="true" aria-invalid={!!errors.fullName}
              />
              {errors.fullName && <p className="text-xs text-red-500 mt-1" role="alert">{errors.fullName}</p>}
            </div>

            <div>
              <label htmlFor="email" className="label">Email address</label>
              <input
                id="email" type="email" autoComplete="email"
                value={form.email} onChange={e => set('email', e.target.value)}
                placeholder="you@example.com"
                className={`input ${errors.email ? 'border-red-400' : ''}`}
                aria-required="true" aria-invalid={!!errors.email}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1" role="alert">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <input
                  id="password" type={showPw ? 'text' : 'password'} autoComplete="new-password"
                  value={form.password} onChange={e => set('password', e.target.value)}
                  placeholder="Min. 8 characters"
                  className={`input pr-10 ${errors.password ? 'border-red-400' : ''}`}
                  aria-required="true" aria-invalid={!!errors.password}
                />
                <button type="button" onClick={() => setShowPw(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPw ? 'Hide password' : 'Show password'}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1" role="alert">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="label">Confirm Password</label>
              <input
                id="confirmPassword" type={showPw ? 'text' : 'password'} autoComplete="new-password"
                value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
                placeholder="Re-enter your password"
                className={`input ${errors.confirmPassword ? 'border-red-400' : ''}`}
                aria-required="true" aria-invalid={!!errors.confirmPassword}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1" role="alert">{errors.confirmPassword}</p>}
            </div>

            <p className="text-xs text-gray-400">
              By creating an account you agree to our{' '}
              <span className="text-brand-500 cursor-pointer hover:underline">Terms of Service</span> and{' '}
              <span className="text-brand-500 cursor-pointer hover:underline">Privacy Policy</span>.
            </p>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 mt-1">
              {loading ? <Spinner size="sm" /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-500 hover:text-brand-600 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
