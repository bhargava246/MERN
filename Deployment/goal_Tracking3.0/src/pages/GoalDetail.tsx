
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import LogTimeForm from '@/components/LogTimeForm';
import GoalChart from '@/components/GoalChart';
import { mockGoals, mockTimeEntries, getGoalTimeSpent } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, Calendar, BarChart3, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';

const GoalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [goal, setGoal] = useState(mockGoals.find(g => g.id === id));
  const [timeEntries, setTimeEntries] = useState(
    mockTimeEntries.filter(entry => entry.goalId === id)
  );
  
  useEffect(() => {
    if (!goal) {
      toast({
        title: "Goal not found",
        description: "The requested goal could not be found.",
        variant: "destructive",
      });
      navigate('/dashboard');
    }
  }, [goal, navigate, toast]);
  
  if (!goal) {
    return null;
  }
  
  const handleLogTime = (data: { goalId: string; date: Date; timeSpent: number }) => {
    const newEntry = {
      id: `t${Date.now()}`,
      goalId: data.goalId,
      date: data.date.toISOString().split('T')[0],
      timeSpent: data.timeSpent,
      createdAt: new Date().toISOString()
    };
    
    setTimeEntries([...timeEntries, newEntry]);
    toast({
      title: "Time Logged",
      description: `${data.timeSpent} hours logged for ${goal.title}.`
    });
  };
  
  const handleDeleteGoal = () => {
    toast({
      title: "Goal Deleted",
      description: `"${goal.title}" has been deleted.`
    });
    navigate('/dashboard');
  };
  
  const timeSpent = getGoalTimeSpent(goal.id);
  const progressPercentage = Math.min(Math.round((timeSpent / goal.targetTime) * 100), 100);
  const remainingTime = Math.max(goal.targetTime - timeSpent, 0);

  // Sort time entries by date (newest first)
  const sortedTimeEntries = [...timeEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return (
    <Layout>
      <div className="page-container">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4 -ml-3"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h1 className="heading-lg">{goal.title}</h1>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="flex items-center gap-1">
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Goal</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                      This will permanently delete the goal "{goal.title}" and all associated time entries.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="pt-4">
                    <Alert variant="destructive">
                      <AlertDescription>
                        This action cannot be undone.
                      </AlertDescription>
                    </Alert>
                  </div>
                  <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => {}}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDeleteGoal}>Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {goal.description && (
            <p className="text-muted-foreground mt-2">{goal.description}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Progress card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completion</span>
                    <span className="font-medium">{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Target Time</p>
                    <p className="text-xl font-medium">{goal.targetTime} hours</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time Spent</p>
                    <p className="text-xl font-medium">{timeSpent} hours</p>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Remaining</p>
                  <p className="text-xl font-medium">{remainingTime} hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Goal details card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Goal Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Created On</p>
                  <p className="font-medium">{new Date(goal.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{new Date(goal.updatedAt).toLocaleDateString()}</p>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">Goal ID</p>
                  <p className="font-medium text-xs">{goal.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Log time card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Log Time
              </CardTitle>
              <CardDescription>Record time spent on this goal</CardDescription>
            </CardHeader>
            <CardContent>
              <LogTimeForm 
                goalId={goal.id}
                goalTitle={goal.title}
                onLogTime={handleLogTime}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Chart section */}
        <div className="mb-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="text-primary" />
              <h2 className="heading-sm">Time Tracking Chart</h2>
            </div>
            <p className="text-muted-foreground">Visualize your time investment for this goal.</p>
          </div>
          
          <GoalChart 
            timeEntries={timeEntries}
            goals={[goal]}
          />
        </div>
        
        {/* Recent time entries */}
        <div>
          <h2 className="heading-sm mb-4">Time Entries</h2>
          
          {sortedTimeEntries.length === 0 ? (
            <Card className="bg-muted/30">
              <CardContent className="pt-6 text-center text-muted-foreground">
                <p>No time entries recorded yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {sortedTimeEntries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card>
                    <CardContent className="p-4 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{new Date(entry.date).toLocaleDateString()}</p>
                        <p className="text-sm text-muted-foreground">
                          Logged {new Date(entry.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-medium">{entry.timeSpent} hours</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GoalDetail;
