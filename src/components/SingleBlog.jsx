import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, ArrowLeft } from "lucide-react"; // Icons for time and back navigation
import "./SingleBlog.css";
import Footer from "./Footer";
const SingleBlog = () => {
  const { id } = useParams(); // Get blog ID from URL params
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const fetchSingleBlog = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_REACT_APP_API_URL
          }/admin/adminAction/singleBlog?id=${id}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch blog");
        setBlog(data);
      } catch (error) {
        console.error("Fetch single blog error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSingleBlog();
  }, [id]);

  if (loading) {
    return <div className="single-blog-loading">Loading...</div>;
  }

  if (!blog) {
    return <div className="single-blog-error">Blog not found</div>;
  }

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;

    // Handle shortened links (youtu.be)
    if (url.includes("youtu.be")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Handle standard links (youtube.com/watch?v=)
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Log an error for invalid URLs and return null
    console.error("Invalid YouTube URL:", url);
    return null;
  };

  // Convert YouTube link to embeddable format
  const youtubeEmbedUrl = getYoutubeEmbedUrl(blog.link);

  return (
    <>
      <div className="single-blog-container">
        <button className="single-blog-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={25} />
        </button>
        <h1 className="single-blog-title">{blog.title}</h1>
        <div className="single-blog-meta">
          <Clock size={18} />
          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
        </div>
        {youtubeEmbedUrl && (
          <div className="single-blog-video">
            <iframe
              src={youtubeEmbedUrl}
              title={blog.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        <p className="single-blog-description">{blog.description}</p>
      </div>
      <div style={{ direction: "rtl" }}>
        {" "}
        <Footer />
      </div>
    </>
  );
};

export default SingleBlog;
