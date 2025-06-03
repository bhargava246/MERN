
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface AddGoalFormProps {
  onAddGoal: (goal: { title: string; description: string; targetTime: number }) => void;
  onCancel?: () => void;
}

const AddGoalForm: React.FC<AddGoalFormProps> = ({ onAddGoal, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetTime, setTargetTime] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !targetTime) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const parsedTarget = parseFloat(targetTime);
    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      toast({
        title: "Invalid target time",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }

    onAddGoal({
      title,
      description,
      targetTime: parsedTarget,
    });

    setTitle('');
    setDescription('');
    setTargetTime('');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Add New Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Goal Title*</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Learn React"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Complete React course and build a project"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="targetTime">Target Time (hours)*</Label>
                <Input
                  id="targetTime"
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={targetTime}
                  onChange={(e) => setTargetTime(e.target.value)}
                  placeholder="50"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit">Add Goal</Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddGoalForm;
