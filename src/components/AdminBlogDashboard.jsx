import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";

import "./BlogsAdmin.css";

const AdminBlogDashboard = () => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageDrop = (acceptedFiles) => {
    setImage(acceptedFiles[0]); // Single file upload
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleImageDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif"] }, // Cloudinary supports these
    multiple: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please upload an image for the blog");
      return;
    }

    setLoading(true);
    const blogData = new FormData();
    blogData.append("title", formData.title);
    blogData.append("description", formData.description);
    blogData.append("image", image);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_API_URL
        }/admin/adminAction/createBlog`,
        {
          method: "POST",
          body: blogData, // FormData handles multipart/form-data automatically
        }
      );

      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error || "An error occurred while creating the blog"
        );

      toast.success("The blog was created successfully");
      setFormData({ title: "", description: "" });
      setImage(null);
    } catch (error) {
      toast.error(error.message || "An error occurred while creating the blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="blogs-admin container my-5">
      <h2 className="blogs-admin-title">Create a new blog</h2>
      <form onSubmit={handleSubmit} className="blogs-admin-form">
        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="blogs-admin-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Blog title"
            className="blogs-admin-input"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="blogs-admin-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Blog description..."
            className="blogs-admin-textarea"
            rows="5"
            required
          />
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="blogs-admin-label">Blog Image</label>
          <div className="blogs-admin-dropzone">
            {image ? (
              <div className="blogs-admin-preview">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="blogs-admin-preview-img"
                />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="blogs-admin-remove-btn"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div {...getRootProps()} className="blogs-admin-upload-area">
                <input {...getInputProps()} />
                <Upload size={24} className="blogs-admin-upload-icon" />
                <p>Drag the image here or click to upload</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="blogs-admin-submit-btn"
          disabled={loading}
        >
          {loading ? (
            <span className="blogs-admin-spinner" />
          ) : (
            <>
              <Plus size={20} />
              Create Blog
            </>
          )}
        </button>
      </form>
    </section>
  );
};

export default AdminBlogDashboard;
