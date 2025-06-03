
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import GoalCard from '@/components/GoalCard';
import AddGoalForm from '@/components/AddGoalForm';
import GoalChart from '@/components/GoalChart';
import { mockGoals, mockTimeEntries, getGoalTimeSpent, getGoalLastUpdated } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { PlusIcon, BarChart3 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [goals, setGoals] = useState(mockGoals);
  const [timeEntries, setTimeEntries] = useState(mockTimeEntries);
  const [addingGoal, setAddingGoal] = useState(false);
  const { toast } = useToast();

  const handleAddGoal = (newGoal: { title: string; description: string; targetTime: number }) => {
    const goal = {
      id: `g${Date.now()}`,
      title: newGoal.title,
      description: newGoal.description,
      targetTime: newGoal.targetTime,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    };
    
    setGoals([...goals, goal]);
    setAddingGoal(false);
    
    toast({
      title: "Goal Added",
      description: `"${goal.title}" has been added to your goals.`
    });
  };

  return (
    <Layout>
      <div className="page-container">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="heading-lg">Your Dashboard</h1>
            <p className="text-muted-foreground">Track your progress and manage your goals.</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusIcon size={18} />
                <span>Add New Goal</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <AddGoalForm 
                onAddGoal={handleAddGoal} 
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Chart Section */}
        <section className="mb-12">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="text-primary" />
              <h2 className="heading-sm">Time Tracking Overview</h2>
            </div>
            <p className="text-muted-foreground">Visualize your time investment across all goals.</p>
          </div>
          
          <GoalChart 
            timeEntries={timeEntries}
            goals={goals}
          />
        </section>
        
        {/* Goals Section */}
        <section>
          <div className="mb-6">
            <h2 className="heading-sm mb-2">Your Goals</h2>
            <p className="text-muted-foreground">View and manage your current goals.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {goals.map((goal) => (
              <GoalCard 
                key={goal.id}
                id={goal.id}
                title={goal.title}
                targetTime={goal.targetTime}
                spentTime={getGoalTimeSpent(goal.id)}
                lastUpdated={getGoalLastUpdated(goal.id) || goal.updatedAt}
              />
            ))}
            
            {/* Add Goal Card Placeholder */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="border-2 border-dashed border-muted rounded-lg flex items-center justify-center h-full min-h-[200px]"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="h-full w-full flex flex-col items-center justify-center gap-3 p-8">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <PlusIcon className="h-6 w-6 text-primary" />
                    </div>
                    <span className="font-medium">Add New Goal</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <AddGoalForm 
                    onAddGoal={handleAddGoal} 
                  />
                </DialogContent>
              </Dialog>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
