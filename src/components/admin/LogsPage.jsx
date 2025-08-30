import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card'
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Alert, 
  AlertDescription 
} from "@/components/ui/alert"
import { 
  RefreshCw, 
  Filter, 
  X, 
  Search, 
  AlertTriangle,
  Info,
  Bug,
  Shield,
  Database,
  Server,
  Loader2,
  Download,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Copy,
  CheckCircle,
  Clock,
  FileText,
  Activity,
  Zap,
  Code,
  Calendar,
  TrendingUp,
  Settings,
  Terminal
} from 'lucide-react'
import { listLogs, updateLogsFilter, clearLogsFilters } from '../../actions/logActions'
import { formatDateTime } from '@/lib/utils'
import { Label } from '../ui/label'

const LogsPage = () => {
  const dispatch = useDispatch()
  const logsList = useSelector(state => state.logsList)
  const { loading, error, logs, filteredLogs, filters } = logsList

  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedLog, setSelectedLog] = useState(null)
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [refreshInterval, setRefreshInterval] = useState(5000)
  const [viewMode, setViewMode] = useState('table') // table, cards, console
  const [timeFilter, setTimeFilter] = useState('all') // all, 1h, 6h, 24h
  const [copiedLogId, setCopiedLogId] = useState(null)
  const [showStackTrace, setShowStackTrace] = useState(true)
  const [groupBy, setGroupBy] = useState('none') // none, source, level, time
  
  useEffect(() => {
    dispatch(listLogs())
  }, [dispatch])

  const processedLogs = useMemo(() => {
   const source = filteredLogs?.length > 0 ? filteredLogs : logs

   // Sort from earliest to oldest
   return source;
  }, [filteredLogs, logs])


  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        dispatch(listLogs())
      }, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval, dispatch])

  // Statistics
  const stats = useMemo(() => {
    const total = processedLogs.length
    const errors = processedLogs.filter(l => l.levelName === 'ERROR').length
    const warnings = processedLogs.filter(l => l.levelName === 'WARN').length
    const info = processedLogs.filter(l => l.levelName === 'INFO').length
    const debug = processedLogs.filter(l => l.levelName === 'DEBUG').length
    
    // Recent activity (last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentLogs = processedLogs.filter(log => 
      new Date(log.timestamp) > oneHourAgo
    )
    
    return { total, errors, warnings, info, debug, recent: recentLogs.length }
  }, [processedLogs])

  const handleRefresh = () => {
    dispatch(listLogs())
  }

  const handleLevelFilter = (level) => {
    dispatch(updateLogsFilter({ level }))
  }

  const handleSearch = () => {
    dispatch(updateLogsFilter({ search: searchTerm }))
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setTimeFilter('all')
    setGroupBy('none')
    dispatch(clearLogsFilters())
  }

  const handleRowExpand = (logId) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId)
    } else {
      newExpanded.add(logId)
    }
    setExpandedRows(newExpanded)
  }

  const handleCopyLog = async (log) => {
    const logText = `[${log.timestamp}] ${log.levelName}: ${log.message}\nSource: ${log.source}`
    await navigator.clipboard.writeText(logText)
    setCopiedLogId(log.id)
    setTimeout(() => setCopiedLogId(null), 2000)
  }

  const exportLogs = () => {
    const csvContent = [
      ['Timestamp', 'Level', 'Source', 'Message'],
      ...processedLogs.map(log => [
        log.timestamp,
        log.levelName,
        log.source,
        log.message
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getLevelBadge = (level) => {
    const configs = {
      ERROR: { variant: "destructive", icon: AlertTriangle, color: "text-red-500" },
      WARN: { variant: "default", icon: Shield, color: "text-yellow-500", className: "bg-yellow-500 hover:bg-yellow-600" },
      INFO: { variant: "default", icon: Info, color: "text-blue-500", className: "bg-blue-500 hover:bg-blue-600" },
      DEBUG: { variant: "default", icon: Bug, color: "text-purple-500", className: "bg-purple-500 hover:bg-purple-600" }
    }
    
    const config = configs[level] || { variant: "outline", icon: FileText, color: "text-gray-500" }
    const Icon = config.icon
    
    return (
      <Badge 
        variant={config.variant} 
        className={`flex items-center gap-1 ${config.className || ''}`}
      >
        <Icon className="h-3 w-3" />
        {level}
      </Badge>
    )
  }

  const getSourceIcon = (source) => {
    if (source.includes('Database') || source.includes('db')) {
      return <Database className="h-4 w-4 mr-2 text-emerald-500" />
    } else if (source.includes('Server') || source.includes('server.js')) {
      return <Server className="h-4 w-4 mr-2 text-blue-500" />
    } else if (source.includes('controller')) {
      return <Settings className="h-4 w-4 mr-2 text-orange-500" />
    } else if (source.includes('routes') || source.includes('Routes')) {
      return <Activity className="h-4 w-4 mr-2 text-green-500" />
    } else if (source.includes('middleware')) {
      return <Zap className="h-4 w-4 mr-2 text-purple-500" />
    }
    return <Code className="h-4 w-4 mr-2 text-gray-500" />
  }

  const formatSource = (source) => {
    const parts = source.split('\\')
    const filename = parts[parts.length - 1] || source
    return filename.replace(/:\d+:\d+\)$/, '') // Remove line numbers for cleaner display
  }

  const getTimeAgo = (timestamp) => {
    const now = new Date()
    const logTime = new Date(timestamp)
    const diffMs = now - logTime
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    
    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${Math.floor(diffHours / 24)}d ago`
  }

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Terminal className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold ">
                  Logs Console
                </h1>
                <p className="text-gray-400">Real-time system monitoring and debugging</p>
              </div>
            </div>
            {autoRefresh && (
              <Badge className="bg-green-500 animate-pulse">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="table">Table</SelectItem>
                <SelectItem value="cards">Cards</SelectItem>
                <SelectItem value="console">Console</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant={showFilters ? "default" : "outline"}
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
              className="border-gray-700 hover:bg-gray-700"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            
            <Button 
              variant={autoRefresh ? "default" : "outline"}
              size="sm" 
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              Auto Refresh
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportLogs}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="bg-red-900/50 border-red-700">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>Error loading logs: {error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Dashboard */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
              <FileText className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{loading ? '-' : stats.total}</div>
              <p className="text-xs text-gray-500">All entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Errors</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{loading ? '-' : stats.errors}</div>
              <p className="text-xs text-gray-500">Critical issues</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Warnings</CardTitle>
              <Shield className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{loading ? '-' : stats.warnings}</div>
              <p className="text-xs text-gray-500">Potential issues</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Info</CardTitle>
              <Info className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{loading ? '-' : stats.info}</div>
              <p className="text-xs text-gray-500">Information</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Debug</CardTitle>
              <Bug className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-400">{loading ? '-' : stats.debug}</div>
              <p className="text-xs text-gray-500">Debug entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{loading ? '-' : stats.recent}</div>
              <p className="text-xs text-gray-500">Last hour</p>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Advanced Filters</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearFilters}
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label>Log Level</Label>
                <Select value={filters.level} onValueChange={handleLevelFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="error">Errors Only</SelectItem>
                    <SelectItem value="warn">Warnings Only</SelectItem>
                    <SelectItem value="info">Info Only</SelectItem>
                    <SelectItem value="debug">Debug Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Time Range</Label>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="1h">Last Hour</SelectItem>
                    <SelectItem value="6h">Last 6 Hours</SelectItem>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Search</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search logs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Stack Traces</Label>
                <Button
                  variant={showStackTrace ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowStackTrace(!showStackTrace)}
                  className="w-full"
                >
                  {showStackTrace ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                  {showStackTrace ? 'Hide' : 'Show'} Stack Traces
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Logs Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Log Entries</span>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                {processedLogs.length > 0 && getTimeAgo(processedLogs[0].timestamp)}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                <span className="ml-2">Loading logs...</span>
              </div>
            ) : (
              <div className="space-y-2">
                {processedLogs.length > 0 ? (
                  processedLogs.map((log, index) => (
                    <div key={log.id || index} className="group">
                      <div 
                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-700/50 transition-all duration-200 border border-gray-600/50 hover:border-gray-500"
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRowExpand(log.id || index)}
                          className="p-1 hover:text-white"
                        >
                          {expandedRows.has(log.id || index) ? 
                            <ChevronDown className="h-4 w-4" /> : 
                            <ChevronRight className="h-4 w-4" />
                          }
                        </Button>

                        <div className="flex items-center gap-2 min-w-32">
                          <div className="text-xs font-mono">
                            {log.timestamp.split(' ')[1]}
                          </div>
                          <div className="text-xs text-gray-500">
                            {getTimeAgo(log.timestamp)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 min-w-20">
                          {getLevelBadge(log.levelName)}
                        </div>

                        <div className="flex items-center gap-2 min-w-48 max-w-48">
                          {getSourceIcon(log.source)}
                          <span className="text-xs truncate font-mono">
                            {formatSource(log.source)}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{log.message}</p>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyLog(log)}
                            className="text-gray-400 hover:text-white p-1"
                          >
                            {copiedLogId === (log.id || index) ? 
                              <CheckCircle className="h-4 w-4 text-green-400" /> : 
                              <Copy className="h-4 w-4" />
                            }
                          </Button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {expandedRows.has(log.id || index) && (
                        <div className="ml-12 mt-2 p-4 rounded-lg border border-black">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Details</h4>
                              <div className="space-y-1 text-sm">
                                <div className="flex gap-2">
                                  <span className="w-16">Time:</span>
                                  <span className="font-mono">{log.timestamp}</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="w-16">Level:</span>
                                  <span className="text-black">{log.levelName} ({log.level})</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="w-16">Source:</span>
                                  <span className="font-mono text-xs break-all">{log.source}</span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <h4 className="text-sm font-medium">Message</h4>
                              <div className="p-3 rounded font-mono text-xs whitespace-pre-wrap max-h-32 overflow-y-auto">
                                {log.message}
                              </div>
                              
                              {log.stackTrace && showStackTrace && (
                                <div className="space-y-2">
                                  <h4 className="text-sm font-medium">Stack Trace</h4>
                                  <div className="p-3 rounded font-mono text-xs text-red-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
                                    {log.stackTrace}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">No logs available</p>
                    <p className="text-sm">Check your filters or try refreshing</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="text-sm">
              Showing {processedLogs.length} of {processedLogs.length} logs
            </div>
            <div className="text-sm">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </CardFooter>
        </Card>
      </div>
  )
}

export default LogsPage