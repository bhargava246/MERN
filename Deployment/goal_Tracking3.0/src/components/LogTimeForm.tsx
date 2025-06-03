
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogTimeFormProps {
  goalId: string;
  goalTitle: string;
  onLogTime: (data: { goalId: string; date: Date; timeSpent: number }) => void;
  onCancel?: () => void;
}

const LogTimeForm: React.FC<LogTimeFormProps> = ({ goalId, goalTitle, onLogTime, onCancel }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [timeSpent, setTimeSpent] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !timeSpent) {
      toast({
        title: "Missing fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    const parsedTime = parseFloat(timeSpent);
    if (isNaN(parsedTime) || parsedTime <= 0) {
      toast({
        title: "Invalid time",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }

    onLogTime({
      goalId,
      date,
      timeSpent: parsedTime,
    });

    setDate(new Date());
    setTimeSpent('');
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-lg">Log Time for "{goalTitle}"</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(day) => day && setDate(day)}
                  initialFocus
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="timeSpent">Time Spent (hours)</Label>
            <Input
              id="timeSpent"
              type="number"
              min="0.1"
              step="0.1"
              value={timeSpent}
              onChange={(e) => setTimeSpent(e.target.value)}
              placeholder="1.5"
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
          <Button type="submit">Log Time</Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LogTimeForm;
