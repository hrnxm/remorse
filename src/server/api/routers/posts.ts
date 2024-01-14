import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import isMorseCode from "~/utils/isMorseCode";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany({
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  }),
  create: protectedProcedure
    .input(
      z.object({
        content: z
          .string()
          .min(1, "Post is empty!")
          .max(750, "Character limit is 750!")
          .refine(isMorseCode, { message: "Post must be in Morse code!" }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return ctx.db.post.create({
        data: {
          userId,
          content: input.content,
        },
      });
    }),
});
