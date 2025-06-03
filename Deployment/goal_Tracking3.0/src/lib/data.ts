
export interface Goal {
  id: string;
  title: string;
  description: string;
  targetTime: number;
  createdAt: string;
  updatedAt: string;
  color?: string;
}

export interface TimeEntry {
  id: string;
  goalId: string;
  date: string;
  timeSpent: number;
  createdAt: string;
}

// Mock data for development
export const mockGoals: Goal[] = [
  {
    id: "g1",
    title: "Learn React",
    description: "Complete React course and build a project",
    targetTime: 50,
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2023-06-10T00:00:00Z",
    color: "#3498db"
  },
  {
    id: "g2",
    title: "Learn Node.js",
    description: "Master backend development with Node.js",
    targetTime: 40,
    createdAt: "2023-06-05T00:00:00Z",
    updatedAt: "2023-06-15T00:00:00Z",
    color: "#2ecc71"
  },
  {
    id: "g3",
    title: "Build MERN Project",
    description: "Create a full-stack MERN application",
    targetTime: 60,
    createdAt: "2023-06-10T00:00:00Z",
    updatedAt: "2023-06-20T00:00:00Z",
    color: "#e74c3c"
  },
  {
    id: "g4",
    title: "Learn TypeScript",
    description: "Master TypeScript for better type safety",
    targetTime: 30,
    createdAt: "2023-06-15T00:00:00Z",
    updatedAt: "2023-06-25T00:00:00Z",
    color: "#9b59b6"
  }
];

export const mockTimeEntries: TimeEntry[] = [
  // Goal 1 - Learn React
  {
    id: "t1",
    goalId: "g1",
    date: "2023-06-01",
    timeSpent: 2,
    createdAt: "2023-06-01T18:00:00Z"
  },
  {
    id: "t2",
    goalId: "g1",
    date: "2023-06-02",
    timeSpent: 1.5,
    createdAt: "2023-06-02T18:00:00Z"
  },
  {
    id: "t3",
    goalId: "g1",
    date: "2023-06-03",
    timeSpent: 3,
    createdAt: "2023-06-03T18:00:00Z"
  },
  {
    id: "t4",
    goalId: "g1",
    date: "2023-06-05",
    timeSpent: 2.5,
    createdAt: "2023-06-05T18:00:00Z"
  },
  
  // Goal 2 - Learn Node.js
  {
    id: "t5",
    goalId: "g2",
    date: "2023-06-02",
    timeSpent: 1,
    createdAt: "2023-06-02T19:00:00Z"
  },
  {
    id: "t6",
    goalId: "g2",
    date: "2023-06-04",
    timeSpent: 2,
    createdAt: "2023-06-04T19:00:00Z"
  },
  {
    id: "t7",
    goalId: "g2",
    date: "2023-06-06",
    timeSpent: 1.5,
    createdAt: "2023-06-06T19:00:00Z"
  },
  
  // Goal 3 - Build MERN Project
  {
    id: "t8",
    goalId: "g3",
    date: "2023-06-04",
    timeSpent: 3,
    createdAt: "2023-06-04T20:00:00Z"
  },
  {
    id: "t9",
    goalId: "g3",
    date: "2023-06-05",
    timeSpent: 2,
    createdAt: "2023-06-05T20:00:00Z"
  },
  
  // Goal 4 - Learn TypeScript
  {
    id: "t10",
    goalId: "g4",
    date: "2023-06-03",
    timeSpent: 1,
    createdAt: "2023-06-03T21:00:00Z"
  },
  {
    id: "t11",
    goalId: "g4",
    date: "2023-06-06",
    timeSpent: 2,
    createdAt: "2023-06-06T21:00:00Z"
  }
];

// Helper function to get total time spent on a goal
export const getGoalTimeSpent = (goalId: string) => {
  return mockTimeEntries
    .filter(entry => entry.goalId === goalId)
    .reduce((total, entry) => total + entry.timeSpent, 0);
};

// Helper function to get the latest update date for a goal
export const getGoalLastUpdated = (goalId: string) => {
  const entries = mockTimeEntries.filter(entry => entry.goalId === goalId);
  if (entries.length === 0) return "";
  
  return entries
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0].date;
};
