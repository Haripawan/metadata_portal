"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search } from "lucide-react"
import { format } from "date-fns"

// Mock data for recent changes
const mockChanges = [
  {
    id: 1,
    timestamp: "2024-01-20 14:30:00",
    user: "john.doe",
    action: "Created Table",
    target: "customer_data",
    description: "Created new table with 8 columns",
    type: "table",
  },
  {
    id: 2,
    timestamp: "2024-01-20 13:45:00",
    user: "jane.smith",
    action: "Updated Lineage",
    target: "order_items.product_id",
    description: "Added lineage mapping to products.id",
    type: "lineage",
  },
  {
    id: 3,
    timestamp: "2024-01-20 12:15:00",
    user: "mike.wilson",
    action: "Modified Column",
    target: "users.email",
    description: "Changed data type from VARCHAR(100) to VARCHAR(255)",
    type: "column",
  },
  {
    id: 4,
    timestamp: "2024-01-20 11:30:00",
    user: "sarah.johnson",
    action: "Added Constraint",
    target: "orders.customer_id",
    description: "Added foreign key constraint",
    type: "constraint",
  },
  {
    id: 5,
    timestamp: "2024-01-20 10:45:00",
    user: "john.doe",
    action: "Created Partition",
    target: "sales_data",
    description: "Added monthly partition for 2024",
    type: "partition",
  },
]

export default function RecentChangesPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")

  const filteredChanges = mockChanges.filter((change) => {
    const matchesSearch =
      change.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      change.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      change.user.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || change.type === filterType
    return matchesSearch && matchesFilter
  })

  const getActionColor = (action: string) => {
    switch (action) {
      case "Created Table":
        return "bg-green-100 text-green-800"
      case "Updated Lineage":
        return "bg-blue-100 text-blue-800"
      case "Modified Column":
        return "bg-yellow-100 text-yellow-800"
      case "Added Constraint":
        return "bg-purple-100 text-purple-800"
      case "Created Partition":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Recent Changes</h2>
        <p className="text-gray-600">Track all metadata changes and modifications</p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search changes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[240px] justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Types</option>
                <option value="table">Tables</option>
                <option value="column">Columns</option>
                <option value="lineage">Lineage</option>
                <option value="constraint">Constraints</option>
                <option value="partition">Partitions</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Changes List */}
      <div className="space-y-4">
        {filteredChanges.map((change) => (
          <Card key={change.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className={getActionColor(change.action)}>{change.action}</Badge>
                    <span className="text-sm text-gray-500">{change.timestamp}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{change.target}</h3>
                  <p className="text-gray-600 text-sm mb-2">{change.description}</p>
                  <p className="text-xs text-gray-500">Modified by: {change.user}</p>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredChanges.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No changes found for the selected criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
