import { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Target,
  Users,
  X,
} from "lucide-react";
import "./About.css";
import { Link } from "react-router-dom";

const About = () => {
  const [selectedBox, setSelectedBox] = useState(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);

  const inView1 = useInView(ref1, { once: true });
  const inView2 = useInView(ref2, { once: true });
  const inView3 = useInView(ref3, { once: true });
  const inView4 = useInView(ref4, { once: true });
  const inView5 = useInView(ref5, { once: true });
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedBox) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedBox]);

  return (
    <div className="about-wrapper" id="about">
      <div className="about-overlay"></div>

      <div className="container about-container">
        <h2 className="about-main-title">
          يتميّز هذا البرنامج بثلاثة محاور رئيسية:
        </h2>

        <div className="row about-features g-4">
          {/* First Box */}
          <motion.div
            ref={ref1}
            initial={{ y: 100, opacity: 0 }}
            animate={inView1 ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0 }}
            className="col-md-4"
          >
            <div className="about-box">
              <div className="about-icon-wrapper">
                <BookOpen className="about-icon" />
              </div>
              <h3 className="about-box-title">
                الدليل القانوني والإداري الشامل
              </h3>
              <p className="about-box-text">
                بمجرّد تسجيلكم، ستحصلون على ملف متكامل يجمع أهمّ القوانين،
                الأبحاث، والمستندات الأساسيّة التي تحتاجونها لإدارة العمل البلدي
                والإختياري بفعالية وكفاءة. لن تحتاجوا للبحث في مصادر متفرّقة،
                فكل ما تحتاجونه سيكون بين يديكم في دليل واحد.
              </p>
              <button className="read-more" onClick={() => setSelectedBox(1)}>
                اقرأ المزيد <ArrowLeft className="arrow-icon" size={18} />
              </button>
            </div>
          </motion.div>

          {/* Second Box */}
          <motion.div
            ref={ref2}
            initial={{ y: 100, opacity: 0 }}
            animate={inView2 ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="col-md-4"
          >
            <div className="about-box">
              <div className="about-icon-wrapper about-icon-wrapper-purple">
                <Target className="about-icon" />
              </div>
              <h3 className="about-box-title">تقييم ذاتي للقيادة والإدارة</h3>
              <p className="about-box-text">
                إذا كنت مرشحًا أو مرشحة للانتخابات البلدية أو الاختيارية، فإن
                <span style={{ fontWeight: "700", padding: "0 4px" }}>
                  Stewart Leadership
                </span>
                توفر لكم أداة عملية وعلميّة لتطوير مهاراتكم القيادية والإدارية،
                مما يمنحكم ميزة تنافسية حقيقية. من خلال تقييم شخصي شامل،
                ستتمكنون من اكتشاف نقاط قوتكم وفرص التطوير على المستويين الإداري
                والقيادي، مما يساعدكم على الاستعداد الفعّال للحملة الانتخابية
                وإدارة الشؤون البلدية بثقة وكفاءة.
              </p>
              <button className="read-more" onClick={() => setSelectedBox(2)}>
                اقرأ المزيد <ArrowLeft className="arrow-icon" size={18} />
              </button>
            </div>
          </motion.div>

          {/* Third Box */}
          <motion.div
            ref={ref3}
            initial={{ y: 100, opacity: 0 }}
            animate={inView3 ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="col-md-4"
          >
            <div className="about-box">
              <div className="about-icon-wrapper about-icon-wrapper-green">
                <Users className="about-icon" />
              </div>
              <h3 className="about-box-title">
                تطوير القيادة السياسية والشخصية
              </h3>
              <p className="about-box-text">
                هذا الجزء يركّز على تطوير شخصيّتكم القيادية من خلال فهم منظومة
                القيم الخاصّة بكم وكيفية تطبيقها في العمل الإداري والسياسي.
                <br />
                <span style={{ fontWeight: "700", padding: "0 4px " }}>
                  Political coaching
                </span>
                يمكنكم من تطوير استراتيجيات تواصل فعّالة، تعزيز حضوركم السياسي،
                وفهم كيفية التأثير في مجتمعكم المحلّي.
              </p>
              <button className="read-more" onClick={() => setSelectedBox(3)}>
                اقرأ المزيد <ArrowLeft className="arrow-icon" size={18} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Modal */}
        {selectedBox && (
          <div className="about-modal-overlay">
            <div className="about-modal">
              <button
                className="about-modal-close"
                onClick={() => setSelectedBox(null)}
              >
                <X />
              </button>
              {selectedBox === 1 && (
                <div>
                  <p className="about-modal-text">
                    هذا الدليل هو مساعدكم الأساسي في مسيرتكم قبل وبعد
                    الإنتخابات، تحصلون على نسخة منه بمجرد إنضمامكم لهذا
                    البرنامج.
                  </p>
                  <Link to="/register" className="about-modal-register">
                    سجل/ي الآن
                  </Link>
                  <img
                    src="/images/cover-book.png"
                    alt="Guide"
                    className="about-modal-image"
                  />
                </div>
              )}
              {selectedBox === 2 && (
                <div>
                  <p className="about-modal-text">
                    شركة <span>Stewart Leadership </span> العالمية متخصصة في
                    تطوير القادة، بناء فرق العمل، وتعزيز أداء المؤسسات من خلال
                    مجموعة شاملة من الخدمات الاستشارية، بما في ذلك التدريب على
                    القيادة الشخصية، تطوير فرق العمل، إدارة النزاعات، والتخطيط
                    الاستراتيجي، بهدف تحويل التحديات إلى فرص للنمو والنجاح.
                  </p>
                  <p className="about-modal-text">
                    <a
                      href="https://stewartleadership.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="about-modal-link"
                    >
                      للمزيد يمكنكم زيارة <span>الموقع الإلكتروني</span> الخاص
                      بهم
                    </a>
                  </p>
                  <img
                    src="/images/Stewart-Leadership_logo.svg"
                    alt="Stewart Leadership Logo"
                    className="about-modal-logo"
                  />
                </div>
              )}
              {selectedBox === 3 && (
                <div>
                  <p className="about-modal-text">
                    برنامج القيادة السياسية{" "}
                    <span>Political leadership coaching </span>
                    برنامج القيادة السياسية، هو البرنامج الأول الفريد من نوعه في
                    في لبنان و الشرق الأوسط وشمال أفريقيا، يزود كل فرد سعى
                    للتألق في العمل السياسي والشأن العام بالخلفيات والادوات
                    اللازمة للنجاح.
                  </p>
                  <img
                    src="/images/political-leadership.JPG"
                    alt="Political Leadership"
                    className="about-modal-image"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        <motion.div
          ref={ref4}
          initial={{ y: 100, opacity: 0 }}
          animate={inView4 ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="about-additional"
        >
          <h3 className="about-additional-title">
            بالإضافة إلى ذلك، سيتناول البرنامج مواضيع عملية هامّة مثل:
          </h3>
          <div className="about-additional-content">
            <p>
              <Check size={20} className="check-icon" />
              كيف تستعدّ/ين شخصيًا لخوض الانتخابات وبناء فريق عمل فعّال؟
            </p>
            <p>
              <Check size={20} className="check-icon" />
              كيفية بناء رسالتكم السياسية بوضوح وقوّة .
            </p>
            <p>
              <Check size={20} className="check-icon" />
              فهم تحدّيات الأجيال المختلفة وكيفية استمالتها.
            </p>
            <p>
              <Check size={20} className="check-icon" />
              تطوير استراتيجيات فعّالة للحملات الانتخابية وتوزيع مهام الماكينات
              الانتخابية.
            </p>
            <p>
              والمزيد من المواضيع الأساسية التي تسهّل لكم فهم الصورة العامة لخوض
              هذا الاستحقاق بنجاح!
            </p>
          </div>
        </motion.div>

        <motion.div
          ref={ref5}
          initial={{ y: 100, opacity: 0 }}
          animate={inView5 ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="about-cta"
        >
          <h4 className="about-cta-title">
            المرشح/ة " دليلكم الكامل والشامل لتكونوا جاهزين لخوض الانتخابات بثقة
            ومعرفة متكاملة.
          </h4>
          <p className="about-cta-text">
            لا تضيّعوا الوقت،
            <span style={{ padding: "0 6px 0 0" }}>
              <Link to="/register" className="about-cta-link">
                سجّل/ي الآن!
              </Link>
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
