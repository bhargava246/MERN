
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Label
} from 'recharts';

interface TimeEntry {
  goalId: string;
  date: string;
  timeSpent: number;
}

interface Goal {
  id: string;
  title: string;
  color?: string;
}

interface GoalChartProps {
  timeEntries: TimeEntry[];
  goals: Goal[];
}

// Generate a palette of colors
const defaultColors = [
  "#3498db", "#2ecc71", "#9b59b6", "#e67e22", "#f1c40f", 
  "#1abc9c", "#e74c3c", "#34495e", "#16a085", "#d35400"
];

const GoalChart: React.FC<GoalChartProps> = ({ timeEntries, goals }) => {
  const [viewMode, setViewMode] = React.useState('overall');
  const [selectedGoalId, setSelectedGoalId] = React.useState<string>('');

  // Process time entries for charting
  const processDataForChart = () => {
    // Group by date
    const entriesByDate = timeEntries.reduce((acc, entry) => {
      const date = entry.date;
      if (!acc[date]) {
        acc[date] = {};
      }
      if (!acc[date][entry.goalId]) {
        acc[date][entry.goalId] = 0;
      }
      acc[date][entry.goalId] += entry.timeSpent;
      return acc;
    }, {} as Record<string, Record<string, number>>);
    
    // Convert to chart data format
    return Object.keys(entriesByDate)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map(date => {
        const entry = { date };
        goals.forEach(goal => {
          Object.assign(entry, { 
            [goal.id]: entriesByDate[date]?.[goal.id] || 0 
          });
        });
        // Add a total column for overall view
        const total = Object.values(entriesByDate[date] || {}).reduce((sum, value) => sum + value, 0);
        Object.assign(entry, { total });
        
        return entry;
      });
  };
  
  const chartData = processDataForChart();
  
  // Get data for the specific view mode
  const getChartData = () => {
    if (viewMode === 'overall') {
      return chartData;
    } else if (viewMode === 'goal' && selectedGoalId) {
      return chartData.map(entry => ({
        date: entry.date,
        value: entry[selectedGoalId] || 0
      }));
    }
    return [];
  };

  // Assign colors to goals
  const goalColors = goals.reduce((acc, goal, index) => {
    acc[goal.id] = goal.color || defaultColors[index % defaultColors.length];
    return acc;
  }, {} as Record<string, string>);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Time Tracking Chart</CardTitle>
          <Tabs 
            defaultValue="overall" 
            value={viewMode} 
            onValueChange={setViewMode}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overall">Overall</TabsTrigger>
              <TabsTrigger value="goal">By Goal</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {viewMode === 'goal' && (
          <div className="mt-4">
            <Select 
              value={selectedGoalId} 
              onValueChange={setSelectedGoalId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a goal" />
              </SelectTrigger>
              <SelectContent>
                {goals.map(goal => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      <CardContent className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={getChartData()}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            >
              <Label value="Date" offset={-20} position="insideBottom" />
            </XAxis>
            <YAxis>
              <Label value="Hours" angle={-90} position="insideLeft" style={{ textAnchor: 'middle' }} />
            </YAxis>
            <Tooltip 
              formatter={(value) => [`${value} hours`, '']}
              labelFormatter={(label) => new Date(label).toLocaleDateString()}
            />
            <Legend />
            
            {viewMode === 'overall' && (
              <>
                {goals.map(goal => (
                  <Line
                    key={goal.id}
                    type="monotone"
                    dataKey={goal.id}
                    name={goal.title}
                    stroke={goalColors[goal.id]}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                ))}
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Total"
                  stroke="#000"
                  activeDot={{ r: 8 }}
                  strokeWidth={2.5}
                />
              </>
            )}
            
            {viewMode === 'goal' && selectedGoalId && (
              <Line
                type="monotone"
                dataKey="value"
                name={goals.find(g => g.id === selectedGoalId)?.title || 'Selected Goal'}
                stroke={goalColors[selectedGoalId] || '#3498db'}
                activeDot={{ r: 8 }}
                strokeWidth={2.5}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GoalChart;
