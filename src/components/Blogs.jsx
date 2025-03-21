import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Blogs.css";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_REACT_APP_API_URL}/admin/adminAction/blogs`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Failed to fetch blogs");
        setBlogs(data);
      } catch (error) {
        console.error("Fetch blogs error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleBlogClick = (id) => {
    navigate(`/blog/${id}`);
  };

  return (
    <section className="blogs-list container my-5" id="blogs">
      <h2 className="blogs-list-title">المدونات</h2>
      {loading ? (
        <div className="blogs-list-loading">جاري التحميل...</div>
      ) : (
        <div className="row">
          {blogs.length === 0 ? (
            <p className="blogs-list-empty">لا توجد مدونات بعد</p>
          ) : (
            blogs.map((blog) => (
              <div
                key={blog.id}
                className="blogs-single-card col-md-6 col-lg-4 mb-4"
              >
                <div
                  className="blogs-list-card"
                  onClick={() => handleBlogClick(blog.id)}
                >
                  <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="blogs-list-img"
                  />
                  <div className="blogs-list-content">
                    <h3 className="blogs-list-card-title">{blog.title}</h3>
                    <p className="blogs-list-card-desc">
                      {blog.description.length > 100
                        ? blog.description.substring(0, 100) + "..."
                        : blog.description}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default Blogs;
