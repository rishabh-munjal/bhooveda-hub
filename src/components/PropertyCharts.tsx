
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Building, ArrowUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type PropertyChartsProps = {
  zoningInfo?: any;
  landCosts?: any[];
  priceProjections?: any[];
};

const COLORS = ['#2A9D8F', '#E9C46A', '#F4A261', '#E76F51', '#264653'];

const PropertyCharts = ({ zoningInfo, landCosts, priceProjections }: PropertyChartsProps) => {
  // Prepare zoning pie chart data
  const zoningData = zoningInfo ? [
    { name: 'Building Area', value: zoningInfo.max_building_height || 50 },
    { name: 'Open Space', value: zoningInfo.min_open_space || 30 },
    { name: 'Setback', value: zoningInfo.min_front_setback || 20 },
  ] : [];

  // Prepare cost comparison data
  const costComparisonData = landCosts?.map(cost => ({
    name: cost.data_source || 'Source',
    cost: Number(cost.estimated_cost_per_sqft) || 0
  })) || [];

  // Prepare price projection data
  const priceProjectionData = priceProjections?.map((projection, index) => ({
    name: `Year ${index + 1}`,
    growth: Number(projection.projected_increase_percentage) || 0
  })) || [];

  if (!zoningInfo && (!landCosts || landCosts.length === 0) && (!priceProjections || priceProjections.length === 0)) {
    return null;
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Zoning Distribution Chart */}
      {zoningInfo && (
        <Card className="overflow-hidden bg-white">
          <CardHeader className="bg-gray-50 pb-0">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <Building className="h-5 w-5 text-primary" />
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
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} units`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Land Cost Comparison */}
      {landCosts && landCosts.length > 0 && (
        <Card className="overflow-hidden bg-white">
          <CardHeader className="bg-gray-50 pb-0">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <DollarSign className="h-5 w-5 text-green-500" />
              Land Cost Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={costComparisonData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}/sqft`, 'Cost']} />
                  <Bar dataKey="cost" fill="#2A9D8F" name="Cost per Sqft" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Price Projection Growth Chart */}
      {priceProjections && priceProjections.length > 0 && (
        <Card className="overflow-hidden bg-white lg:col-span-2">
          <CardHeader className="bg-gray-50 pb-0">
            <CardTitle className="flex items-center gap-2 text-lg font-medium">
              <ArrowUp className="h-5 w-5 text-purple-500" />
              Price Growth Projection
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priceProjectionData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, 'Growth']} />
                  <Bar dataKey="growth" fill="#E9C46A" name="Growth Percentage" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PropertyCharts;
