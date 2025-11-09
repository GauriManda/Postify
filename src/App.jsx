import React, { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import AuthPage from "./components/AuthPage.jsx";
import CreatePost from "./components/CreatePost.jsx";
import PostList from "./components/PostList.jsx";
import PostModal from "./components/PostModal.jsx";
import "./App.css";

const API_URL = "http://localhost:3000/api";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setCurrentUser(JSON.parse(user));
      fetchPosts();
    }
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/posts`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setCurrentUser(user);
    fetchPosts();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setCurrentUser(null);
    setPosts([]);
    setShowCreatePost(false);
    setActiveTab("all");
  };

  const handleCreatePost = async (postData) => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...postData,
          userId: currentUser._id,
          username: currentUser.username,
        }),
      });

      if (res.ok) {
        setShowCreatePost(false);
        fetchPosts();
        return true;
      } else {
        const data = await res.json();
        alert(data.message || "Failed to create post");
        return false;
      }
    } catch (err) {
      alert("Error creating post: " + err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser._id,
          username: currentUser.username,
        }),
      });

      if (res.ok) {
        fetchPosts();
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleComment = async (postId) => {
    const text = commentText[postId];
    if (!text?.trim()) return;

    try {
      const res = await fetch(`${API_URL}/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser._id,
          username: currentUser.username,
          text: text.trim(),
        }),
      });

      if (res.ok) {
        setCommentText({ ...commentText, [postId]: "" });
        fetchPosts();
      }
    } catch (err) {
      console.error("Error commenting:", err);
    }
  };

  const openPostModal = (post) => {
    setSelectedPost(post);
    document.body.style.overflow = "hidden";
  };

  const closePostModal = () => {
    setSelectedPost(null);
    document.body.style.overflow = "auto";
  };

  const isUserLikedPost = (post) => {
    return post.likes?.some((like) => like.userId === currentUser._id);
  };

  const isMyPost = (post) => {
    return post.userId === currentUser._id;
  };

  const filteredPosts =
    activeTab === "all"
      ? posts
      : posts.filter((post) => post.userId === currentUser._id);

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} apiUrl={API_URL} />;
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="header-title">Postify</h1>
        <div className="header-right">
          <span className="username">@{currentUser.username}</span>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="main">
        <button
          onClick={() => setShowCreatePost(!showCreatePost)}
          className="btn-new-post"
        >
          {showCreatePost ? "✕ Cancel" : "+ New Post"}
        </button>

        {showCreatePost && (
          <CreatePost
            onSubmit={handleCreatePost}
            loading={loading}
          />
        )}

        <div className="feed-tabs">
          <button
            onClick={() => setActiveTab("all")}
            className={activeTab === "all" ? "feed-tab active" : "feed-tab"}
          >
            All Posts
            <span className="tab-badge">{posts.length}</span>
          </button>
          <button
            onClick={() => setActiveTab("my")}
            className={activeTab === "my" ? "feed-tab active" : "feed-tab"}
          >
            My Posts
            <span className="tab-badge">
              {posts.filter((p) => p.userId === currentUser._id).length}
            </span>
          </button>
        </div>

        <PostList
          posts={filteredPosts}
          loading={loading}
          activeTab={activeTab}
          currentUser={currentUser}
          commentText={commentText}
          showComments={showComments}
          onLike={handleLike}
          onComment={handleComment}
          onCommentTextChange={setCommentText}
          onToggleComments={setShowComments}
          onPostClick={openPostModal}
          isUserLikedPost={isUserLikedPost}
          isMyPost={isMyPost}
        />

        {selectedPost && (
          <PostModal
            post={selectedPost}
            currentUser={currentUser}
            commentText={commentText}
            showComments={showComments}
            onClose={closePostModal}
            onLike={handleLike}
            onComment={handleComment}
            onCommentTextChange={setCommentText}
            onToggleComments={setShowComments}
            isUserLikedPost={isUserLikedPost}
            isMyPost={isMyPost}
          />
        )}
      </main>
    </div>
  );
}