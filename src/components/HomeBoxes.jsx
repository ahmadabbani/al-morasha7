import React from "react";
import { Target, Users, FileCheck, Award, User, BookOpen } from "lucide-react";
import "./HomeBoxes.css";

const HomeBoxes = () => {
  const boxesData = [
    {
      icon: <Target size={45} />,
      title: "حدد هدفك",
      description:
        "نقدم لك دليل يحدد أهدافك السياسية ويعطيك خطة حملتك الانتخابية بدقة.",
    },
    {
      icon: <Users size={45} />,
      title: "بناء فريقك",
      description:
        "لدينا دليل يساعدك في تشكيل فريق عمل متكامل وفعال لإدارة حملتك الانتخابية.",
    },
    {
      icon: <FileCheck size={45} />,
      title: "إجراءات الترشح",
      description:
        "دليلنا يوجهك خلال جميع المتطلبات القانونية والإجراءات الرسمية للترشح.",
    },
    {
      icon: <Award size={45} />,
      title: "النجاح السياسي",
      description:
        "نقدم لك دليل شامل يحتوي على الأدوات والمعرفة اللازمة لتحقيق أهدافك السياسية.",
    },
  ];

  //alternatives:
  const otherData = [
    {
      icon: <Target size={45} />,
      title: "حدد هدفك",
      description:
        "نقدم لك دليل يحدد أهدافك السياسية ويعطيك خطة حملتك الانتخابية بدقة.",
    },
    {
      icon: <Users size={45} />,
      title: "بناء فريقك",
      description:
        "لدينا دليل يساعدك في تشكيل فريق عمل متكامل وفعال لإدارة حملتك الانتخابية.",
    },
    {
      icon: <FileCheck size={45} />,
      title: "إجراءات الترشح",
      description:
        "دليلنا يوجهك خلال جميع المتطلبات القانونية والإجراءات الرسمية للترشح.",
    },
    {
      icon: <Award size={45} />,
      title: "النجاح السياسي",
      description:
        "نقدم لك دليل شامل يحتوي على الأدوات والمعرفة اللازمة لتحقيق أهدافك السياسية.",
    },
  ];

  return (
    <div className="home-box-container">
      <div className="home-box-wrapper">
        {boxesData.map((box, index) => (
          <div key={index} className="home-box-item">
            <div className="home-box-icon">
              {React.cloneElement(box.icon, { color: "#0b8d46" })}
            </div>
            <h3 className="home-box-title">{box.title}</h3>
            <p className="home-box-description">{box.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeBoxes;
