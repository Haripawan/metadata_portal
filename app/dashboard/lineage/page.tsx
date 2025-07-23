"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, ArrowRight, GitBranch, Upload, Search } from "lucide-react"

// Mock data for lineage mappings
const mockLineage = [
  {
    id: 1,
    targetSchema: "HR_SCHEMA",
    targetTable: "employee_summary",
    targetColumn: "employee_id",
    sourceSchema: "HR_SCHEMA",
    sourceTable: "employees",
    sourceColumn: "emp_id",
    mappingType: "One-to-One",
    transformationType: "Direct",
    transformationLogic: "Direct mapping without transformation",
    changeRefNumber: "CHG-2024-001",
    created: "2024-01-15",
    createdBy: "john.doe",
  },
  {
    id: 2,
    targetSchema: "FINANCE_SCHEMA",
    targetTable: "monthly_summary",
    targetColumn: "total_amount",
    sourceSchema: "FINANCE_SCHEMA",
    sourceTable: "transactions",
    sourceColumn: "amount",
    mappingType: "Many-to-One",
    transformationType: "Conditional",
    transformationLogic: "SUM(amount) WHERE transaction_date >= TRUNC(SYSDATE, 'MM')",
    changeRefNumber: "CHG-2024-002",
    created: "2024-01-18",
    createdBy: "jane.smith",
  },
  {
    id: 3,
    targetSchema: "INVENTORY_SCHEMA",
    targetTable: "product_details",
    targetColumn: "last_updated",
    sourceSchema: "SYSTEM",
    sourceTable: "system_generated",
    sourceColumn: "current_timestamp",
    mappingType: "System Field",
    transformationType: "Direct",
    transformationLogic: "System generated timestamp",
    changeRefNumber: "CHG-2024-003",
    created: "2024-01-20",
    createdBy: "system",
  },
]

const mockSchemas = ["HR_SCHEMA", "FINANCE_SCHEMA", "INVENTORY_SCHEMA"]
const mockTables = {
  HR_SCHEMA: ["employees", "departments", "employee_summary"],
  FINANCE_SCHEMA: ["accounts", "transactions", "monthly_summary"],
  INVENTORY_SCHEMA: ["products", "categories", "product_details"],
}
const mockColumns = {
  employees: ["emp_id", "first_name", "last_name", "email", "hire_date"],
  departments: ["dept_id", "dept_name", "manager_id"],
  employee_summary: ["employee_id", "full_name", "department", "salary"],
  accounts: ["account_id", "account_name", "balance"],
  transactions: ["trans_id", "account_id", "amount", "transaction_date"],
  monthly_summary: ["month", "total_amount", "transaction_count"],
  products: ["product_id", "product_name", "category_id"],
  categories: ["category_id", "category_name"],
  product_details: ["product_id", "product_name", "category_name", "last_updated"],
}

