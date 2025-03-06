import React, { useRef } from "react";
import { Target, Users, FileCheck, Award, User, BookOpen } from "lucide-react";
import "./HomeBoxes.css";
import { motion, useInView } from "framer-motion";

const HomeBoxes = () => {
  // Component for each animated box
  const HomeBoxItem = ({ box, index }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true }); // Animate only once when in view

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0 }} // Start with 0 opacity
        animate={inView ? { opacity: 1 } : { opacity: 0 }} // Fade in when in view
        transition={{ duration: 0.8, delay: index * 0.4 }} // 0.8s duration, staggered delay
        className="home-box-item"
      >
        <div className="home-box-icon">
          {React.cloneElement(box.icon, { color: "#0b8d46" })}
        </div>
        <h3 className="home-box-title">{box.title}</h3>
        <p className="home-box-description">{box.description}</p>
      </motion.div>
    );
  };
  const boxesData = [
    {
      icon: <Target size={45} />,
      title: "تحديد الهدف",
      description:
        "نقدم لكم الوسائل المناسبة لتحديد أهدافكم السياسية ووضع خطة لحملتكم الانتخابية بدقة.",
    },
    {
      icon: <Users size={45} />,
      title: "بناء الفريق",
      description:
        "نقدم لكم كل الوسائل التي تحتاجونها لبناء وقيادة فريق يساندكم في حملتكم الإنتخابية.",
    },
    {
      icon: <FileCheck size={45} />,
      title: "تطوير المهارات",
      description:
        "نقدم لكم برنامج تطوير مهارات ذاتية وقيادية وسياسية تناسب عملكم وطموحكم السياسي.",
    },
    {
      icon: <Award size={45} />,
      title: "النجاح السياسي",
      description:
        "نقدم لكم طريق النجاح في عملكم السياسي ضمن مسار واضح المعالم والخطوات.",
    },
  ];

  return (
    <div className="home-box-container">
      <div className="home-box-wrapper">
        {boxesData.map((box, index) => (
          <HomeBoxItem key={index} box={box} index={index} />
        ))}
      </div>
    </div>
  );
};

export default HomeBoxes;
