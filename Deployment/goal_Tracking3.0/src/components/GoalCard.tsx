
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';

interface GoalCardProps {
  id: string;
  title: string;
  targetTime: number;
  spentTime: number;
  lastUpdated: string;
}

const GoalCard: React.FC<GoalCardProps> = ({ id, title, targetTime, spentTime, lastUpdated }) => {
  const progressPercentage = Math.min(Math.round((spentTime / targetTime) * 100), 100);
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-medium line-clamp-1">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Target</p>
                <p className="font-medium">{targetTime} hours</p>
              </div>
              <div>
                <p className="text-muted-foreground">Spent</p>
                <p className="font-medium">{spentTime} hours</p>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Last updated: {new Date(lastUpdated).toLocaleDateString()}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button asChild variant="outline" className="w-full">
            <Link to={`/goals/${id}`}>View Details</Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default GoalCard;
