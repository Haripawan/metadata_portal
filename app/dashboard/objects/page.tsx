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
import { Plus, Edit, Trash2, Key, Upload, Download, Database, TableIcon, Columns } from "lucide-react"

// Mock data
const mockSchemas = [
  { id: 1, name: "HR_SCHEMA", description: "Human Resources Schema", updated_ts: "2024-01-20 10:30:00" },
  { id: 2, name: "FINANCE_SCHEMA", description: "Finance Schema", updated_ts: "2024-01-19 15:45:00" },
  { id: 3, name: "INVENTORY_SCHEMA", description: "Inventory Management Schema", updated_ts: "2024-01-18 09:20:00" },
]

const mockTables = [
  {
    id: 1,
    schema: "HR_SCHEMA",
    name: "employees",
    business_definition: "Employee master data",
    updated_ts: "2024-01-20 14:30:00",
  },
  {
    id: 2,
    schema: "HR_SCHEMA",
    name: "departments",
    business_definition: "Department information",
    updated_ts: "2024-01-19 11:20:00",
  },
  {
    id: 3,
    schema: "FINANCE_SCHEMA",
    name: "accounts",
    business_definition: "Chart of accounts",
    updated_ts: "2024-01-18 16:45:00",
  },
]

const mockColumns = [
  {
    id: 1,
    name: "employee_id",
    dataType: "NUMBER",
    length: "10",
    precision: "10",
    scale: "0",
    nullable: false,
    primaryKey: true,
    partitionColumn: false,
    defaultValue: "",
    definition: "Unique employee identifier",
  },
  {
    id: 2,
    name: "first_name",
    dataType: "VARCHAR2",
    length: "50",
    precision: "",
    scale: "",
    nullable: false,
    primaryKey: false,
    partitionColumn: false,
    defaultValue: "",
    definition: "Employee first name",
  },
  {
    id: 3,
    name: "salary",
    dataType: "NUMBER",
    length: "10",
    precision: "10",
    scale: "2",
    nullable: true,
    primaryKey: false,
    partitionColumn: false,
    defaultValue: "0",
    definition: "Employee salary",
  },
]

const oracleDataTypes = ["VARCHAR2", "CHAR", "NUMBER", "DATE", "TIMESTAMP", "CLOB", "BLOB", "LONG", "RAW", "LONG RAW"]

