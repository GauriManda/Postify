import React, { useState } from "react";
import { ImagePlus, X } from "lucide-react";

export default function CreatePost({ onSubmit, loading }) {
  const [postForm, setPostForm] = useState({ text: "", image: "" });
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setPostForm({ ...postForm, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setPostForm({ ...postForm, image: "" });
  };

  const handleSubmit = async () => {
    if (!postForm.text && !postForm.image) {
      alert("Please add text or an image");
      return;
    }

    const success = await onSubmit(postForm);
    if (success) {
      setPostForm({ text: "", image: "" });
      setImagePreview(null);
    }
  };

  return (
    <div className="create-post">
      <h3 className="create-post-title">Create Post</h3>

      <textarea
        placeholder="What's on your mind?"
        value={postForm.text}
        onChange={(e) => setPostForm({ ...postForm, text: e.target.value })}
        className="textarea"
        rows={4}
      />

      {imagePreview && (
        <div className="image-preview-container">
          <img src={imagePreview} alt="Preview" className="image-preview" />
          <button
            onClick={handleRemoveImage}
            className="btn-remove-image"
            title="Remove image"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="create-post-actions">
        <label className="btn-image-upload">
          <ImagePlus size={20} />
          <span>Add Photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="file-input"
          />
        </label>

        <button
          onClick={handleSubmit}
          className={loading ? "btn-post disabled" : "btn-post"}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}