export default function DataLineagePage() {
  const [activeTab, setActiveTab] = useState("view")
  const [lineageData, setLineageData] = useState(mockLineage)
  const [isLoading, setIsLoading] = useState(false)

  // Filter states for view lineage
  const [filterSchema, setFilterSchema] = useState("")
  const [filterTable, setFilterTable] = useState("")
  const [filterColumn, setFilterColumn] = useState("")
  const [filterChangeRef, setFilterChangeRef] = useState("")

  // Form states for add lineage
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [editingLineage, setEditingLineage] = useState<any>(null)
  const [newLineage, setNewLineage] = useState({
    targetSchema: "",
    targetTable: "",
    targetColumn: "",
    mappingType: "One-to-One",
    transformationType: "Direct",
    transformationLogic: "",
    sources: [{ schema: "", table: "", column: "", transformationType: "Direct" }],
  })

  // Available tables and columns based on selected schema/table
  const getAvailableTables = (schema: string) => {
    return schema ? mockTables[schema as keyof typeof mockTables] || [] : []
  }

  const getAvailableColumns = (table: string) => {
    return table ? mockColumns[table as keyof typeof mockColumns] || [] : []
  }

  const filteredLineage = lineageData.filter((lineage) => {
    const matchesSchema = !filterSchema || lineage.targetSchema === filterSchema
    const matchesTable = !filterTable || lineage.targetTable === filterTable
    const matchesColumn = !filterColumn || lineage.targetColumn.toLowerCase().includes(filterColumn.toLowerCase())
    const matchesChangeRef =
      !filterChangeRef || lineage.changeRefNumber.toLowerCase().includes(filterChangeRef.toLowerCase())

    return matchesSchema && matchesTable && matchesColumn && matchesChangeRef
  })

  const getMappingTypeColor = (type: string) => {
    switch (type) {
      case "One-to-One":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "Many-to-One":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100"
      case "System Field":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100"
    }
  }

  const handleAddSource = () => {
    setNewLineage({
      ...newLineage,
      sources: [...newLineage.sources, { schema: "", table: "", column: "", transformationType: "Direct" }],
    })
  }

  const handleRemoveSource = (index: number) => {
    const newSources = newLineage.sources.filter((_, i) => i !== index)
    setNewLineage({ ...newLineage, sources: newSources })
  }

  const handleSourceChange = (index: number, field: string, value: string) => {
    const newSources = [...newLineage.sources]
    newSources[index] = { ...newSources[index], [field]: value }

    // Reset dependent fields when parent changes
    if (field === "schema") {
      newSources[index].table = ""
      newSources[index].column = ""
    } else if (field === "table") {
      newSources[index].column = ""
    }

    setNewLineage({ ...newLineage, sources: newSources })
  }

  const handleCreateLineage = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const lineage = {
      id: lineageData.length + 1,
      targetSchema: newLineage.targetSchema,
      targetTable: newLineage.targetTable,
      targetColumn: newLineage.targetColumn,
      sourceSchema: newLineage.sources[0].schema,
      sourceTable: newLineage.sources[0].table,
      sourceColumn: newLineage.sources[0].column,
      mappingType: newLineage.mappingType,
      transformationType: newLineage.transformationType,
      transformationLogic: newLineage.transformationLogic,
      changeRefNumber: `CHG-2024-${String(lineageData.length + 1).padStart(3, "0")}`,
      created: new Date().toISOString().split("T")[0],
      createdBy: localStorage.getItem("username") || "user",
    }

    setLineageData([lineage, ...lineageData])
    setNewLineage({
      targetSchema: "",
      targetTable: "",
      targetColumn: "",
      mappingType: "One-to-One",
      transformationType: "Direct",
      transformationLogic: "",
      sources: [{ schema: "", table: "", column: "", transformationType: "Direct" }],
    })
    setShowAddDialog(false)
    setIsLoading(false)
  }

  const handleEditLineage = (lineage: any) => {
    setEditingLineage(lineage)
    setNewLineage({
      targetSchema: lineage.targetSchema,
      targetTable: lineage.targetTable,
      targetColumn: lineage.targetColumn,
      mappingType: lineage.mappingType,
      transformationType: lineage.transformationType,
      transformationLogic: lineage.transformationLogic,
      sources: [
        {
          schema: lineage.sourceSchema,
          table: lineage.sourceTable,
          column: lineage.sourceColumn,
          transformationType: lineage.transformationType,
        },
      ],
    })
    setShowEditDialog(true)
  }

  const handleUpdateLineage = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updatedLineage = {
      ...editingLineage,
      targetSchema: newLineage.targetSchema,
      targetTable: newLineage.targetTable,
      targetColumn: newLineage.targetColumn,
      sourceSchema: newLineage.sources[0].schema,
      sourceTable: newLineage.sources[0].table,
      sourceColumn: newLineage.sources[0].column,
      mappingType: newLineage.mappingType,
      transformationType: newLineage.transformationType,
      transformationLogic: newLineage.transformationLogic,
    }

    setLineageData(lineageData.map((l) => (l.id === editingLineage.id ? updatedLineage : l)))
    setShowEditDialog(false)
    setEditingLineage(null)
    setIsLoading(false)
  }

  const handleDeleteLineage = (id: number) => {
    setLineageData(lineageData.filter((l) => l.id !== id))
  }

  const handleSearch = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  const resetForm = () => {
    setNewLineage({
      targetSchema: "",
      targetTable: "",
      targetColumn: "",
      mappingType: "One-to-One",
      transformationType: "Direct",
      transformationLogic: "",
      sources: [{ schema: "", table: "", column: "", transformationType: "Direct" }],
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Data Lineage</h2>
        <p className="text-gray-600 dark:text-gray-300">Manage column-level and table-level data lineage mappings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="view">View Lineage</TabsTrigger>
          <TabsTrigger value="add">Add Lineage</TabsTrigger>
        </TabsList>

        {/* View Lineage Tab */}
        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                View Data Lineage
              </CardTitle>
              <CardDescription>Search and view existing data lineage mappings</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Cascade Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div>
                  <Label htmlFor="filterSchema">Schema</Label>
                  <select
                    id="filterSchema"
                    value={filterSchema}
                    onChange={(e) => {
                      setFilterSchema(e.target.value)
                      setFilterTable("")
                      setFilterColumn("")
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  >
                    <option value="">All Schemas</option>
                    {mockSchemas.map((schema) => (
                      <option key={schema} value={schema}>
                        {schema}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="filterTable">Table</Label>
                  <select
                    id="filterTable"
                    value={filterTable}
                    onChange={(e) => {
                      setFilterTable(e.target.value)
                      setFilterColumn("")
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    disabled={!filterSchema}
                  >
                    <option value="">All Tables</option>
                    {getAvailableTables(filterSchema).map((table) => (
                      <option key={table} value={table}>
                        {table}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="filterColumn">Column</Label>
                  <Input
                    id="filterColumn"
                    value={filterColumn}
                    onChange={(e) => setFilterColumn(e.target.value)}
                    placeholder="Search column name"
                  />
                </div>
                <div>
                  <Label htmlFor="filterChangeRef">Change Reference Number</Label>
                  <Input
                    id="filterChangeRef"
                    value={filterChangeRef}
                    onChange={(e) => setFilterChangeRef(e.target.value)}
                    placeholder="Search change ref"
                  />
                </div>
              </div>

              <div className="flex justify-end mb-4">
                <Button onClick={handleSearch} disabled={isLoading}>
                  <Search className="h-4 w-4 mr-2" />
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </div>

              {/* Lineage Results */}
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Target</TableHead>
                      <TableHead></TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Mapping Type</TableHead>
                      <TableHead>Transformation</TableHead>
                      <TableHead>Change Ref</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLineage.map((lineage) => (
                      <TableRow key={lineage.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {lineage.targetSchema}.{lineage.targetTable}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{lineage.targetColumn}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {lineage.sourceSchema}.{lineage.sourceTable}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{lineage.sourceColumn}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getMappingTypeColor(lineage.mappingType)}>{lineage.mappingType}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <Badge variant="outline" className="mb-1">
                              {lineage.transformationType}
                            </Badge>
                            <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate">
                              {lineage.transformationLogic}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{lineage.changeRefNumber}</TableCell>
                        <TableCell>{lineage.createdBy}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditLineage(lineage)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDeleteLineage(lineage.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {filteredLineage.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">
                    No lineage mappings found for the selected criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Add Lineage Tab */}
        <TabsContent value="add">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Add Data Lineage
                  </CardTitle>
                  <CardDescription>Create new data lineage mappings</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Lineage
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Lineage Data</DialogTitle>
                        <DialogDescription>Upload CSV file to import lineage mappings</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="lineageCsvFile">CSV File</Label>
                          <Input id="lineageCsvFile" type="file" accept=".csv" />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                            Cancel
                          </Button>
                          <Button>Upload</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog
                    open={showAddDialog}
                    onOpenChange={(open) => {
                      setShowAddDialog(open)
                      if (!open) resetForm()
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Lineage
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Create Data Lineage Mapping</DialogTitle>
                        <DialogDescription>
                          Define the source-to-target mapping for data lineage tracking
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Target Selection */}
                        <div>
                          <h3 className="text-lg font-medium mb-3">Target Information</h3>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor="targetSchema">Target Schema</Label>
                              <select
                                id="targetSchema"
                                value={newLineage.targetSchema}
                                onChange={(e) =>
                                  setNewLineage({
                                    ...newLineage,
                                    targetSchema: e.target.value,
                                    targetTable: "",
                                    targetColumn: "",
                                  })
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                              >
                                <option value="">Select Schema</option>
                                {mockSchemas.map((schema) => (
                                  <option key={schema} value={schema}>
                                    {schema}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <Label htmlFor="targetTable">Target Table</Label>
                              <select
                                id="targetTable"
                                value={newLineage.targetTable}
                                onChange={(e) =>
                                  setNewLineage({ ...newLineage, targetTable: e.target.value, targetColumn: "" })
                                }
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                                disabled={!newLineage.targetSchema}
                              >
                                <option value="">Select Table</option>
                                {getAvailableTables(newLineage.targetSchema).map((table) => (
                                  <option key={table} value={table}>
                                    {table}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <Label htmlFor="targetColumn">Target Column</Label>
                              <select
                                id="targetColumn"
                                value={newLineage.targetColumn}
                                onChange={(e) => setNewLineage({ ...newLineage, targetColumn: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                                disabled={!newLineage.targetTable}
                              >
                                <option value="">Select Column</option>
                                {getAvailableColumns(newLineage.targetTable).map((column) => (
                                  <option key={column} value={column}>
                                    {column}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Mapping Type */}
                        <div>
                          <h3 className="text-lg font-medium mb-3">Mapping Configuration</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="mappingType">Mapping Type</Label>
                              <select
                                id="mappingType"
                                value={newLineage.mappingType}
                                onChange={(e) => setNewLineage({ ...newLineage, mappingType: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                              >
                                <option value="One-to-One">One-to-One</option>
                                <option value="Many-to-One">Many-to-One</option>
                                <option value="System Field">System Field</option>
                              </select>
                            </div>
                            <div>
                              <Label>Transformation Type</Label>
                              <div className="flex space-x-4 mt-2">
                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name="transformationType"
                                    value="Direct"
                                    checked={newLineage.transformationType === "Direct"}
                                    onChange={(e) =>
                                      setNewLineage({ ...newLineage, transformationType: e.target.value })
                                    }
                                    className="mr-2"
                                  />
                                  Direct
                                </label>
                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name="transformationType"
                                    value="Conditional"
                                    checked={newLineage.transformationType === "Conditional"}
                                    onChange={(e) =>
                                      setNewLineage({ ...newLineage, transformationType: e.target.value })
                                    }
                                    className="mr-2"
                                  />
                                  Conditional
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Source Selection */}
                        {newLineage.mappingType !== "System Field" && (
                          <div>
                            <div className="flex justify-between items-center mb-3">
                              <h3 className="font-medium">Source Information</h3>
                              {newLineage.mappingType === "Many-to-One" && (
                                <Button type="button" variant="outline" size="sm" onClick={handleAddSource}>
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Source
                                </Button>
                              )}
                            </div>
                            {newLineage.sources.map((source, index) => (
                              <div
                                key={index}
                                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4"
                              >
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="font-medium">Source {index + 1}</h4>
                                  {newLineage.mappingType === "Many-to-One" && newLineage.sources.length > 1 && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleRemoveSource(index)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                  <div>
                                    <Label>Source Schema</Label>
                                    <select
                                      value={source.schema}
                                      onChange={(e) => handleSourceChange(index, "schema", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                                    >
                                      <option value="">Select Schema</option>
                                      {mockSchemas.map((schema) => (
                                        <option key={schema} value={schema}>
                                          {schema}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <Label>Source Table</Label>
                                    <select
                                      value={source.table}
                                      onChange={(e) => handleSourceChange(index, "table", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                                      disabled={!source.schema}
                                    >
                                      <option value="">Select Table</option>
                                      {getAvailableTables(source.schema).map((table) => (
                                        <option key={table} value={table}>
                                          {table}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <Label>Source Column</Label>
                                    <select
                                      value={source.column}
                                      onChange={(e) => handleSourceChange(index, "column", e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                                      disabled={!source.table}
                                    >
                                      <option value="">Select Column</option>
                                      {getAvailableColumns(source.table).map((column) => (
                                        <option key={column} value={column}>
                                          {column}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div>
                                  <Label>Transformation Type</Label>
                                  <div className="flex space-x-4 mt-2">
                                    <label className="flex items-center">
                                      <input
                                        type="radio"
                                        name={`sourceTransformationType${index}`}
                                        value="Direct"
                                        checked={source.transformationType === "Direct"}
                                        onChange={(e) =>
                                          handleSourceChange(index, "transformationType", e.target.value)
                                        }
                                        className="mr-2"
                                      />
                                      Direct
                                    </label>
                                    <label className="flex items-center">
                                      <input
                                        type="radio"
                                        name={`sourceTransformationType${index}`}
                                        value="Conditional"
                                        checked={source.transformationType === "Conditional"}
                                        onChange={(e) =>
                                          handleSourceChange(index, "transformationType", e.target.value)
                                        }
                                        className="mr-2"
                                      />
                                      Conditional
                                    </label>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Transformation Logic */}
                        <div>
                          <Label htmlFor="transformationLogic">Transformation Logic</Label>
                          <Textarea
                            id="transformationLogic"
                            value={newLineage.transformationLogic}
                            onChange={(e) => setNewLineage({ ...newLineage, transformationLogic: e.target.value })}
                            placeholder="Enter transformation logic or SQL expression"
                            rows={4}
                          />
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateLineage} disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Lineage"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Quick Add Form */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="quickSchema">Schema</Label>
                  <select
                    id="quickSchema"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  >
                    <option value="">Select Schema</option>
                    {mockSchemas.map((schema) => (
                      <option key={schema} value={schema}>
                        {schema}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="quickTable">Table</Label>
                  <select
                    id="quickTable"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  >
                    <option value="">Select Table</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="quickColumn">Column</Label>
                  <select
                    id="quickColumn"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  >
                    <option value="">Select Column</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-center">
                <Button onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lineage Mapping
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Lineage Dialog */}
      <Dialog
        open={showEditDialog}
        onOpenChange={(open) => {
          setShowEditDialog(open)
          if (!open) {
            setEditingLineage(null)
            resetForm()
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Data Lineage Mapping</DialogTitle>
            <DialogDescription>Update the source-to-target mapping for data lineage tracking</DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* Target Selection */}
            <div>
              <h3 className="text-lg font-medium mb-3">Target Information</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="editTargetSchema">Target Schema</Label>
                  <select
                    id="editTargetSchema"
                    value={newLineage.targetSchema}
                    onChange={(e) =>
                      setNewLineage({
                        ...newLineage,
                        targetSchema: e.target.value,
                        targetTable: "",
                        targetColumn: "",
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  >
                    <option value="">Select Schema</option>
                    {mockSchemas.map((schema) => (
                      <option key={schema} value={schema}>
                        {schema}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="editTargetTable">Target Table</Label>
                  <select
                    id="editTargetTable"
                    value={newLineage.targetTable}
                    onChange={(e) => setNewLineage({ ...newLineage, targetTable: e.target.value, targetColumn: "" })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    disabled={!newLineage.targetSchema}
                  >
                    <option value="">Select Table</option>
                    {getAvailableTables(newLineage.targetSchema).map((table) => (
                      <option key={table} value={table}>
                        {table}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="editTargetColumn">Target Column</Label>
                  <select
                    id="editTargetColumn"
                    value={newLineage.targetColumn}
                    onChange={(e) => setNewLineage({ ...newLineage, targetColumn: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                    disabled={!newLineage.targetTable}
                  >
                    <option value="">Select Column</option>
                    {getAvailableColumns(newLineage.targetTable).map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Mapping Type */}
            <div>
              <h3 className="text-lg font-medium mb-3">Mapping Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editMappingType">Mapping Type</Label>
                  <select
                    id="editMappingType"
                    value={newLineage.mappingType}
                    onChange={(e) => setNewLineage({ ...newLineage, mappingType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                  >
                    <option value="One-to-One">One-to-One</option>
                    <option value="Many-to-One">Many-to-One</option>
                    <option value="System Field">System Field</option>
                  </select>
                </div>
                <div>
                  <Label>Transformation Type</Label>
                  <div className="flex space-x-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="editTransformationType"
                        value="Direct"
                        checked={newLineage.transformationType === "Direct"}
                        onChange={(e) => setNewLineage({ ...newLineage, transformationType: e.target.value })}
                        className="mr-2"
                      />
                      Direct
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="editTransformationType"
                        value="Conditional"
                        checked={newLineage.transformationType === "Conditional"}
                        onChange={(e) => setNewLineage({ ...newLineage, transformationType: e.target.value })}
                        className="mr-2"
                      />
                      Conditional
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Source Selection */}
            {newLineage.mappingType !== "System Field" && (
              <div>
                <h3 className="font-medium mb-3">Source Information</h3>
                {newLineage.sources.map((source, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4">
                    <h4 className="font-medium mb-3">Source {index + 1}</h4>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label>Source Schema</Label>
                        <select
                          value={source.schema}
                          onChange={(e) => handleSourceChange(index, "schema", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                        >
                          <option value="">Select Schema</option>
                          {mockSchemas.map((schema) => (
                            <option key={schema} value={schema}>
                              {schema}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label>Source Table</Label>
                        <select
                          value={source.table}
                          onChange={(e) => handleSourceChange(index, "table", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                          disabled={!source.schema}
                        >
                          <option value="">Select Table</option>
                          {getAvailableTables(source.schema).map((table) => (
                            <option key={table} value={table}>
                              {table}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label>Source Column</Label>
                        <select
                          value={source.column}
                          onChange={(e) => handleSourceChange(index, "column", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                          disabled={!source.table}
                        >
                          <option value="">Select Column</option>
                          {getAvailableColumns(source.table).map((column) => (
                            <option key={column} value={column}>
                              {column}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <Label>Transformation Type</Label>
                      <div className="flex space-x-4 mt-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`editSourceTransformationType${index}`}
                            value="Direct"
                            checked={source.transformationType === "Direct"}
                            onChange={(e) => handleSourceChange(index, "transformationType", e.target.value)}
                            className="mr-2"
                          />
                          Direct
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name={`editSourceTransformationType${index}`}
                            value="Conditional"
                            checked={source.transformationType === "Conditional"}
                            onChange={(e) => handleSourceChange(index, "transformationType", e.target.value)}
                            className="mr-2"
                          />
                          Conditional
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Transformation Logic */}
            <div>
              <Label htmlFor="editTransformationLogic">Transformation Logic</Label>
              <Textarea
                id="editTransformationLogic"
                value={newLineage.transformationLogic}
                onChange={(e) => setNewLineage({ ...newLineage, transformationLogic: e.target.value })}
                placeholder="Enter transformation logic or SQL expression"
                rows={4}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateLineage} disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Lineage"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
