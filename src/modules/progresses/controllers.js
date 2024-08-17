
import { getDailyProgress, getWeeklyProgress } from '../../models/Progress.js';

const getProgress = async (req, res) => {
  try {
    const userId = req.user.id;
    const dailyProgress = await getDailyProgress(userId);
    const weeklyProgress = await getWeeklyProgress(userId);

    res.json({ daily: dailyProgress, weekly: weeklyProgress });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Error fetching progress', error: error.message });
  }
};

export { getProgress };