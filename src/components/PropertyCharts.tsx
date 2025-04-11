
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, LineChart, Line, CartesianGrid, Area, AreaChart } from 'recharts';
import { Building, ArrowUp, DollarSign, TrendingUp, Map } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

type PropertyChartsProps = {
  zoningInfo?: any;
  landCosts?: any[];
  priceProjections?: any[];
};

const COLORS = ['#2A9D8F', '#E9C46A', '#F4A261', '#E76F51', '#264653'];
const AREA_COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042'];

const PropertyCharts = ({ zoningInfo, landCosts, priceProjections }: PropertyChartsProps) => {
  // Prepare zoning pie chart data
  const zoningData = zoningInfo ? [
    { name: 'Building Area', value: zoningInfo.max_building_height || 50 },
    { name: 'Open Space', value: zoningInfo.density_limit || 30 },
    { name: 'Setback', value: (zoningInfo.min_front_setback || 0) + (zoningInfo.min_side_setback || 0) + (zoningInfo.min_rear_setback || 0) || 20 },
  ] : [];

  // Prepare cost comparison data
  const costComparisonData = landCosts?.map((cost, index) => ({
    name: cost.data_source?.split(' ').slice(-1)[0] || `Source ${index + 1}`,
    cost: Number(cost.estimated_cost_per_sqft) || 0,
    fullName: cost.data_source || 'Unknown Source',
    date: cost.date_of_estimation ? new Date(cost.date_of_estimation).toLocaleDateString() : 'Unknown Date'
  })) || [];

  // Prepare price projection data with more visual appeal
  const priceProjectionData = priceProjections?.map((projection) => {
    const date = projection.projection_date ? new Date(projection.projection_date) : new Date();
    return {
      name: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      growth: Number(projection.projected_increase_percentage) || 0,
      details: projection.analysis_details || '',
      date: date
    };
  }).sort((a, b) => a.date.getTime() - b.date.getTime()) || [];

  // Calculate the average property value growth for the area chart
  const averageGrowth = priceProjectionData.length > 0 
    ? priceProjectionData.reduce((acc, curr) => acc + curr.growth, 0) / priceProjectionData.length 
    : 0;

  // Create enhanced area chart data
  const areaChartData = priceProjectionData.map((item, index) => ({
    name: item.name,
    growth: item.growth,
    optimistic: item.growth * 1.2, // Optimistic scenario
    pessimistic: item.growth * 0.8, // Pessimistic scenario
  }));

  if (!zoningInfo && (!landCosts || landCosts.length === 0) && (!priceProjections || priceProjections.length === 0)) {
    return null;
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Zoning Distribution Chart - Enhanced with 3D effect */}
      {zoningInfo && (
        <Card className="overflow-hidden bg-white shadow-md transition-shadow hover:shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-0">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <Building className="h-5 w-5 text-indigo-600" />
              Zoning Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={zoningData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {zoningData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        stroke="#fff"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name) => [`${value} units`, name]} 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconSize={10}
                    iconType="circle"
                    formatter={(value) => <span className="text-xs font-medium">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Land Cost Comparison - Enhanced with gradient bars */}
      {landCosts && landCosts.length > 0 && (
        <Card className="overflow-hidden bg-white shadow-md transition-shadow hover:shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 pb-0">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <DollarSign className="h-5 w-5 text-emerald-600" />
              Land Cost Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={costComparisonData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `₹${value/1000}K`}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-md bg-white p-3 shadow-lg">
                            <p className="font-medium">{payload[0].payload.fullName}</p>
                            <p className="text-sm text-gray-600">{payload[0].payload.date}</p>
                            <p className="mt-2 font-bold text-emerald-600">₹{payload[0].value} per sqft</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="cost" 
                    radius={[4, 4, 0, 0]}
                  >
                    {costComparisonData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`}
                        fill={`url(#colorCost${index})`}
                      />
                    ))}
                  </Bar>
                  {/* Gradient definitions for bars */}
                  <defs>
                    {costComparisonData.map((entry, index) => (
                      <linearGradient
                        key={`gradientCost${index}`}
                        id={`colorCost${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor={COLORS[index % COLORS.length]}
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor={COLORS[index % COLORS.length]}
                          stopOpacity={0.4}
                        />
                      </linearGradient>
                    ))}
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Projection Growth Chart - Enhanced with area chart */}
      {priceProjections && priceProjections.length > 0 && (
        <Card className="overflow-hidden bg-white shadow-md transition-shadow hover:shadow-lg lg:col-span-2">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 pb-0">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Price Growth Projection
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={areaChartData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `${value}%`}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={{ stroke: '#E2E8F0' }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="rounded-md bg-white p-3 shadow-lg">
                            <p className="font-medium">{label}</p>
                            <div className="mt-2 space-y-1">
                              <p className="flex items-center">
                                <span className="mr-2 h-2 w-2 rounded-full bg-purple-600"></span>
                                <span className="text-sm">Projected: </span>
                                <span className="ml-1 font-bold text-purple-600">{data.growth}%</span>
                              </p>
                              <p className="flex items-center">
                                <span className="mr-2 h-2 w-2 rounded-full bg-blue-400"></span>
                                <span className="text-sm">Optimistic: </span>
                                <span className="ml-1 font-bold text-blue-500">{data.optimistic.toFixed(1)}%</span>
                              </p>
                              <p className="flex items-center">
                                <span className="mr-2 h-2 w-2 rounded-full bg-pink-400"></span>
                                <span className="text-sm">Pessimistic: </span>
                                <span className="ml-1 font-bold text-pink-500">{data.pessimistic.toFixed(1)}%</span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={36}
                    iconSize={10}
                    iconType="circle"
                    formatter={(value) => <span className="text-xs font-medium">{value}</span>}
                  />
                  <Area
                    type="monotone"
                    dataKey="pessimistic"
                    stackId="1"
                    stroke="#F472B6"
                    fill="#FDF2F8"
                    name="Pessimistic"
                  />
                  <Area
                    type="monotone"
                    dataKey="growth"
                    stackId="2"
                    stroke="#9061F9"
                    fill="#A78BFA"
                    fillOpacity={0.6}
                    name="Projected Growth"
                  />
                  <Area
                    type="monotone"
                    dataKey="optimistic"
                    stackId="3"
                    stroke="#60A5FA"
                    fill="#EFF6FF"
                    name="Optimistic"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Average growth indicator */}
            <div className="mt-4 flex items-center justify-center rounded-md bg-gradient-to-r from-purple-50 to-pink-50 p-3">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">Average Projected Growth</p>
                <p className="text-2xl font-bold text-purple-600">{averageGrowth.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyCharts;
