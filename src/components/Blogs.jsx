import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
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

  const sliderSettings = {
    dots: true,
    dotsClass: "slick-dots custom-dots",
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    rtl: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="blogs-list container my-5" id="blogs">
      <h2 className="blogs-list-title">المدونات</h2>
      {loading ? (
        <div className="blogs-list-loading">جاري التحميل...</div>
      ) : (
        <div className="blogs-slider-container">
          {blogs.length === 0 ? (
            <p className="blogs-list-empty">لا توجد مدونات بعد</p>
          ) : (
            <Slider {...sliderSettings}>
              {blogs.map((blog) => (
                <div key={blog.id} className="blogs-slide-item">
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
              ))}
            </Slider>
          )}
        </div>
      )}
    </section>
  );
};

export default Blogs;
