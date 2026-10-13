import mongoose from 'mongoose';
import Activity from '../models/Activity';
import Leaderboard from '../models/Leaderboard';
import Team from '../models/Team';
import User from '../models/User';
import Workout from '../models/Workout';

const connectionString =
  process.env.MONGODB_URI ?? 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase(): Promise<void> {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    const userSeeds = [
      {
        username: 'alex-runner',
        displayName: 'Alex Morgan',
        email: 'alex.morgan@example.com',
      },
      {
        username: 'jordan-cyclist',
        displayName: 'Jordan Lee',
        email: 'jordan.lee@example.com',
      },
      {
        username: 'sam-swimmer',
        displayName: 'Sam Rivera',
        email: 'sam.rivera@example.com',
      },
    ];

    const users = await Promise.all(
      userSeeds.map((user) =>
        User.findOneAndUpdate(
          { username: user.username },
          { $set: user },
          { new: true, upsert: true, runValidators: true },
        ),
      ),
    );
    const [alex, jordan, sam] = users;

    const teamSeeds = [
      { name: 'Trail Blazers', members: [alex._id, sam._id], points: 420 },
      { name: 'Cadence Crew', members: [jordan._id], points: 365 },
    ];

    await Promise.all(
      teamSeeds.map((team) =>
        Team.findOneAndUpdate(
          { name: team.name },
          { $set: team },
          { new: true, upsert: true, runValidators: true },
        ),
      ),
    );

    const activitySeeds = [
      {
        user: alex._id,
        type: 'run' as const,
        durationMinutes: 36,
        distanceKm: 6.2,
        calories: 410,
        recordedAt: new Date('2026-10-10T08:00:00.000Z'),
      },
      {
        user: jordan._id,
        type: 'cycle' as const,
        durationMinutes: 52,
        distanceKm: 22.5,
        calories: 560,
        recordedAt: new Date('2026-10-10T09:00:00.000Z'),
      },
      {
        user: sam._id,
        type: 'swim' as const,
        durationMinutes: 40,
        distanceKm: 1.8,
        calories: 390,
        recordedAt: new Date('2026-10-11T07:30:00.000Z'),
      },
      {
        user: alex._id,
        type: 'strength' as const,
        durationMinutes: 30,
        calories: 220,
        recordedAt: new Date('2026-10-12T17:00:00.000Z'),
      },
    ];

    await Promise.all(
      activitySeeds.map(({ user, type, recordedAt, ...activity }) =>
        Activity.findOneAndUpdate(
          { user, type, recordedAt },
          { $set: { user, type, recordedAt, ...activity } },
          { new: true, upsert: true, runValidators: true },
        ),
      ),
    );

    const leaderboardSeeds = [
      { user: alex._id, points: 420, rank: 1 },
      { user: jordan._id, points: 365, rank: 2 },
      { user: sam._id, points: 310, rank: 3 },
    ];

    await Promise.all(
      leaderboardSeeds.map((entry) =>
        Leaderboard.findOneAndUpdate(
          { user: entry.user },
          { $set: entry },
          { new: true, upsert: true, runValidators: true },
        ),
      ),
    );

    const workoutSeeds = [
      {
        title: 'Steady 5K Builder',
        description: 'A balanced aerobic run with a gentle progression.',
        activityType: 'run' as const,
        difficulty: 'beginner' as const,
        durationMinutes: 35,
        exercises: ['5-minute warm-up walk', '25-minute easy run', '5-minute cool-down'],
      },
      {
        title: 'Endurance Ride',
        description: 'Build cycling endurance with a consistent effort.',
        activityType: 'cycle' as const,
        difficulty: 'intermediate' as const,
        durationMinutes: 45,
        exercises: ['10-minute easy spin', '25-minute steady ride', '10-minute recovery spin'],
      },
      {
        title: 'Full-Body Strength',
        description: 'A simple strength session for balanced conditioning.',
        activityType: 'strength' as const,
        difficulty: 'beginner' as const,
        durationMinutes: 30,
        exercises: ['Bodyweight squats', 'Push-ups', 'Reverse lunges', 'Plank holds'],
      },
    ];

    await Promise.all(
      workoutSeeds.map((workout) =>
        Workout.findOneAndUpdate(
          { title: workout.title },
          { $set: workout },
          { new: true, upsert: true, runValidators: true },
        ),
      ),
    );

    console.log('Seeded users, teams, activities, leaderboard, and workouts');
  } catch (error) {
    console.error('Error seeding octofit_db:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void seedDatabase();
