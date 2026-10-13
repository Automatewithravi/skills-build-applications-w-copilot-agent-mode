import mongoose from 'mongoose';
import Activity, { Activity as ActivityRecord } from '../models/Activity';
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
    const knownUsers = await User.find({
      username: { $in: userSeeds.map(({ username }) => username) },
    });
    const knownUsernames = new Set(knownUsers.map(({ username }) => username));
    const newUsers = await User.insertMany(
      userSeeds.filter(({ username }) => !knownUsernames.has(username)),
    );
    const usersByUsername = new Map(
      [...knownUsers, ...newUsers].map((user) => [user.username, user]),
    );
    const getUser = (username: string) => {
      const user = usersByUsername.get(username);
      if (!user) {
        throw new Error(`Seed user ${username} was not found after insertion`);
      }
      return user;
    };
    const alex = getUser('alex-runner');
    const jordan = getUser('jordan-cyclist');
    const sam = getUser('sam-swimmer');

    const teamSeeds = [
      { name: 'Trail Blazers', members: [alex._id, sam._id], points: 420 },
      { name: 'Cadence Crew', members: [jordan._id], points: 365 },
    ];
    const existingTeams = await Team.find({
      name: { $in: teamSeeds.map(({ name }) => name) },
    }).select('name');
    const existingTeamNames = new Set(existingTeams.map(({ name }) => name));
    await Team.insertMany(
      teamSeeds.filter(({ name }) => !existingTeamNames.has(name)),
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
    const existingActivities = await Activity.find({
      user: { $in: activitySeeds.map(({ user }) => user) },
      type: { $in: activitySeeds.map(({ type }) => type) },
      recordedAt: { $in: activitySeeds.map(({ recordedAt }) => recordedAt) },
    }).select('user type recordedAt');
    const activityKey = (activity: {
      user: (typeof alex)['_id'];
      type: ActivityRecord['type'];
      recordedAt: Date;
    }) => `${activity.user}:${activity.type}:${activity.recordedAt.toISOString()}`;
    const existingActivityKeys = new Set(
      existingActivities.map(activityKey),
    );
    await Activity.insertMany(
      activitySeeds.filter(
        (activity) => !existingActivityKeys.has(activityKey(activity)),
      ),
    );

    const leaderboardSeeds = [
      { user: alex._id, points: 420, rank: 1 },
      { user: jordan._id, points: 365, rank: 2 },
      { user: sam._id, points: 310, rank: 3 },
    ];
    const existingLeaderboardEntries = await Leaderboard.find({
      user: { $in: leaderboardSeeds.map(({ user }) => user) },
    }).select('user');
    const rankedUserIds = new Set(
      existingLeaderboardEntries.map(({ user }) => user.toString()),
    );
    await Leaderboard.insertMany(
      leaderboardSeeds.filter(({ user }) => !rankedUserIds.has(user.toString())),
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
    const existingWorkouts = await Workout.find({
      title: { $in: workoutSeeds.map(({ title }) => title) },
    }).select('title');
    const existingWorkoutTitles = new Set(
      existingWorkouts.map(({ title }) => title),
    );
    await Workout.insertMany(
      workoutSeeds.filter(({ title }) => !existingWorkoutTitles.has(title)),
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
