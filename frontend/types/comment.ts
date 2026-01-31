export interface CommentItem {
  id: string;
  taskId: string;
  userId: string;
  commentText: string;
  createdAt: string;
}

export interface AddCommentRequest {
  taskId: string;
  userId: string;
  commentText: string;
}
