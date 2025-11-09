import React from "react";
import PostCard from "./PostCard.jsx";

export default function PostList({
  posts,
  loading,
  activeTab,
  currentUser,
  commentText,
  showComments,
  onLike,
  onComment,
  onCommentTextChange,
  onToggleComments,
  onPostClick,
  isUserLikedPost,
  isMyPost,
}) {
  if (loading && posts.length === 0) {
    return <p className="loading-text">Loading posts...</p>;
  }

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <p>
          {activeTab === "all"
            ? "No posts yet. Be the first to post!"
            : "You haven't posted anything yet. Create your first post!"}
        </p>
      </div>
    );
  }

  return (
    <div className="posts-container">
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          currentUser={currentUser}
          commentText={commentText}
          showComments={showComments}
          onLike={onLike}
          onComment={onComment}
          onCommentTextChange={onCommentTextChange}
          onToggleComments={onToggleComments}
          onPostClick={onPostClick}
          isUserLikedPost={isUserLikedPost}
          isMyPost={isMyPost}
        />
      ))}
    </div>
  );
}