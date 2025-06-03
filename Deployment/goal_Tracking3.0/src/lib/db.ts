import mongoose from 'mongoose';

// MongoDB connection URL
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb://localhost:27017/Goal_Tracking';

let isConnected = false;

// Connect to MongoDB with retry logic
export const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 5000; // 5 seconds

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(MONGODB_URL);
      isConnected = true;
      console.log('\x1b[32m%s\x1b[0m', 'SUCCESS: Connected to MongoDB successfully');
      console.log('Connection Status:', isConnected ? 'Connected' : 'Disconnected');
      
      // Handle connection events
      mongoose.connection.on('error', (error) => {
        console.error('MongoDB connection error:', error);
        isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
        isConnected = false;
      });

      return;
    } catch (error) {
      console.error('\x1b[31m%s\x1b[0m', 'FAIL: MongoDB connection attempt failed');
      console.error(`Attempt ${attempt}/${MAX_RETRIES} failed with error:`, error);
      if (attempt === MAX_RETRIES) {
        console.error('\x1b[31m%s\x1b[0m', 'FAIL: Max retries reached. Exiting...');
        process.exit(1);
      }
      console.log(`Retrying in ${RETRY_DELAY/1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
};

// Goal Schema
const goalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  targetTime: { type: Number, required: true },
  color: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Time Entry Schema
const timeEntrySchema = new mongoose.Schema({
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal', required: true },
  date: { type: String, required: true },
  timeSpent: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Models
export const Goal = mongoose.model('Goal', goalSchema);
export const TimeEntry = mongoose.model('TimeEntry', timeEntrySchema);

// Helper functions
export const getGoalTimeSpent = async (goalId: string) => {
  const entries = await TimeEntry.find({ goalId });
  return entries.reduce((total, entry) => total + entry.timeSpent, 0);
};

export const getGoalLastUpdated = async (goalId: string) => {
  const latestEntry = await TimeEntry.findOne({ goalId })
    .sort({ createdAt: -1 })
    .select('date');
  return latestEntry ? latestEntry.date : '';
};