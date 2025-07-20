"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Shield, Users } from "lucide-react"

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock authentication - in real app, validate against backend
    if (credentials.username && credentials.password) {
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("username", credentials.username)
      router.push("/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Database className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Metadata Management Portal</h2>
          <p className="mt-2 text-gray-600">Sign in to access your data management tools</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the portal</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-600">
          <div className="flex flex-col items-center space-y-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span>Secure Access</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Database className="h-6 w-6 text-blue-600" />
            <span>Data Management</span>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <Users className="h-6 w-6 text-blue-600" />
            <span>Role-based Access</span>
          </div>
        </div>
      </div>
    </div>
  )
}
