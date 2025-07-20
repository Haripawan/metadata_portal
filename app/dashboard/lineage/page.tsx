"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, ArrowRight, GitBranch } from "lucide-react"

// Mock data for lineage mappings
const mockLineage = [
  {
    id: 1,
    targetTable: "customer_summary",
    targetColumn: "customer_id",
    sourceTable: "customers",
    sourceColumn: "id",
    mappingType: "one-to-one",
    transformation: "Direct mapping",
    created: "2024-01-15",
    createdBy: "john.doe",
  },
  {
    id: 2,
    targetTable: "order_analytics",
    targetColumn: "total_amount",
    sourceTable: "order_items",
    sourceColumn: "price, quantity",
    mappingType: "many-to-one",
    transformation: "SUM(price * quantity)",
    created: "2024-01-18",
    createdBy: "jane.smith",
  },
  {
    id: 3,
    targetTable: "product_details",
    targetColumn: "category_name",
    sourceTable: "categories",
    sourceColumn: "name",
    mappingType: "one-to-many",
    transformation: "Lookup join",
    created: "2024-01-20",
    createdBy: "mike.wilson",
  },
  {
    id: 4,
    targetTable: "user_profile",
    targetColumn: "last_login",
    sourceTable: "system_generated",
    sourceColumn: "current_timestamp",
    mappingType: "system",
    transformation: "System generated field",
    created: "2024-01-19",
    createdBy: "system",
  },
]

export default function DataLineagePage() {
  const [lineageData, setLineageData] = useState(mockLineage)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newLineage, setNewLineage] = useState({
    targetTable: "",
    targetColumn: "",
    sourceTable: "",
    sourceColumn: "",
    mappingType: "one-to-one",
    transformation: "",
  })

  const handleCreateLineage = () => {
    const lineage = {
      id: lineageData.length + 1,
      ...newLineage,
      created: new Date().toISOString().split("T")[0],
      createdBy: localStorage.getItem("username") || "user",
    }
    setLineageData([...lineageData, lineage])
    setNewLineage({
      targetTable: "",
      targetColumn: "",
      sourceTable: "",
      sourceColumn: "",
      mappingType: "one-to-one",
      transformation: "",
    })
    setShowCreateDialog(false)
  }

  const getMappingTypeColor = (type: string) => {
    switch (type) {
      case "one-to-one":
        return "bg-green-100 text-green-800"
      case "one-to-many":
        return "bg-blue-100 text-blue-800"
      case "many-to-one":
        return "bg-orange-100 text-orange-800"
      case "system":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Data Lineage</h2>
          <p className="text-gray-600">Manage column-level and table-level data lineage mappings</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Lineage
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Data Lineage Mapping</DialogTitle>
              <DialogDescription>Define the source-to-target mapping for data lineage tracking</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="targetTable">Target Table</Label>
                  <Input
                    id="targetTable"
                    value={newLineage.targetTable}
                    onChange={(e) => setNewLineage({ ...newLineage, targetTable: e.target.value })}
                    placeholder="Enter target table name"
                  />
                </div>
                <div>
                  <Label htmlFor="targetColumn">Target Column</Label>
                  <Input
                    id="targetColumn"
                    value={newLineage.targetColumn}
                    onChange={(e) => setNewLineage({ ...newLineage, targetColumn: e.target.value })}
                    placeholder="Enter target column name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sourceTable">Source Table</Label>
                  <Input
                    id="sourceTable"
                    value={newLineage.sourceTable}
                    onChange={(e) => setNewLineage({ ...newLineage, sourceTable: e.target.value })}
                    placeholder="Enter source table name"
                  />
                </div>
                <div>
                  <Label htmlFor="sourceColumn">Source Column(s)</Label>
                  <Input
                    id="sourceColumn"
                    value={newLineage.sourceColumn}
                    onChange={(e) => setNewLineage({ ...newLineage, sourceColumn: e.target.value })}
                    placeholder="Enter source column name(s)"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="mappingType">Mapping Type</Label>
                <select
                  id="mappingType"
                  value={newLineage.mappingType}
                  onChange={(e) => setNewLineage({ ...newLineage, mappingType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="one-to-one">One-to-One</option>
                  <option value="one-to-many">One-to-Many</option>
                  <option value="many-to-one">Many-to-One</option>
                  <option value="system">System Field</option>
                </select>
              </div>
              <div>
                <Label htmlFor="transformation">Transformation Logic</Label>
                <Input
                  id="transformation"
                  value={newLineage.transformation}
                  onChange={(e) => setNewLineage({ ...newLineage, transformation: e.target.value })}
                  placeholder="Describe the transformation logic"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateLineage}>Create Lineage</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lineage Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <GitBranch className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Mappings</p>
                <p className="text-2xl font-bold text-gray-900">{lineageData.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">1:1</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">One-to-One</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lineageData.filter((l) => l.mappingType === "one-to-one").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold">M:1</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Many-to-One</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lineageData.filter((l) => l.mappingType === "many-to-one").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">SYS</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">System Fields</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lineageData.filter((l) => l.mappingType === "system").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lineage Mappings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Data Lineage Mappings</CardTitle>
          <CardDescription>Column-level source-to-target mappings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Target</TableHead>
                <TableHead></TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Mapping Type</TableHead>
                <TableHead>Transformation</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lineageData.map((lineage) => (
                <TableRow key={lineage.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{lineage.targetTable}</div>
                      <div className="text-sm text-gray-500">{lineage.targetColumn}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{lineage.sourceTable}</div>
                      <div className="text-sm text-gray-500">{lineage.sourceColumn}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getMappingTypeColor(lineage.mappingType)}>{lineage.mappingType}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{lineage.transformation}</TableCell>
                  <TableCell>{lineage.createdBy}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
