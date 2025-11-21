import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  Paper,
  Chip,
} from '@mui/material';
import {
  AccountBalance,
  TrendingUp,
  CalendarToday,
  AttachMoney,
  Savings,
} from '@mui/icons-material';
import * as api from '../services/api';

const ContributionManager = () => {
  // State for contribution settings
  const [contributionType, setContributionType] = useState('percentage');
  const [contributionValue, setContributionValue] = useState(5);
  const [tempValue, setTempValue] = useState(5);

  // State for YTD data
  const [ytdData, setYtdData] = useState(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // User ID (hardcoded for demo - in production would come from auth)
  const userId = '123';

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both settings and YTD data
      const [settingsResponse, ytdResponse] = await Promise.all([
        api.getContributionSettings(userId),
        api.getContributionYTD(userId),
      ]);

      setContributionType(settingsResponse.contributionType);
      setContributionValue(settingsResponse.contributionValue);
      setTempValue(settingsResponse.contributionValue);
      setYtdData(ytdResponse);
    } catch (err) {
      setError(err.message || 'Failed to load contribution data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      await api.updateContributionSettings(userId, {
        contributionType,
        contributionValue: tempValue,
      });

      setContributionValue(tempValue);
      setSuccess(true);

      // Reload YTD data to reflect changes
      const ytdResponse = await api.getContributionYTD(userId);
      setYtdData(ytdResponse);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save contribution settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTypeChange = (event, newType) => {
    if (newType !== null) {
      setContributionType(newType);
      // Adjust default value when switching types
      if (newType === 'percentage') {
        setTempValue(5);
      } else {
        setTempValue(200);
      }
    }
  };

  const handleSliderChange = (event, newValue) => {
    setTempValue(newValue);
  };

  const handleInputChange = (event) => {
    const value = event.target.value === '' ? 0 : Number(event.target.value);
    setTempValue(value);
  };

  const handleInputBlur = () => {
    if (contributionType === 'percentage') {
      if (tempValue < 0) setTempValue(0);
      if (tempValue > 100) setTempValue(100);
    } else {
      if (tempValue < 0) setTempValue(0);
    }
  };

  // Calculate gross paycheck amount
  const calculateGrossPaycheck = () => {
    if (!ytdData) return 0;

    const { annualSalary, payFrequency } = ytdData.mockData;
    let paychecksPerYear = 26; // default biweekly

    switch (payFrequency) {
      case 'weekly':
        paychecksPerYear = 52;
        break;
      case 'biweekly':
        paychecksPerYear = 26;
        break;
      case 'semimonthly':
        paychecksPerYear = 24;
        break;
      case 'monthly':
        paychecksPerYear = 12;
        break;
    }

    return annualSalary / paychecksPerYear;
  };

  // Calculate per-paycheck contribution
  const calculatePerPaycheckContribution = () => {
    if (!ytdData) return 0;

    const { annualSalary, payFrequency } = ytdData.mockData;
    let paychecksPerYear = 26; // default biweekly

    switch (payFrequency) {
      case 'weekly':
        paychecksPerYear = 52;
        break;
      case 'biweekly':
        paychecksPerYear = 26;
        break;
      case 'semimonthly':
        paychecksPerYear = 24;
        break;
      case 'monthly':
        paychecksPerYear = 12;
        break;
    }

    if (contributionType === 'percentage') {
      return (annualSalary * (tempValue / 100)) / paychecksPerYear;
    } else {
      return tempValue;
    }
  };

  // Calculate annual contribution
  const calculateAnnualContribution = () => {
    if (!ytdData) return 0;

    const { annualSalary, payFrequency } = ytdData.mockData;
    let paychecksPerYear = 26;

    switch (payFrequency) {
      case 'weekly':
        paychecksPerYear = 52;
        break;
      case 'biweekly':
        paychecksPerYear = 26;
        break;
      case 'semimonthly':
        paychecksPerYear = 24;
        break;
      case 'monthly':
        paychecksPerYear = 12;
        break;
    }

    if (contributionType === 'percentage') {
      return annualSalary * (tempValue / 100);
    } else {
      return tempValue * paychecksPerYear;
    }
  };

  // Calculate retirement projection (simplified)
  const calculateRetirementProjection = () => {
    if (!ytdData) return { age65: 0, monthlyInRetirement: 0 };

    const currentAge = 30; // Assume user is 30 years old
    const retirementAge = 65;
    const yearsToRetirement = retirementAge - currentAge;
    const annualContribution = calculateAnnualContribution();
    const annualReturn = 0.07; // 7% annual return assumption

    // Future value of annuity formula
    const futureValue =
      annualContribution *
      ((Math.pow(1 + annualReturn, yearsToRetirement) - 1) / annualReturn);

    // 4% withdrawal rule for retirement
    const monthlyInRetirement = (futureValue * 0.04) / 12;

    return {
      age65: futureValue,
      monthlyInRetirement,
    };
  };

  const projection = calculateRetirementProjection();
  const perPaycheckContribution = calculatePerPaycheckContribution();
  const annualContribution = calculateAnnualContribution();
  const grossPaycheck = calculateGrossPaycheck();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatCurrencyDecimal = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Card sx={{ mb: 3, background: 'white' }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2}>
            <AccountBalance sx={{ fontSize: 40, color: 'primary.main' }} />
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                401(k) Contribution Manager
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Adjust your retirement savings contributions
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Contribution settings saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Main Settings Panel */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                Contribution Settings
              </Typography>

              {/* Contribution Type Selector */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Contribution Type
                </Typography>
                <ToggleButtonGroup
                  value={contributionType}
                  exclusive
                  onChange={handleTypeChange}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  <ToggleButton value="percentage">
                    <Box textAlign="center">
                      <Typography variant="body1" fontWeight={600}>
                        Percentage
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        % of paycheck
                      </Typography>
                    </Box>
                  </ToggleButton>
                  <ToggleButton value="fixed">
                    <Box textAlign="center">
                      <Typography variant="body1" fontWeight={600}>
                        Fixed Amount
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        $ per paycheck
                      </Typography>
                    </Box>
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {/* Contribution Value Slider */}
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Contribution Amount
                </Typography>
                <Box sx={{ px: 2, mt: 3 }}>
                  <Slider
                    value={tempValue}
                    onChange={handleSliderChange}
                    min={0}
                    max={contributionType === 'percentage' ? 100 : 1000}
                    step={contributionType === 'percentage' ? 0.5 : 10}
                    marks={
                      contributionType === 'percentage'
                        ? [
                            { value: 0, label: '0%' },
                            { value: 25, label: '25%' },
                            { value: 50, label: '50%' },
                            { value: 75, label: '75%' },
                            { value: 100, label: '100%' },
                          ]
                        : [
                            { value: 0, label: '$0' },
                            { value: 250, label: '$250' },
                            { value: 500, label: '$500' },
                            { value: 750, label: '$750' },
                            { value: 1000, label: '$1000' },
                          ]
                    }
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) =>
                      contributionType === 'percentage'
                        ? `${value}%`
                        : `$${value}`
                    }
                  />
                </Box>
                <TextField
                  value={tempValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  type="number"
                  fullWidth
                  sx={{ mt: 2 }}
                  InputProps={{
                    startAdornment: contributionType === 'fixed' ? '$' : '',
                    endAdornment: contributionType === 'percentage' ? '%' : '',
                  }}
                  inputProps={{
                    min: 0,
                    max: contributionType === 'percentage' ? 100 : undefined,
                    step: contributionType === 'percentage' ? 0.5 : 10,
                  }}
                />
              </Box>

              {/* Contribution Impact */}
              <Paper sx={{ p: 3, bgcolor: 'primary.50', mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  Contribution Impact
                </Typography>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Per Paycheck
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {formatCurrencyDecimal(perPaycheckContribution)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Annual
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {formatCurrency(annualContribution)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Save Button */}
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleSave}
                disabled={saving || tempValue === contributionValue}
                sx={{ py: 1.5 }}
              >
                {saving ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Side Panel - YTD and Projections */}
        <Grid item xs={12} md={4}>
          {/* YTD Statistics */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <CalendarToday color="primary" />
                <Typography variant="h6">Year-to-Date</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Contributions
                </Typography>
                <Typography variant="h5" color="primary" fontWeight={600}>
                  {ytdData && formatCurrency(ytdData.ytdContributions)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Paychecks Contributed This Year
                </Typography>
                <Typography variant="h6">
                  {ytdData && ytdData.ytdPaychecks}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Year Start: {ytdData && ytdData.currentYearStart}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Mock Data Info */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <AttachMoney color="primary" />
                <Typography variant="h6">Your Profile</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Annual Salary
                  </Typography>
                  <Typography variant="h6">
                    {ytdData && formatCurrency(ytdData.mockData.annualSalary)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Gross Paycheck
                  </Typography>
                  <Typography variant="h6">
                    {ytdData && formatCurrencyDecimal(grossPaycheck)}
                  </Typography>
                </Grid>
              </Grid>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Pay Frequency
                </Typography>
                <Chip
                  label={ytdData && ytdData.mockData.payFrequency}
                  size="small"
                  sx={{ mt: 1, textTransform: 'capitalize' }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Retirement Projection */}
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <TrendingUp color="success" />
                <Typography variant="h6">Retirement Projection</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Alert severity="info" sx={{ mb: 2, fontSize: '0.75rem' }}>
                Assumes: Age 30 → 65, 7% annual return
              </Alert>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Balance at Age 65
                </Typography>
                <Typography variant="h5" color="success.main" fontWeight={600}>
                  {formatCurrency(projection.age65)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Monthly Income (4% rule)
                </Typography>
                <Typography variant="h6" color="success.main">
                  {formatCurrency(projection.monthlyInRetirement)}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContributionManager;
