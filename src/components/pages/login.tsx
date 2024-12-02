import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL + '/admin'

function LoginPage() {
  const [isResetPassword, setIsResetPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement login logic
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
		console.log(response.data.message, response.data.token)
		login(response.data.token)
		navigate('/')
	} catch (error) {
		console.error(error)
	}
  }

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {isResetPassword ? 'Admin Password Reset' : 'Admin Login'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isResetPassword ? (
            <form onSubmit={handleResetPassword} className="space-y-8">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mt-8">
                <Button type="submit" className="w-full">
                  Send Reset Link
                </Button>
              </div>
            </form>
          ) : (
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
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mt-8">
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <Button
            variant="link"
            className="w-full text-sm text-gray-600 hover:text-gray-800"
            onClick={toggleResetPassword}
          >
            {isResetPassword ? 'Back to Login' : 'Reset Password'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export { LoginPage };

