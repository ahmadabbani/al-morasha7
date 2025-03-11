import React from "react";
import { motion } from "framer-motion";
import "./Home.css";
import HomeBoxes from "./HomeBoxes";
import About from "./About";
import ContactUs from "./ContactUs";
import Blogs from "./Blogs";
import Footer from "./Footer";
import { Link } from "react-router-dom";

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
              <span className="home-highlight">المرشح/ة</span> البرنامج الشامل
              لتحضيركم للإنتخابات البلدية والاختيارية
            </h1>
            <p className="home-description">
              هل تفكّرون في الترشّح للانتخابات البلدية والاختيارية؟
              <br />
              هل تبحثون عن برنامج شامل يزوّدكم بكل ما تحتاجونه على مستوى المعرفة
              القانونية، القيادة السياسية، التخطيط السياسي والإستراتيجي؟ <br />{" "}
              برنامج "المرشّح/ة" هو المرجع الذي يضمن لكم الجهوزية الكاملة لخوض
              الانتخابات بثقة وقوّة.
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
      <Blogs />
      <ContactUs />
      <Footer />
    </div>
  );
};

export default Home;
