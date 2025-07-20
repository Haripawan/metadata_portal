"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart3, Download, FileText, TrendingUp, Database, GitBranch } from "lucide-react"

// Mock data for reports
const mockReports = [
  {
    id: 1,
    name: "Data Lineage Coverage Report",
    description: "Shows percentage of tables and columns with defined lineage",
    type: "lineage",
    lastRun: "2024-01-20 09:30:00",
    status: "completed",
    records: 156,
  },
  {
    id: 2,
    name: "Impact Analysis Report",
    description: "Identifies downstream dependencies for schema changes",
    type: "impact",
    lastRun: "2024-01-20 08:15:00",
    status: "completed",
    records: 89,
  },
  {
    id: 3,
    name: "Table Usage Statistics",
    description: "Analyzes table access patterns and usage frequency",
    type: "usage",
    lastRun: "2024-01-19 23:45:00",
    status: "completed",
    records: 234,
  },
  {
    id: 4,
    name: "Data Quality Metrics",
    description: "Tracks data quality scores and constraint violations",
    type: "quality",
    lastRun: "2024-01-20 10:00:00",
    status: "running",
    records: 0,
  },
]

// Mock data for lineage coverage
const lineageCoverage = [
  { table: "customers", totalColumns: 8, mappedColumns: 8, coverage: 100 },
  { table: "orders", totalColumns: 12, mappedColumns: 10, coverage: 83 },
  { table: "products", totalColumns: 15, mappedColumns: 12, coverage: 80 },
  { table: "order_items", totalColumns: 6, mappedColumns: 5, coverage: 83 },
  { table: "categories", totalColumns: 4, mappedColumns: 3, coverage: 75 },
]

// Mock data for impact analysis
const impactAnalysis = [
  {
    sourceTable: "customers",
    sourceColumn: "id",
    impactedTables: ["orders", "customer_summary", "analytics_view"],
    riskLevel: "high",
    dependencies: 15,
  },
  {
    sourceTable: "products",
    sourceColumn: "price",
    impactedTables: ["order_items", "pricing_history"],
    riskLevel: "medium",
    dependencies: 8,
  },
  {
    sourceTable: "categories",
    sourceColumn: "name",
    impactedTables: ["product_details"],
    riskLevel: "low",
    dependencies: 3,
  },
]

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState("lineage")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "running":
        return "bg-blue-100 text-blue-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 90) return "text-green-600"
    if (coverage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Reporting</h2>
        <p className="text-gray-600">Generate reports on data lineage, impact analysis, and metadata quality</p>
      </div>

      {/* Report Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{mockReports.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <GitBranch className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Lineage Coverage</p>
                <p className="text-2xl font-bold text-gray-900">84%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">High Risk Items</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Tables Tracked</p>
                <p className="text-2xl font-bold text-gray-900">47</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>Generate and download various metadata reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.name}</TableCell>
                  <TableCell className="max-w-xs">{report.description}</TableCell>
                  <TableCell>{report.lastRun}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(report.status)}>{report.status}</Badge>
                  </TableCell>
                  <TableCell>{report.records}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Run
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Report Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <Button
          variant={selectedReport === "lineage" ? "default" : "ghost"}
          onClick={() => setSelectedReport("lineage")}
          className="flex-1"
        >
          Lineage Coverage
        </Button>
        <Button
          variant={selectedReport === "impact" ? "default" : "ghost"}
          onClick={() => setSelectedReport("impact")}
          className="flex-1"
        >
          Impact Analysis
        </Button>
      </div>

      {/* Lineage Coverage Report */}
      {selectedReport === "lineage" && (
        <Card>
          <CardHeader>
            <CardTitle>Data Lineage Coverage Report</CardTitle>
            <CardDescription>Shows the percentage of columns with defined lineage mappings</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table Name</TableHead>
                  <TableHead>Total Columns</TableHead>
                  <TableHead>Mapped Columns</TableHead>
                  <TableHead>Coverage %</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineageCoverage.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.table}</TableCell>
                    <TableCell>{item.totalColumns}</TableCell>
                    <TableCell>{item.mappedColumns}</TableCell>
                    <TableCell>
                      <span className={`font-semibold ${getCoverageColor(item.coverage)}`}>{item.coverage}%</span>
                    </TableCell>
                    <TableCell>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            item.coverage >= 90 ? "bg-green-600" : item.coverage >= 70 ? "bg-yellow-600" : "bg-red-600"
                          }`}
                          style={{ width: `${item.coverage}%` }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Impact Analysis Report */}
      {selectedReport === "impact" && (
        <Card>
          <CardHeader>
            <CardTitle>Impact Analysis Report</CardTitle>
            <CardDescription>Identifies downstream dependencies and potential impact of changes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Impacted Tables</TableHead>
                  <TableHead>Dependencies</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {impactAnalysis.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.sourceTable}</div>
                        <div className="text-sm text-gray-500">{item.sourceColumn}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {item.impactedTables.map((table, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {table}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{item.dependencies}</TableCell>
                    <TableCell>
                      <Badge className={getRiskColor(item.riskLevel)}>{item.riskLevel}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