export default function ManageObjectsPage() {
  const [activeTab, setActiveTab] = useState("schemas")
  const [schemas, setSchemas] = useState(mockSchemas)
  const [tables, setTables] = useState(mockTables)
  const [columns, setColumns] = useState(mockColumns)
  const [selectedSchema, setSelectedSchema] = useState<any>(null)
  const [selectedTable, setSelectedTable] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Dialog states
  const [showSchemaDialog, setShowSchemaDialog] = useState(false)
  const [showTableDialog, setShowTableDialog] = useState(false)
  const [showColumnDialog, setShowColumnDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)

  // Form states
  const [newSchema, setNewSchema] = useState({ name: "", description: "" })
  const [newTable, setNewTable] = useState({ schema: "", name: "", business_definition: "" })
  const [newColumn, setNewColumn] = useState({
    name: "",
    dataType: "VARCHAR2",
    length: "",
    precision: "",
    scale: "",
    nullable: true,
    primaryKey: false,
    partitionColumn: false,
    defaultValue: "",
    definition: "",
  })

  const handleCreateSchema = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const schema = {
      id: schemas.length + 1,
      ...newSchema,
      updated_ts: new Date().toISOString().replace("T", " ").substring(0, 19),
    }
    setSchemas([schema, ...schemas])
    setNewSchema({ name: "", description: "" })
    setShowSchemaDialog(false)
    setIsLoading(false)
  }

  const handleCreateTable = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const table = {
      id: tables.length + 1,
      ...newTable,
      updated_ts: new Date().toISOString().replace("T", " ").substring(0, 19),
    }
    setTables([table, ...tables])
    setNewTable({ schema: "", name: "", business_definition: "" })
    setShowTableDialog(false)
    setIsLoading(false)
  }

  const handleCreateColumn = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const column = {
      id: columns.length + 1,
      ...newColumn,
    }
    setColumns([column, ...columns])
    setNewColumn({
      name: "",
      dataType: "VARCHAR2",
      length: "",
      precision: "",
      scale: "",
      nullable: true,
      primaryKey: false,
      partitionColumn: false,
      defaultValue: "",
      definition: "",
    })
    setShowColumnDialog(false)
    setIsLoading(false)
  }

  const handlePullSchema = async () => {
    setIsLoading(true)
    // Simulate pulling schema from database
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsLoading(false)
  }

  const renderLengthFields = () => {
    const { dataType } = newColumn

    if (dataType === "VARCHAR2" || dataType === "CHAR") {
      return (
        <div>
          <Label htmlFor="length">Length</Label>
          <Input
            id="length"
            value={newColumn.length}
            onChange={(e) => setNewColumn({ ...newColumn, length: e.target.value })}
            placeholder="Enter length"
          />
        </div>
      )
    }

    if (dataType === "NUMBER") {
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="precision">Precision</Label>
            <Input
              id="precision"
              value={newColumn.precision}
              onChange={(e) => setNewColumn({ ...newColumn, precision: e.target.value })}
              placeholder="Precision"
            />
          </div>
          <div>
            <Label htmlFor="scale">Scale</Label>
            <Input
              id="scale"
              value={newColumn.scale}
              onChange={(e) => setNewColumn({ ...newColumn, scale: e.target.value })}
              placeholder="Scale"
            />
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Objects</h2>
        <p className="text-gray-600 dark:text-gray-300">Create, modify and manage schemas, tables and columns</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schemas" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Manage Schemas
          </TabsTrigger>
          <TabsTrigger value="tables" className="flex items-center gap-2">
            <TableIcon className="h-4 w-4" />
            Manage Tables
          </TabsTrigger>
          <TabsTrigger value="columns" className="flex items-center gap-2">
            <Columns className="h-4 w-4" />
            Manage Columns
          </TabsTrigger>
        </TabsList>

        {/* Schemas Tab */}
        <TabsContent value="schemas">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Database Schemas</CardTitle>
                  <CardDescription>Manage your database schemas</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handlePullSchema} disabled={isLoading}>
                    <Download className="h-4 w-4 mr-2" />
                    {isLoading ? "Pulling..." : "Pull Schema"}
                  </Button>
                  <Dialog open={showSchemaDialog} onOpenChange={setShowSchemaDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Schema
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Schema</DialogTitle>
                        <DialogDescription>Define the properties for your new schema</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="schemaName">Schema Name</Label>
                          <Input
                            id="schemaName"
                            value={newSchema.name}
                            onChange={(e) => setNewSchema({ ...newSchema, name: e.target.value })}
                            placeholder="Enter schema name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="schemaDescription">Description</Label>
                          <Textarea
                            id="schemaDescription"
                            value={newSchema.description}
                            onChange={(e) => setNewSchema({ ...newSchema, description: e.target.value })}
                            placeholder="Enter schema description"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowSchemaDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateSchema} disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Schema"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Schema Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schemas.map((schema) => (
                    <TableRow key={schema.id}>
                      <TableCell className="font-medium">{schema.name}</TableCell>
                      <TableCell>{schema.description}</TableCell>
                      <TableCell>{schema.updated_ts}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedSchema(schema)
                            setActiveTab("tables")
                          }}
                        >
                          Manage
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tables Tab */}
        <TabsContent value="tables">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Database Tables</CardTitle>
                  <CardDescription>
                    {selectedSchema ? `Tables in ${selectedSchema.name}` : "Manage your database tables"}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Import Data
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Import Data</DialogTitle>
                        <DialogDescription>Upload CSV file to import table data</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="csvFile">CSV File</Label>
                          <Input id="csvFile" type="file" accept=".csv" />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                            Cancel
                          </Button>
                          <Button>Upload</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={showTableDialog} onOpenChange={setShowTableDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Table
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Table</DialogTitle>
                        <DialogDescription>Define the properties for your new table</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="tableSchema">Schema</Label>
                          <select
                            id="tableSchema"
                            value={newTable.schema}
                            onChange={(e) => setNewTable({ ...newTable, schema: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                          >
                            <option value="">Select Schema</option>
                            {schemas.map((schema) => (
                              <option key={schema.id} value={schema.name}>
                                {schema.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="tableName">Table Name</Label>
                          <Input
                            id="tableName"
                            value={newTable.name}
                            onChange={(e) => setNewTable({ ...newTable, name: e.target.value })}
                            placeholder="Enter table name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="businessDefinition">Business Definition</Label>
                          <Textarea
                            id="businessDefinition"
                            value={newTable.business_definition}
                            onChange={(e) => setNewTable({ ...newTable, business_definition: e.target.value })}
                            placeholder="Enter business definition"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowTableDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateTable} disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Table"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Schema</TableHead>
                    <TableHead>Table Name</TableHead>
                    <TableHead>Business Definition</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tables
                    .filter((table) => !selectedSchema || table.schema === selectedSchema.name)
                    .map((table) => (
                      <TableRow key={table.id}>
                        <TableCell>
                          <Badge variant="outline">{table.schema}</Badge>
                        </TableCell>
                        <TableCell className="font-medium">{table.name}</TableCell>
                        <TableCell className="max-w-xs truncate">{table.business_definition}</TableCell>
                        <TableCell>{table.updated_ts}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedTable(table)
                                setActiveTab("columns")
                              }}
                            >
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
        </TabsContent>

        {/* Columns Tab */}
        <TabsContent value="columns">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Table Columns</CardTitle>
                  <CardDescription>
                    {selectedTable
                      ? `Columns for ${selectedTable.schema}.${selectedTable.name}`
                      : "Manage table columns"}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Import Column Data
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Import Column Data</DialogTitle>
                        <DialogDescription>Upload CSV file to import column definitions</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="columnCsvFile">CSV File</Label>
                          <Input id="columnCsvFile" type="file" accept=".csv" />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowImportDialog(false)}>
                            Cancel
                          </Button>
                          <Button>Upload</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={showColumnDialog} onOpenChange={setShowColumnDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Column
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Column</DialogTitle>
                        <DialogDescription>Define the properties for the new column</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="columnName">Column Name</Label>
                            <Input
                              id="columnName"
                              value={newColumn.name}
                              onChange={(e) => setNewColumn({ ...newColumn, name: e.target.value })}
                              placeholder="Enter column name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="dataType">Data Type</Label>
                            <select
                              id="dataType"
                              value={newColumn.dataType}
                              onChange={(e) => setNewColumn({ ...newColumn, dataType: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800"
                            >
                              {oracleDataTypes.map((type) => (
                                <option key={type} value={type}>
                                  {type}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {renderLengthFields()}

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="nullable"
                              checked={newColumn.nullable}
                              onChange={(e) => setNewColumn({ ...newColumn, nullable: e.target.checked })}
                            />
                            <Label htmlFor="nullable">Nullable</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id="primaryKey"
                              checked={newColumn.primaryKey}
                              onChange={(e) => setNewColumn({ ...newColumn, primaryKey: e.target.checked })}
                            />
                            <Label htmlFor="primaryKey">Primary Key</Label>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="partitionColumn"
                            checked={newColumn.partitionColumn}
                            onChange={(e) => setNewColumn({ ...newColumn, partitionColumn: e.target.checked })}
                          />
                          <Label htmlFor="partitionColumn">Partition Column</Label>
                        </div>

                        <div>
                          <Label htmlFor="defaultValue">Default Value (Optional)</Label>
                          <Input
                            id="defaultValue"
                            value={newColumn.defaultValue}
                            onChange={(e) => setNewColumn({ ...newColumn, defaultValue: e.target.value })}
                            placeholder="Enter default value"
                          />
                        </div>

                        <div>
                          <Label htmlFor="columnDefinition">Column Definition</Label>
                          <Textarea
                            id="columnDefinition"
                            value={newColumn.definition}
                            onChange={(e) => setNewColumn({ ...newColumn, definition: e.target.value })}
                            placeholder="Enter column definition"
                          />
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowColumnDialog(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateColumn} disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create Column"}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Column Name</TableHead>
                    <TableHead>Data Type</TableHead>
                    <TableHead>Length/Precision</TableHead>
                    <TableHead>Nullable</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Default</TableHead>
                    <TableHead>Definition</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {columns.map((column) => (
                    <TableRow key={column.id}>
                      <TableCell className="font-medium">{column.name}</TableCell>
                      <TableCell>{column.dataType}</TableCell>
                      <TableCell>
                        {column.dataType === "NUMBER"
                          ? `${column.precision}${column.scale ? `,${column.scale}` : ""}`
                          : column.length}
                      </TableCell>
                      <TableCell>
                        <Badge variant={column.nullable ? "secondary" : "destructive"}>
                          {column.nullable ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {column.primaryKey && (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">
                            <Key className="h-3 w-3 mr-1" />
                            PK
                          </Badge>
                        )}
                        {column.partitionColumn && (
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100 ml-1">
                            PART
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{column.defaultValue || "-"}</TableCell>
                      <TableCell className="max-w-xs truncate">{column.definition}</TableCell>
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
        </TabsContent>
      </Tabs>
    </div>
  )
}
