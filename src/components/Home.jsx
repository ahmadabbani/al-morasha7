import React from "react";
import { motion } from "framer-motion";
import "./Home.css";
import HomeBoxes from "./HomeBoxes";
import About from "./About";
import LeadersGuide from "./LeadersGuide";
import ContactUs from "./ContactUs";
import Blogs from "./Blogs";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import WeAre from "./WeAre";
import Team from "./Team";

const Home = () => {
  return (
    <div className="home-wrapper" id="home">
      {/* Hero Section */}
      <div className="home-container">
        <div className="home-overlay">
          <motion.div
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="home-content"
          >
            <h1 className="home-title">
              <span className="home-highlight">برنامج Al Mourachah </span>
              الشريك الاستراتيجي للمرشحين إلى الانتخابات النيابية 2026
            </h1>
            <p className="home-description">
              برنامج المرشح/ة يشكل المنصّة المتكاملة المصمّمة خصيصًا لدعم
              المرشحين إلى الانتخابات النيابية ٢٠٢٦ في لبنان. هدفنا ليس فقط أن
              نخوض معكم حملة انتخابية ناجحة، بل أن نبني معًا مسيرة قيادية طويلة
              الأمد تضعكم في الصفوف الأولى للعمل السياسي.
            </p>
            <Link to="/register">
              <button className="home-button">سجل/ي الآن</button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Home Sections */}
      <HomeBoxes />
      <About />
      <WeAre />
      {/*<LeadersGuide />*/}

      {/*<Blogs />*/}
      <Team />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default Home;
