import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert"
import { 
  Settings,
  Shield,
  Bell,
  Users,
  DollarSign,
  Globe,
  Mail,
  Database,
  Key,
  Server,
  AlertTriangle,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Smartphone,
  CreditCard,
  FileText,
  Lock,
  Loader2,
  Cpu,
  HardDrive,
  Network,
  Activity
} from 'lucide-react'

// Import Redux actions
import {
  getSettings,
  updateSettings,
  resetSettings,
  getServerInfo,
  getDBInfo,
} from '../../actions/settingActions'
import { formatCurrency } from '@/lib/utils'

const AdminSettings = () => {
  const dispatch = useDispatch()

  // Redux state selectors
  const settingsGet = useSelector((state) => state.settingsGet)
  const { loading: settingsLoading, settings: reduxSettings, error: settingsError } = settingsGet

  const settingsUpdate = useSelector((state) => state.settingsUpdate)
  const { loading: updateLoading, success: updateSuccess, error: updateError } = settingsUpdate

  const settingsReset = useSelector((state) => state.settingsReset)
  const { loading: resetLoading, success: resetSuccess, error: resetError } = settingsReset

  const serverInfoGet = useSelector((state) => state.serverInfoGet)
  const { loading: serverLoading, serverInfo, error: serverError } = serverInfoGet

  const dbInfoGet = useSelector((state) => state.dbInfoGet)
  const { loading: dbLoading, dbInfo, error: dbError } = dbInfoGet
  
  // Local state for form management
  const [settings, setSettings] = useState({
    // System Settings
    maintenanceMode: false,
    debugMode: false,
    autoBackup: true,
    maxUsersPerGroup: 50,
    defaultInterestRate: 15,
    maxLoanAmount: 500000,
    minLoanAmount: 1000,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    loanReminders: true,
    
    // Security Settings
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
    
    // Payment Settings
    mpesaEnabled: true,
    stripeEnabled: true,
    processingFee: 2.5,
    lateFeePercentage: 5,
  })

  const [showApiKey, setShowApiKey] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Load settings, server info, and database info on component mount
  useEffect(() => {
    dispatch(getSettings())
    dispatch(getServerInfo())
    dispatch(getDBInfo())
  }, [dispatch])

  // Update local settings when Redux settings are loaded
  useEffect(() => {
    if (reduxSettings && Object.keys(reduxSettings).length > 0) {
      setSettings(prev => ({
        ...prev,
        ...reduxSettings
      }))
    }
  }, [reduxSettings])

  // Reset success/error messages after showing them
  useEffect(() => {
    if (updateSuccess || resetSuccess) {
      const timer = setTimeout(() => {
        setHasUnsavedChanges(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [updateSuccess, resetSuccess])

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    dispatch(updateSettings(settings))
  }

  const handleReset = () => {
    dispatch(resetSettings())
  }

  const handleRefresh = () => {
    dispatch(getSettings())
    dispatch(getServerInfo())
    dispatch(getDBInfo())
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-500 hover:bg-green-600">Healthy</Badge>
      case 'warning':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Warning</Badge>
      case 'error':
        return <Badge className="bg-red-500 hover:bg-red-600">Error</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  const parseStorageSize = (sizeStr) => {
    if (!sizeStr) return 0;
    const [value, unit] = sizeStr.split(' ');
    const numericValue = parseFloat(value);
    switch (unit) {
      case 'GB': return numericValue * 1024 * 1024 * 1024;
      case 'MB': return numericValue * 1024 * 1024;
      case 'KB': return numericValue * 1024;
      default: return numericValue;
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Settings</h1>
          <p className="text-muted-foreground">Manage system configuration and preferences</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={settingsLoading || serverLoading || dbLoading}
          >
            {(settingsLoading || serverLoading || dbLoading) ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" disabled={resetLoading}>
                {resetLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Reset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset Settings</DialogTitle>
                <DialogDescription>
                  Are you sure you want to reset all settings to their default values? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive" onClick={handleReset}>
                  Reset Settings
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button 
            size="sm" 
            onClick={handleSave}
            disabled={updateLoading || !hasUnsavedChanges}
          >
            {updateLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Status Messages */}
      {settingsError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error loading settings: {settingsError}
          </AlertDescription>
        </Alert>
      )}

      {updateSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            Settings updated successfully!
          </AlertDescription>
        </Alert>
      )}

      {updateError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error updating settings: {updateError}
          </AlertDescription>
        </Alert>
      )}

      {resetSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            Settings reset successfully!
          </AlertDescription>
        </Alert>
      )}

      {resetError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error resetting settings: {resetError}
          </AlertDescription>
        </Alert>
      )}

      {/* System Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {serverLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                getStatusBadge(reduxSettings?.systemInfo?.serverStatus || 'unknown')
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {serverError ? 'Error loading status' : 
               reduxSettings?.systemInfo?.issues?.length > 0 ? 
               reduxSettings.systemInfo.issues[0] : 'All systems operational'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Size</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dbLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                dbInfo?.dbStats?.storageSize || reduxSettings?.databaseSize || 'N/A'
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {dbInfo?.dbStats?.collections ? `${dbInfo.dbStats.collections} collections` : 'Storage used'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Version</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {serverLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                `v${reduxSettings?.systemVersion || '0.0.0'}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {serverInfo?.os?.distro ? serverInfo.os.distro : 'Current version'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-bold">
              {serverLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : reduxSettings?.lastBackup ? (
                new Date(reduxSettings.lastBackup).toLocaleDateString()
              ) : (
                'No backup'
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {reduxSettings?.lastBackup && new Date(reduxSettings.lastBackup).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* System Details Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>System Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* CPU Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Cpu className="h-4 w-4 text-muted-foreground" />
                <Label>CPU</Label>
              </div>
              {serverInfo?.cpu ? (
                <div className="text-sm">
                  <p>{serverInfo.cpu.manufacturer} {serverInfo.cpu.brand}</p>
                  <p className="text-muted-foreground">{serverInfo.cpu.cores} cores @ {serverInfo.cpu.speed}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Loading CPU info...</p>
              )}
            </div>

            {/* Memory Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {/* <Memory className="h-4 w-4 text-muted-foreground" /> */}
                <Label>Memory</Label>
              </div>
              {serverInfo?.memory ? (
                <div className="text-sm">
                    <p>{serverInfo.memory.used} / {serverInfo.memory.total} used</p>
                    <p className="text-muted-foreground">
                    {Math.round(
                        (parseFloat(serverInfo.memory.used) / parseFloat(serverInfo.memory.total)) * 100
                    )}% utilization
                    </p>
                </div>
                ) : (
                <p className="text-sm text-muted-foreground">Loading memory info...</p>
                )}

            </div>

            {/* Disk Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-muted-foreground" />
                <Label>Disk</Label>
              </div>
              {serverInfo?.fileSystems?.[0] ? (
                <div className="text-sm">
                  <p>{serverInfo.fileSystems[0].used} / {serverInfo.fileSystems[0].size} used</p>
                  <p className="text-muted-foreground">{serverInfo.fileSystems[0].use} utilization</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Loading disk info...</p>
              )}
            </div>

            {/* Network Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Network className="h-4 w-4 text-muted-foreground" />
                <Label>Network</Label>
              </div>
              {serverInfo?.network?.[0] ? (
                <div className="text-sm">
                  <p>IP: {serverInfo.network[0].ip4 || 'N/A'}</p>
                  <p className="text-muted-foreground">Speed: {serverInfo.network[0].speed}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Loading network info...</p>
              )}
            </div>

            {/* OS Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <Label>Operating System</Label>
              </div>
              {serverInfo?.os ? (
                <div className="text-sm">
                  <p>{serverInfo.os.distro}</p>
                  <p className="text-muted-foreground">{serverInfo.os.arch} architecture</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Loading OS info...</p>
              )}
            </div>

            {/* Node Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-muted-foreground" />
                <Label>Node.js</Label>
              </div>
              {reduxSettings?.systemInfo?.nodeVersion ? (
                <div className="text-sm">
                  <p>{reduxSettings.systemInfo.nodeVersion}</p>
                  <p className="text-muted-foreground">Uptime: {reduxSettings.systemInfo.uptime}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Loading Node info...</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading Overlay for Settings */}
      {settingsLoading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading settings...</span>
        </div>
      )}

      {/* Settings Grid */}
      {!settingsLoading && (
        <div className="grid gap-4 md:grid-cols-2">
          {/* System Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>System Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance">Maintenance Mode</Label>
                  <p className="text-xs text-muted-foreground">Temporarily disable user access</p>
                </div>
                <Switch
                  id="maintenance"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="debug">Debug Mode</Label>
                  <p className="text-xs text-muted-foreground">Enable detailed logging</p>
                </div>
                <Switch
                  id="debug"
                  checked={settings.debugMode}
                  onCheckedChange={(checked) => handleSettingChange('debugMode', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="backup">Auto Backup</Label>
                  <p className="text-xs text-muted-foreground">Daily automatic backups</p>
                </div>
                <Switch
                  id="backup"
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="maxUsers">Max Users Per Group</Label>
                <Input
                  id="maxUsers"
                  type="number"
                  value={settings.maxUsersPerGroup}
                  onChange={(e) => handleSettingChange('maxUsersPerGroup', parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="2fa">Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground">Require 2FA for admin accounts</p>
                </div>
                <Switch
                  id="2fa"
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  value={settings.passwordExpiry}
                  onChange={(e) => handleSettingChange('passwordExpiry', parseInt(e.target.value))}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="maxAttempts">Max Login Attempts</Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Loan Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Loan Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultRate">Default Interest Rate (%)</Label>
                <Input
                  id="defaultRate"
                  type="number"
                  step="0.1"
                  value={settings.defaultInterestRate}
                  onChange={(e) => handleSettingChange('defaultInterestRate', parseFloat(e.target.value))}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="maxLoan">Maximum Loan Amount (KSh)</Label>
                <Input
                  id="maxLoan"
                  type="number"
                  value={settings.maxLoanAmount}
                  onChange={(e) => handleSettingChange('maxLoanAmount', parseInt(e.target.value))}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="minLoan">Minimum Loan Amount (KSh)</Label>
                <Input
                  id="minLoan"
                  type="number"
                  value={settings.minLoanAmount}
                  onChange={(e) => handleSettingChange('minLoanAmount', parseInt(e.target.value))}
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label htmlFor="lateFee">Late Fee Percentage (%)</Label>
                <Input
                  id="lateFee"
                  type="number"
                  step="0.1"
                  value={settings.lateFeePercentage}
                  onChange={(e) => handleSettingChange('lateFeePercentage', parseFloat(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="email">Email Notifications</Label>
                    <p className="text-xs text-muted-foreground">Send email alerts</p>
                  </div>
                </div>
                <Switch
                  id="email"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="sms">SMS Notifications</Label>
                    <p className="text-xs text-muted-foreground">Send SMS alerts</p>
                  </div>
                </div>
                <Switch
                  id="sms"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <Label htmlFor="push">Push Notifications</Label>
                    <p className="text-xs text-muted-foreground">Browser push notifications</p>
                  </div>
                </div>
                <Switch
                  id="push"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reminders">Loan Reminders</Label>
                  <p className="text-xs text-muted-foreground">Automatic payment reminders</p>
                </div>
                <Switch
                  id="reminders"
                  checked={settings.loanReminders}
                  onCheckedChange={(checked) => handleSettingChange('loanReminders', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payment Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Payment Integration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="mpesa">M-Pesa Integration</Label>
                  <p className="text-xs text-muted-foreground">Enable M-Pesa payments</p>
                </div>
                <Switch
                  id="mpesa"
                  checked={settings.mpesaEnabled}
                  onCheckedChange={(checked) => handleSettingChange('mpesaEnabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="stripe">Stripe Integration</Label>
                  <p className="text-xs text-muted-foreground">Enable card payments</p>
                </div>
                <Switch
                  id="stripe"
                  checked={settings.stripeEnabled}
                  onCheckedChange={(checked) => handleSettingChange('stripeEnabled', checked)}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="processingFee">Processing Fee (%)</Label>
                <Input
                  id="processingFee"
                  type="number"
                  step="0.1"
                  value={settings.processingFee}
                  onChange={(e) => handleSettingChange('processingFee', parseFloat(e.target.value))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex space-x-2">
                  <Input
                    id="apiKey"
                    type={showApiKey ? "text" : "password"}
                    value={reduxSettings?.apiKey || ''}
                    readOnly
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Database Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dbInfo ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Database Stats</Label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-medium">Name</p>
                      <p className="text-muted-foreground">{dbInfo.dbStats?.databaseName}</p>
                    </div>
                    <div>
                      <p className="font-medium">Storage Size</p>
                      <p className="text-muted-foreground">{dbInfo.dbStats?.storageSize}</p>
                    </div>
                    <div>
                      <p className="font-medium">Data Size</p>
                      <p className="text-muted-foreground">{dbInfo.dbStats?.dataSize}</p>
                    </div>
                    <div>
                      <p className="font-medium">Collections</p>
                      <p className="text-muted-foreground">{dbInfo.dbStats?.collections}</p>
                    </div>
                    <div>
                      <p className="font-medium">Indexes</p>
                      <p className="text-muted-foreground">{dbInfo.dbStats?.indexes}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <Label>Collections</Label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {dbInfo?.collectionDetails?.map((collection) => (
                    <div key={collection.name} className="p-2 border rounded">
                      <p className="font-medium">{collection.name}</p>
                      <p className="text-muted-foreground">
                        {collection.size !== 'Unknown' ? collection.size : 'Size unknown'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Loading database information...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span>Danger Zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <h3 className="font-medium text-red-800">Reset All Settings</h3>
              <p className="text-sm text-red-600">This will reset all settings to default values</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Reset Settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. All settings will be reset to their default values.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive" onClick={handleReset}>
                    Reset Settings
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
            <div>
              <h3 className="font-medium text-red-800">Clear Database</h3>
              <p className="text-sm text-red-600">Permanently delete all data from the system</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Database className="h-4 w-4 mr-2" />
                  Clear Database
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>⚠️ Permanent Data Loss Warning</DialogTitle>
                  <DialogDescription>
                    This will permanently delete ALL data including users, loans, groups, and transactions. 
                    This action cannot be undone. Make sure you have a backup before proceeding.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive">I understand, clear database</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
};

export default AdminSettings