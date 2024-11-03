import dayjs from 'dayjs';
import { z } from 'zod';

import { createTRPCRouter, protectedProcedure } from '@/server/config/trpc';

export const dashboardRouter = createTRPCRouter({
  getCpuUsage: protectedProcedure()
    .meta({
      openapi: {
        method: 'GET',
        path: '/dashboard/cpu-usage',
        protect: true,
        tags: ['dashboard'],
      },
    })
    .input(z.object({}))
    .output(
      z.array(
        z.object({
          time: z.string(),
          core_1: z.number(),
          core_2: z.number(),
          core_3: z.number(),
          core_4: z.number(),
          core_5: z.number(),
          core_6: z.number(),
          total_usage: z.number(),
        })
      )
    )
    .query(async ({ ctx }) => {
      ctx.logger.info('Getting CPU usage');
      return [
        {
          time: dayjs().format('HH:mm:ss'),
          core_1: 0,
          core_2: 0,
          core_3: 0,
          core_4: 0,
          core_5: 0,
          core_6: 0,
          total_usage: 0,
        },
      ];
    }),
});
