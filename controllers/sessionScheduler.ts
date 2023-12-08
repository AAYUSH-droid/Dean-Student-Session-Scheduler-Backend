import schedule from 'node-schedule';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createSessions = async () => {
  const daysOfWeek = [1, 2, 3, 4, 5]; // Thursday: 4, Friday: 5

  for (const day of daysOfWeek) {
    const rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = day;
    rule.hour = 13;
    rule.minute = 5;

    schedule.scheduleJob(rule, async () => {
      const nextDate = new Date();

      try {
        await prisma.session.create({
          data: {
            time: nextDate.toISOString(),
          },
        });
        console.log(
          `Session created for ${schedule.RecurrenceRule.toString()}`
        );
      } catch (error) {
        console.error('Error creating session:', error);
      }
    });
  }
};

export const scheduleSessions = () => {
  createSessions();
};
