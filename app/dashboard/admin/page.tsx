"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Database, CheckCircle, AlertCircle, Settings } from "lucide-react"

export default function AdminPage() {
  const [projectSetup, setProjectSetup] = useState({
    projectName: "",
    projectDescription: "",
    databaseType: "Oracle",
    connectionString: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)
  const [setupError, setSetupError] = useState("")

  const databaseTypes = ["Oracle", "PostgreSQL", "MySQL", "SQL Server"]

  const handleSetup = async () => {
    setIsLoading(true)
    setSetupError("")

    try {
      // Simulate project setup
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Simulate table creation
      const tables = [
        `${projectSetup.projectName}_schema_metadata_version`,
        `${projectSetup.projectName}_Table_metadata_version`,
        `${projectSetup.projectName}_column_metadata_version`,
        `${projectSetup.projectName}_Lineage_metadata_version`,
        `${projectSetup.projectName}_User_metadata_version`,
      ]

      // Store project configuration
      localStorage.setItem(
        "projectConfig",
        JSON.stringify({
          ...projectSetup,
          tables,
          setupDate: new Date().toISOString(),
          status: "active",
        }),
      )

      setSetupComplete(true)
    } catch (error) {
      setSetupError("Failed to setup project. Please check your connection string and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const existingProject = localStorage.getItem("projectConfig")
  const projectConfig = existingProject ? JSON.parse(existingProject) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin</h2>
        <p className="text-gray-600 dark:text-gray-300">Project setup and administration</p>
      </div>

      {/* Project Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Project Setup
          </CardTitle>
          <CardDescription>Configure your metadata management project and create database tables</CardDescription>
        </CardHeader>
        <CardContent>
          {projectConfig ? (
            <div className="space-y-4">
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Project "{projectConfig.projectName}" is already configured and active.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="font-medium">Project Name</Label>
                  <p className="text-gray-600 dark:text-gray-300">{projectConfig.projectName}</p>
                </div>
                <div>
                  <Label className="font-medium">Database Type</Label>
                  <p className="text-gray-600 dark:text-gray-300">{projectConfig.databaseType}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="font-medium">Description</Label>
                  <p className="text-gray-600 dark:text-gray-300">{projectConfig.projectDescription}</p>
                </div>
              </div>

              <div>
                <Label className="font-medium">Created Tables</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {projectConfig.tables.map((table: string, index: number) => (
                    <Badge key={index} variant="outline" className="justify-start">
                      <Database className="h-3 w-3 mr-2" />
                      {table}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    localStorage.removeItem("projectConfig")
                    window.location.reload()
                  }}
                >
                  Reset Project
                </Button>
                <Button variant="outline">Update Configuration</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {setupError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{setupError}</AlertDescription>
                </Alert>
              )}

              {setupComplete && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Project setup completed successfully! All metadata tables have been created.
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={projectSetup.projectName}
                    onChange={(e) => setProjectSetup({ ...projectSetup, projectName: e.target.value })}
                    placeholder="Enter project name"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="databaseType">Database Type</Label>
                  <select
                    id="databaseType"
                    value={projectSetup.databaseType}
                    onChange={(e) => setProjectSetup({ ...projectSetup, databaseType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    disabled={isLoading}
                  >
                    {databaseTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="projectDescription">Project Description</Label>
                <Textarea
                  id="projectDescription"
                  value={projectSetup.projectDescription}
                  onChange={(e) => setProjectSetup({ ...projectSetup, projectDescription: e.target.value })}
                  placeholder="Enter project description"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="connectionString">Connection String</Label>
                <Input
                  id="connectionString"
                  type="password"
                  value={projectSetup.connectionString}
                  onChange={(e) => setProjectSetup({ ...projectSetup, connectionString: e.target.value })}
                  placeholder="Enter database connection string"
                  disabled={isLoading}
                />
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Tables to be created:</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  <li>• {projectSetup.projectName || "[PROJECT_NAME]"}_schema_metadata_version</li>
                  <li>• {projectSetup.projectName || "[PROJECT_NAME]"}_Table_metadata_version</li>
                  <li>• {projectSetup.projectName || "[PROJECT_NAME]"}_column_metadata_version</li>
                  <li>• {projectSetup.projectName || "[PROJECT_NAME]"}_Lineage_metadata_version</li>
                  <li>• {projectSetup.projectName || "[PROJECT_NAME]"}_User_metadata_version</li>
                </ul>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Each table will include: Object_ID, created_ts, updated_ts, rec_flg
                </p>
              </div>

              <Button
                onClick={handleSetup}
                disabled={isLoading || !projectSetup.projectName || !projectSetup.connectionString}
                className="w-full"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Setting up project...
                  </div>
                ) : (
                  "Setup Project"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Database Tables Information */}
      <Card>
        <CardHeader>
          <CardTitle>Database Schema Information</CardTitle>
          <CardDescription>Standard fields included in all metadata tables</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Common Fields</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <h5 className="font-medium">Object_ID</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Unique identifier for each object including lineage
                  </p>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <h5 className="font-medium">created_ts</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Timestamp when the record was created</p>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <h5 className="font-medium">updated_ts</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Timestamp when the record was last updated</p>
                </div>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  <h5 className="font-medium">rec_flg</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Record flag: Insert, Update, Delete</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
