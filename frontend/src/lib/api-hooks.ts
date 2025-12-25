import {
  Comment,
  PaginatedResponse,
  Post,
  SuccessResponse,
} from "@/shared/types";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { upvoteComment, upvotePost } from "./api";
import { current, produce } from "immer";
import { toast } from "sonner";

const updatePostUpvote = (draft: Post) => {
  draft.points += draft.isUpvoted ? -1 : +1;
  draft.isUpvoted = !draft.isUpvoted;
};

export const useUpvotePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upvotePost,
    onMutate: async (variable) => {
      let prevData;

      await queryClient.cancelQueries({ queryKey: ["posts"] });
      await queryClient.cancelQueries({ queryKey: ["post", Number(variable)] });

      queryClient.setQueryData<SuccessResponse<Post>>(
        ["post", Number(variable)],
        produce((draft) => {
          if (!draft) {
            return undefined;
          }
          updatePostUpvote(draft.data);
        })
      );

      queryClient.setQueriesData<InfiniteData<PaginatedResponse<Post[]>>>(
        {
          queryKey: ["posts"],
        },
        produce((oldData) => {
          prevData = current(oldData);
          if (!oldData) {
            return undefined;
          }
          oldData.pages.forEach((page) => {
            page.data.forEach((post) => {
              if (post.id.toString() === variable) {
                updatePostUpvote(post);
              }
            });
          });
        })
      );

      return { prevData };
    },
    onSuccess: (upvoteData, variable) => {
      queryClient.setQueryData<SuccessResponse<Post>>(
        ["post", Number(variable)],
        produce((draft) => {
          if (!draft) {
            return undefined;
          }
          draft.data.points = upvoteData.data.count;
          draft.data.isUpvoted = upvoteData.data.isUpvoted;
        })
      );

      queryClient.setQueriesData<InfiniteData<PaginatedResponse<Post[]>>>(
        { queryKey: ["posts"] },
        produce((oldData) => {
          if (!oldData) {
            return undefined;
          }
          oldData.pages.forEach((page) =>
            page.data.forEach((post) => {
              if (post.id.toString() === variable) {
                post.points = upvoteData.data.count;
                post.isUpvoted = upvoteData.data.isUpvoted;
              }
            })
          );
        })
      );

      queryClient.invalidateQueries({
        queryKey: ["posts"],
        type: "inactive",
        refetchType: "none",
      });
    },
    onError: (err, variable, context) => {
      console.error(err);
      queryClient.invalidateQueries({ queryKey: ["post", Number(variable)] });
      toast.error("Failed to upvote post");
      if (context?.prevData) {
        queryClient.setQueriesData(
          { queryKey: ["posts"], type: "active" },
          context.prevData
        );
        queryClient.invalidateQueries({
          queryKey: ["posts"],
        });
      }
    },
  });
};

export const useUpvoteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      id: string;
      postId: number | null;
      parentCommentId: number | null;
    }) => upvoteComment(data.id),

    onMutate: async ({ id }) => {
      // 1. Cancel all related comment queries to prevent overwrites
      await queryClient.cancelQueries({
        predicate: (q) => q.queryKey[0] === "comments",
      });

      // 2. Snapshot the current state of ALL comment queries
      const prevQueries = queryClient.getQueriesData({
        predicate: (q) => q.queryKey[0] === "comments",
      });

      // 3. Optimistically update all matching caches
      queryClient.setQueriesData<InfiniteData<PaginatedResponse<Comment[]>>>(
        { predicate: (q) => q.queryKey[0] === "comments" },
        produce((oldData) => {
          if (!oldData) return;

          oldData.pages.forEach((page) =>
            page.data.forEach((comment) => {
              if (comment.id.toString() === id) {
                const isUpvoted = comment.commentUpvotes.length > 0;
                comment.points += isUpvoted ? -1 : 1;
                comment.commentUpvotes = isUpvoted ? [] : [{ userId: "me" }];
              }
            })
          );
        })
      );

      return { prevQueries };
    },

    onSuccess: (data, { id }) => {
      queryClient.setQueriesData<InfiniteData<PaginatedResponse<Comment[]>>>(
        { predicate: (q) => q.queryKey[0] === "comments" },
        produce((oldData) => {
          if (!oldData) return;
          oldData.pages.forEach((page) =>
            page.data.forEach((comment) => {
              if (comment.id.toString() === id) {
                comment.points = data.data.count;
                comment.commentUpvotes = data.data.isUpvoted
                  ? [{ userId: "me" }]
                  : [];
              }
            })
          );
        })
      );
    },

    onError: (_err, _vars, context) => {
      toast.error("Failed to upvote comment");

      // 4. Rollback each query specifically to its previous state
      if (context?.prevQueries) {
        context.prevQueries.forEach(([queryKey, oldData]) => {
          queryClient.setQueryData(queryKey, oldData);
        });
      }
    },
  });
};
