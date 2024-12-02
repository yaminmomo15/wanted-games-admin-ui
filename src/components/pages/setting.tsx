import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import axios from "axios"
import { useAuth } from "@/hooks/useAuth"

const API_URL = import.meta.env.VITE_API_URL + '/admin/password'

function SettingPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [state, setState] = useState<{ message?: string; errors?: Record<string, string> }>({})
  const { token } = useAuth()

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      setState({ errors: { confirmPassword: 'New passwords do not match' } })
      return
    }

    try {
      await axios({
        method: 'patch',
        url: `${API_URL}`,
        data: {
          currentPassword: currentPassword,
          newPassword: newPassword
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setState({ message: 'Password changed successfully' })
    } catch (error) {
      setState({ 
        message: 'Failed to change password',
        errors: { currentPassword: 'Invalid current password' }
      })
    }
  }

  return (
	<div className="flex flex-col min-h-screen">
		<div className="flex flex-grow" />
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Enter your current password and choose a new one</CardDescription>
      </CardHeader>
      <form onSubmit={handleChangePassword}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type={showPassword ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            {state?.errors?.currentPassword && (
              <p className="text-sm text-red-500">{state.errors.currentPassword}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type={showPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            {state?.errors?.newPassword && (
              <p className="text-sm text-red-500">{state.errors.newPassword}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {state?.errors?.confirmPassword && (
              <p className="text-sm text-red-500">{state.errors.confirmPassword}</p>
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
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <Button type="submit" className="w-full">Change Password</Button>
          {state?.message && (
            <div className={`flex items-center space-x-2 ${state.errors ? 'text-red-500' : 'text-green-500'}`}>
              {state.errors ? <AlertCircle className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
              <span>{state.message}</span>
            </div>
          )}
        </CardFooter>
      </form>
      </Card>
	  <div className="flex-grow-[4]" />
    </div>
  )
}

export { SettingPage }
