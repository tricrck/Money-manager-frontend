import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  MapPin,
  Shield,
  User,
  CheckCircle,
  Clock,
  UserX,
  SlidersHorizontal,
  Download,
  RefreshCw,
  Save,
  Settings,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Users,
  Globe
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

const EnhancedUserFilters = ({ 
  users = [], 
  onFilterChange,
  onExport,
  onRefresh 
}) => {
  // Basic filters
  const [searchTerm, setSearchTerm] = useState('');
  const [quickFilter, setQuickFilter] = useState('all');
  
  // Advanced filters
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedCounties, setSelectedCounties] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  
  // Date filters
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [datePreset, setDatePreset] = useState('all');
  
  // Activity filters
  const [lastLoginRange, setLastLoginRange] = useState([0, 365]);
  const [verificationStatus, setVerificationStatus] = useState('all');
  
  // UI state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [savedFilters, setSavedFilters] = useState([]);
  const [filterName, setFilterName] = useState('');
  
  // Active filters count
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Mock data for demonstration
  const counties = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Meru', 'Thika', 'Malindi'];
  const languages = ['English', 'Swahili', 'Kikuyu', 'Luhya', 'Luo', 'Kalenjin', 'Kamba', 'Kisii'];
  const roles = ['Admin', 'Treasurer', 'Secretary', 'Member'];

  // Quick filter presets
  const quickFilters = [
    { value: 'all', label: 'All Users', icon: Users },
    { value: 'active', label: 'Active Users', icon: CheckCircle },
    { value: 'verified', label: 'Verified Users', icon: Shield },
    { value: 'unverified', label: 'Unverified', icon: Clock },
    { value: 'admins', label: 'Administrators', icon: Shield },
    { value: 'recent', label: 'Recent Joins', icon: Calendar },
    { value: 'inactive', label: 'Inactive Users', icon: UserX }
  ];

  // Date presets
  const datePresets = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  // Calculate active filters
  useEffect(() => {
    let count = 0;
    if (searchTerm) count++;
    if (quickFilter !== 'all') count++;
    if (selectedRoles.length > 0) count++;
    if (selectedStatuses.length > 0) count++;
    if (selectedCounties.length > 0) count++;
    if (selectedLanguages.length > 0) count++;
    if (dateRange.from || dateRange.to) count++;
    if (verificationStatus !== 'all') count++;
    if (lastLoginRange[0] > 0 || lastLoginRange[1] < 365) count++;
    
    setActiveFiltersCount(count);
  }, [searchTerm, quickFilter, selectedRoles, selectedStatuses, selectedCounties, selectedLanguages, dateRange, verificationStatus, lastLoginRange]);

  // Apply date preset
  const applyDatePreset = (preset) => {
    const now = new Date();
    let from = null, to = null;
    
    switch (preset) {
      case 'today':
        from = to = now;
        break;
      case 'week':
        from = new Date(now.setDate(now.getDate() - 7));
        to = new Date();
        break;
      case 'month':
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        to = new Date();
        break;
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        from = new Date(now.getFullYear(), quarter * 3, 1);
        to = new Date();
        break;
      case 'year':
        from = new Date(now.getFullYear(), 0, 1);
        to = new Date();
        break;
    }
    
    setDateRange({ from, to });
    setDatePreset(preset);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('');
    setQuickFilter('all');
    setSelectedRoles([]);
    setSelectedStatuses([]);
    setSelectedCounties([]);
    setSelectedLanguages([]);
    setDateRange({ from: null, to: null });
    setDatePreset('all');
    setLastLoginRange([0, 365]);
    setVerificationStatus('all');
  };

  // Save current filter set
  const saveCurrentFilters = () => {
    if (!filterName.trim()) return;
    
    const filterSet = {
      id: Date.now(),
      name: filterName,
      filters: {
        searchTerm,
        quickFilter,
        selectedRoles,
        selectedStatuses,
        selectedCounties,
        selectedLanguages,
        dateRange,
        datePreset,
        lastLoginRange,
        verificationStatus
      }
    };
    
    setSavedFilters([...savedFilters, filterSet]);
    setFilterName('');
  };

  // Load saved filter set
  const loadFilterSet = (filterSet) => {
    const { filters } = filterSet;
    setSearchTerm(filters.searchTerm);
    setQuickFilter(filters.quickFilter);
    setSelectedRoles(filters.selectedRoles);
    setSelectedStatuses(filters.selectedStatuses);
    setSelectedCounties(filters.selectedCounties);
    setSelectedLanguages(filters.selectedLanguages);
    setDateRange(filters.dateRange);
    setDatePreset(filters.datePreset);
    setLastLoginRange(filters.lastLoginRange);
    setVerificationStatus(filters.verificationStatus);
  };

  // Multi-select component
  const MultiSelect = ({ options, selected, onSelectionChange, placeholder, icon: Icon }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-between min-w-[150px]">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-4 w-4" />}
            <span className="truncate">
              {selected.length === 0 
                ? placeholder 
                : selected.length === 1 
                  ? selected[0] 
                  : `${selected.length} selected`
              }
            </span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto">
        <DropdownMenuLabel>Select {placeholder}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={selected.includes(option)}
            onCheckedChange={(checked) => {
              if (checked) {
                onSelectionChange([...selected, option]);
              } else {
                onSelectionChange(selected.filter(item => item !== option));
              }
            }}
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
        {selected.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSelectionChange([])}>
              <X className="h-4 w-4 mr-2" />
              Clear Selection
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              User Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount} active
                </Badge>
              )}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCompact(!isCompact)}
            >
              {isCompact ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost" 
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {showAdvanced ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search and Quick Filters */}
        <div className={`grid gap-4 ${isCompact ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {/* Search */}
          <div className="relative col-span-full md:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search users by name, email, phone, username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Quick Filters */}
          {!isCompact && (
            <div className="col-span-full md:col-span-2">
              <div className="flex flex-wrap gap-2">
                {quickFilters.map((filter) => {
                  const IconComponent = filter.icon;
                  return (
                    <Button
                      key={filter.value}
                      variant={quickFilter === filter.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setQuickFilter(filter.value)}
                      className="h-8"
                    >
                      <IconComponent className="h-3 w-3 mr-1" />
                      {filter.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {/* Role Filter */}
              <MultiSelect
                options={roles}
                selected={selectedRoles}
                onSelectionChange={setSelectedRoles}
                placeholder="Roles"
                icon={Shield}
              />

              {/* County Filter */}
              <MultiSelect
                options={counties}
                selected={selectedCounties}
                onSelectionChange={setSelectedCounties}
                placeholder="Counties"
                icon={MapPin}
              />

              {/* Language Filter */}
              <MultiSelect
                options={languages}
                selected={selectedLanguages}
                onSelectionChange={setSelectedLanguages}
                placeholder="Languages"
                icon={Globe}
              />

              {/* Verification Status */}
              <Select value={verificationStatus} onValueChange={setVerificationStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Verification Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                  <SelectItem value="unverified">Unverified Only</SelectItem>
                  <SelectItem value="pending">Pending Verification</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Filter */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Registration Date</Label>
                <div className="flex gap-2">
                  <Select value={datePreset} onValueChange={applyDatePreset}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      {datePresets.map((preset) => (
                        <SelectItem key={preset.value} value={preset.value}>
                          {preset.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {datePreset === 'custom' && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Calendar className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          mode="range"
                          selected={{ from: dateRange.from, to: dateRange.to }}
                          onSelect={setDateRange}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>

              {/* Activity Range */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Last Login (days ago): {lastLoginRange[0]} - {lastLoginRange[1]}
                </Label>
                <Slider
                  value={lastLoginRange}
                  onValueChange={setLastLoginRange}
                  max={365}
                  step={1}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Recent</span>
                  <span>1 Year+</span>
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Additional Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="has-profile-pic" />
                    <Label htmlFor="has-profile-pic" className="text-sm">Has Profile Picture</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="has-phone" />
                    <Label htmlFor="has-phone" className="text-sm">Has Phone Number</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="recent-activity" />
                    <Label htmlFor="recent-activity" className="text-sm">Active This Month</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Save/Load Filters */}
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Filter set name..."
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="w-48"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={saveCurrentFilters}
                  disabled={!filterName.trim()}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>

              {savedFilters.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-1" />
                      Saved Filters ({savedFilters.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Load Saved Filters</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {savedFilters.map((filterSet) => (
                      <DropdownMenuItem 
                        key={filterSet.id}
                        onClick={() => loadFilterSet(filterSet)}
                      >
                        {filterSet.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={clearAllFilters} size="sm">
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
            {activeFiltersCount > 0 && (
              <Badge variant="outline" className="text-xs">
                {users.length} users match filters
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onRefresh} size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
            <Button variant="outline" onClick={onExport} size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export Filtered
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Search: "{searchTerm}"
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchTerm('')} />
              </Badge>
            )}
            {selectedRoles.map(role => (
              <Badge key={role} variant="secondary" className="gap-1">
                Role: {role}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedRoles(selectedRoles.filter(r => r !== role))} 
                />
              </Badge>
            ))}
            {selectedCounties.map(county => (
              <Badge key={county} variant="secondary" className="gap-1">
                County: {county}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedCounties(selectedCounties.filter(c => c !== county))} 
                />
              </Badge>
            ))}
            {(dateRange.from || dateRange.to) && (
              <Badge variant="secondary" className="gap-1">
                Date: {datePreset !== 'custom' ? datePreset : 'Custom'}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    setDateRange({ from: null, to: null });
                    setDatePreset('all');
                  }} 
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedUserFilters;