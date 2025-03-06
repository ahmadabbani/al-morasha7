import React from "react";
import { motion } from "framer-motion";
import "./Home.css";
import HomeBoxes from "./HomeBoxes";
import About from "./About";
import ContactUs from "./ContactUs";
import Blogs from "./Blogs";
import Footer from "./Footer";

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
              هل تبحثون عن برنامج شامل يزوّدكم بكل ما تحتاجه على مستوى المعرفة
              القانونية، القيادة السياسية، والتخطيط السياسي؟ <br /> برنامج
              "المرشّح" هو المرجع الذي يضمن لكم الجهوزية الكاملة لخوض الانتخابات
              بثقة وقوّة.
            </p>
            <button className="home-button">سجل الآن</button>
          </motion.div>
        </div>
      </div>

      {/* Boxes Section */}
      <HomeBoxes />
      <About />
      {/*<Blogs /> */}
      <ContactUs />
      <Footer />
    </div>
  );
};

export default Home;
