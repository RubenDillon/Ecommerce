// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { dashboardService } from '@services/dashboardService';
import { weatherService } from '@services/weatherService';
import { DashboardMetrics, WeatherData } from '@types/index';
import { formatCurrency, formatNumber, formatTime } from '@utils/formatters';
import { Loading } from '@components/common/Loading';
import { ErrorMessage } from '@components/common/ErrorMessage';
import { StatCard } from '@components/common/StatCard';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#FF6B9D', '#C084FC', '#34D399',
];

export const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    
    // Actualizar hora cada segundo
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [metricsData, weatherData] = await Promise.all([
        dashboardService.getMetrics(),
        weatherService.getWeather(),
      ]);
      
      setMetrics(metricsData);
      setWeather(weatherData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Cargando dashboard..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  if (!metrics) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Métricas principales */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Clientes"
            value={formatNumber(metrics.totalClientes)}
            icon={<PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />}
            color="primary.main"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Productos"
            value={formatNumber(metrics.totalProductos)}
            icon={<InventoryIcon sx={{ fontSize: 40, color: 'success.main' }} />}
            color="success.main"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Valoración Stock"
            value={formatCurrency(metrics.valoracionStock)}
            icon={<AttachMoneyIcon sx={{ fontSize: 40, color: 'warning.main' }} />}
            color="warning.main"
            subtitle="Valor total del inventario"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="body2">
                    Hora Actual
                  </Typography>
                  <Typography variant="h5" component="div">
                    {formatTime(currentTime)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Argentina (UTC-3)
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: 'info.light',
                    borderRadius: 2,
                    p: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: 40, color: 'info.main' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Clima */}
        {weather && (
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Clima en Argentina
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="h2" component="span">
                    {weather.icono}
                  </Typography>
                  <Box>
                    <Typography variant="h3" component="div">
                      {weather.temperatura}°C
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {weather.condicion}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Gráfico de productos por categoría */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Productos por Categoría
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={metrics.productosCategoria}
                    dataKey="cantidad"
                    nameKey="categoria"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {metrics.productosCategoria.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Resumen de categorías */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen de Categorías
              </Typography>
              <Grid container spacing={2}>
                {metrics.productosCategoria.map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={item.categoria}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        backgroundColor: 'background.default',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <Typography variant="body2">{item.categoria}</Typography>
                      </Box>
                      <Typography variant="h6">{item.cantidad}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};