import schedule from 'node-schedule';
import { PrismaClient } from '@prisma/client';
import { formatInTimeZone } from 'date-fns-tz';

const prisma = new PrismaClient();

const createSessions = async () => {
  const daysOfWeek = [0, 1, 2, 3, 4, 5, 6]; // Thursday: 4, Friday: 5

  for (const day of daysOfWeek) {
    const rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = day;
    rule.hour = 1;
    rule.minute = 34;

    schedule.scheduleJob(rule, async () => {
      const nextDate = new Date();

      try {
        const istTime = formatInTimeZone(
          nextDate,
          'Asia/Kolkata',
          'yyyy-MM-dd HH:mm:ssXXX'
        );
        console.log(istTime);

        await prisma.session.create({
          data: {
            time: istTime,
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
