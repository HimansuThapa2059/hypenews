import {
  createPost,
  getPaginatedPosts,
  upvotePosts,
  createComment,
} from "@/controllers";
import { requireAuth } from "@/middlewares/requireAuth";
import {
  createCommentSchema,
  createPostSchema,
  paginationSchema,
} from "@/shared/types";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import z from "zod";

const postRouter = new Hono();

postRouter
  .post("/", requireAuth, zValidator("form", createPostSchema), createPost)
  .get("/", zValidator("query", paginationSchema), getPaginatedPosts)
  .post(
    "/:postId/upvote",
    requireAuth,
    zValidator("param", z.object({ postId: z.coerce.number() })),
    upvotePosts
  )
  .post(
    "/:postId/comment",
    zValidator(
      "param",
      z.object({
        postId: z.coerce.number(),
      })
    ),
    zValidator("form", createCommentSchema),
    createComment
  );

export default postRouter;
