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
import { Plus, Edit, Trash2, Key } from "lucide-react"

// Mock data for tables
const mockTables = [
  {
    id: 1,
    name: "customers",
    schema: "public",
    columns: 8,
    constraints: 3,
    partitions: 0,
    created: "2024-01-15",
    modified: "2024-01-20",
  },
  {
    id: 2,
    name: "orders",
    schema: "public",
    columns: 12,
    constraints: 5,
    partitions: 2,
    created: "2024-01-10",
    modified: "2024-01-19",
  },
  {
    id: 3,
    name: "products",
    schema: "inventory",
    columns: 15,
    constraints: 4,
    partitions: 0,
    created: "2024-01-08",
    modified: "2024-01-18",
  },
]

// Mock data for columns
const mockColumns = [
  { name: "id", dataType: "INTEGER", nullable: false, primaryKey: true, defaultValue: "" },
  { name: "name", dataType: "VARCHAR(255)", nullable: false, primaryKey: false, defaultValue: "" },
  { name: "email", dataType: "VARCHAR(255)", nullable: false, primaryKey: false, defaultValue: "" },
  { name: "created_at", dataType: "TIMESTAMP", nullable: false, primaryKey: false, defaultValue: "CURRENT_TIMESTAMP" },
]

export default function ManageTablesPage() {
  const [tables, setTables] = useState(mockTables)
  const [selectedTable, setSelectedTable] = useState<any>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showColumnDialog, setShowColumnDialog] = useState(false)
  const [columns, setColumns] = useState(mockColumns)
  const [newTable, setNewTable] = useState({
    name: "",
    schema: "public",
    description: "",
  })
  const [newColumn, setNewColumn] = useState({
    name: "",
    dataType: "VARCHAR(255)",
    nullable: true,
    primaryKey: false,
    defaultValue: "",
  })

  const handleCreateTable = () => {
    const table = {
      id: tables.length + 1,
      ...newTable,
      columns: 0,
      constraints: 0,
      partitions: 0,
      created: new Date().toISOString().split("T")[0],
      modified: new Date().toISOString().split("T")[0],
    }
    setTables([...tables, table])
    setNewTable({ name: "", schema: "public", description: "" })
    setShowCreateDialog(false)
  }

  const handleAddColumn = () => {
    setColumns([...columns, { ...newColumn }])
    setNewColumn({
      name: "",
      dataType: "VARCHAR(255)",
      nullable: true,
      primaryKey: false,
      defaultValue: "",
    })
    setShowColumnDialog(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Manage Tables</h2>
          <p className="text-gray-600">Create and manage database tables, columns, and constraints</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Table
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Table</DialogTitle>
              <DialogDescription>Define the basic properties for your new table</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
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
                <Label htmlFor="schema">Schema</Label>
                <select
                  id="schema"
                  value={newTable.schema}
                  onChange={(e) => setNewTable({ ...newTable, schema: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="public">public</option>
                  <option value="inventory">inventory</option>
                  <option value="analytics">analytics</option>
                </select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newTable.description}
                  onChange={(e) => setNewTable({ ...newTable, description: e.target.value })}
                  placeholder="Table description (optional)"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTable}>Create Table</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tables List */}
      <Card>
        <CardHeader>
          <CardTitle>Database Tables</CardTitle>
          <CardDescription>Manage your database tables and their properties</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table Name</TableHead>
                <TableHead>Schema</TableHead>
                <TableHead>Columns</TableHead>
                <TableHead>Constraints</TableHead>
                <TableHead>Partitions</TableHead>
                <TableHead>Modified</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map((table) => (
                <TableRow key={table.id}>
                  <TableCell className="font-medium">{table.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{table.schema}</Badge>
                  </TableCell>
                  <TableCell>{table.columns}</TableCell>
                  <TableCell>{table.constraints}</TableCell>
                  <TableCell>{table.partitions}</TableCell>
                  <TableCell>{table.modified}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedTable(table)}>
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

      {/* Column Management */}
      {selectedTable && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Columns for {selectedTable.name}</CardTitle>
                <CardDescription>Manage columns, data types, and constraints</CardDescription>
              </div>
              <Dialog open={showColumnDialog} onOpenChange={setShowColumnDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Column
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Column</DialogTitle>
                    <DialogDescription>Define the properties for the new column</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="VARCHAR(255)">VARCHAR(255)</option>
                        <option value="INTEGER">INTEGER</option>
                        <option value="BIGINT">BIGINT</option>
                        <option value="DECIMAL(10,2)">DECIMAL(10,2)</option>
                        <option value="TIMESTAMP">TIMESTAMP</option>
                        <option value="DATE">DATE</option>
                        <option value="BOOLEAN">BOOLEAN</option>
                        <option value="TEXT">TEXT</option>
                      </select>
                    </div>
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
                    <div>
                      <Label htmlFor="defaultValue">Default Value</Label>
                      <Input
                        id="defaultValue"
                        value={newColumn.defaultValue}
                        onChange={(e) => setNewColumn({ ...newColumn, defaultValue: e.target.value })}
                        placeholder="Default value (optional)"
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowColumnDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddColumn}>Add Column</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Column Name</TableHead>
                  <TableHead>Data Type</TableHead>
                  <TableHead>Nullable</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {columns.map((column, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{column.name}</TableCell>
                    <TableCell>{column.dataType}</TableCell>
                    <TableCell>
                      <Badge variant={column.nullable ? "secondary" : "destructive"}>
                        {column.nullable ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {column.primaryKey && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          <Key className="h-3 w-3 mr-1" />
                          PK
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{column.defaultValue || "-"}</TableCell>
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
      )}
    </div>
  )
}
