
import { X, Heart, MessageCircle, Send } from "lucide-react";

export default function PostModal({
  post,
  currentUser,
  commentText,
  showComments,
  onClose,
  onLike,
  onComment,
  onCommentTextChange,
  onToggleComments,
  isUserLikedPost,
  isMyPost,
}) {
  const handleCommentSubmit = () => {
    onComment(post._id);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="modal-close">
          <X size={24} />
        </button>

        <div className={isMyPost(post) ? "post-modal my-post" : "post-modal"}>
          {isMyPost(post) && <div className="my-post-badge">Your Post</div>}

          <div className="post-header">
            <div className={isMyPost(post) ? "avatar my-avatar" : "avatar"}>
              {post.username?.[0]?.toUpperCase() || "?"}
            </div>
            <div className="post-user-info">
              <strong className="post-username">
                @{post.username}
                {isMyPost(post) && <span className="you-badge"> (You)</span>}
              </strong>
              <small className="post-date">
                {new Date(post.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            </div>
          </div>

          {post.text && <p className="post-text">{post.text}</p>}

          {post.image && (
            <img
              src={post.image}
              alt="post"
              className="post-image-modal"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          )}

          <div className="post-actions">
            <button
              onClick={() => onLike(post._id)}
              className={isUserLikedPost(post) ? "btn-action liked" : "btn-action"}
            >
              <Heart
                size={18}
                fill={isUserLikedPost(post) ? "#e74c3c" : "none"}
              />
              <span>{post.likes?.length || 0}</span>
            </button>
            <button
              onClick={() =>
                onToggleComments({
                  ...showComments,
                  [post._id]: !showComments[post._id],
                })
              }
              className="btn-action"
            >
              <MessageCircle size={18} />
              <span>{post.comments?.length || 0}</span>
            </button>
          </div>

          <div className="comments-section modal-comments">
            <div className="comments-list">
              {post.comments?.map((c, i) => (
                <div key={i} className="comment">
                  <strong className="comment-username">
                    @{c.username}
                    {c.userId === currentUser._id && (
                      <span className="comment-you"> (You)</span>
                    )}
                  </strong>
                  <p className="comment-text">{c.text}</p>
                  <small className="comment-date">
                    {new Date(c.commentedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </small>
                </div>
              ))}
            </div>
            <div className="comment-box">
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText[post._id] || ""}
                onChange={(e) =>
                  onCommentTextChange({
                    ...commentText,
                    [post._id]: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleCommentSubmit();
                  }
                }}
                className="comment-input"
              />
              <button
                onClick={handleCommentSubmit}
                className="btn-send-comment"
                disabled={!commentText[post._id]?.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}