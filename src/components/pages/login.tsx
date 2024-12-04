import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Label } from "@/components/ui/label"

const API_URL = import.meta.env.VITE_API_URL + '/admin'

function LoginPage() {
  // Comment out reset password related state
  // const [isResetPassword, setIsResetPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // const [email, setEmail] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [state, setState] = useState<{ message?: string; errors?: Record<string, string> }>({})

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setState({}) // Reset state before new attempt
    
    // check if username is valid number, letter, or dash using regex
    const usernameRegex = /^[a-zA-Z0-9-_]+$/;
    if (!usernameRegex.test(username)) {
      setState({ message: 'Invalid username', errors: { username: 'Invalid username' } })
      return
    }
    try {
      const response = await axios({
        method: 'post',
        url: API_URL,
        data: {
          username: username,
          password: password
        },
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setState({ message: 'Login successful' })
      login(response.data.token)
      navigate('/')
    } catch (error) {
      setState({ 
        message: 'Login failed',
        errors: { credentials: 'Invalid username or password' }
      })
    }
  }

  // Comment out reset password related functions
  /*
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement reset password logic
    console.log('Reset password for:', email)
  }

  const toggleResetPassword = () => {
    setIsResetPassword(!isResetPassword)
    setUsername('')
    setPassword('')
    setEmail('')
  }
  */

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {/* {isResetPassword ? 'Admin Password Reset' : 'Admin Login'} */}
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Remove the isResetPassword conditional rendering and keep only the login form */}
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {state?.errors?.credentials && (
                <p className="text-sm text-red-500">{state.errors.credentials}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="showPassword" className="text-sm font-normal">Show password</Label>
            </div>
            <div className="mt-8">
              <Button type="submit" className="w-full">
                Login
              </Button>
              {state?.message && (
                <div className={`mt-4 flex items-center space-x-2 ${state.errors ? 'text-red-500' : 'text-green-500'}`}>
                  {state.errors ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                  <span>{state.message}</span>
                </div>
              )}
            </div>
          </form>
        </CardContent>
        {/* Comment out CardFooter with reset password button
        <CardFooter>
          <Button
            variant="link"
            className="w-full text-sm text-gray-600 hover:text-gray-800"
            onClick={toggleResetPassword}
          >
            {isResetPassword ? 'Back to Login' : 'Reset Password'}
          </Button>
        </CardFooter>
        */}
      </Card>
    </div>
  )
}

export { LoginPage };

