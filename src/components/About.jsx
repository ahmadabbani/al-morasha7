import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

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
  const ref6 = useRef(null);
  const ref7 = useRef(null);
  const ref8 = useRef(null);
  const ref9 = useRef(null);
  const ref10 = useRef(null);
  const ref11 = useRef(null);
  const inView1 = useInView(ref1, { once: true });
  const inView2 = useInView(ref2, { once: true });
  const inView3 = useInView(ref3, { once: true });
  const inView4 = useInView(ref4, { once: true });
  const inView5 = useInView(ref5, { once: true });
  const inView6 = useInView(ref6, { once: true });
  const inView7 = useInView(ref7, { once: true });
  const inView8 = useInView(ref8, { once: true });
  const inView9 = useInView(ref9, { once: true });
  const inView10 = useInView(ref10, { once: true });
  const inView11 = useInView(ref11, { once: true });
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
        <h2 className="about-main-title">ما الذي يميّز برنامجنا ؟ </h2>

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
                استطلاعات ودراسات انتخابية دقيقة
              </h3>
              <p className="about-box-text">
                نوفّر لكم صورة واضحة عن موقعكم الحقيقي بالأرقام، اتجاهات
                الناخبين، ومناطق القوة والضعف حسب المقعد النيابي الذي تنوون
                الترشح عليه.
              </p>
              {/*<button className="read-more" onClick={() => setSelectedBox(1)}>
                المزيد <ArrowLeft className="arrow-icon" size={18} />
              </button>*/}
            </div>
          </motion.div>

          {/* Second Box */}
          <motion.div
            ref={ref2}
            initial={{ y: 100, opacity: 0 }}
            animate={inView2 ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="col-md-4"
          >
            <div className="about-box">
              <div className="about-icon-wrapper about-icon-wrapper-purple">
                <Target className="about-icon" />
              </div>
              <h3 className="about-box-title">تحليل استراتيجي</h3>
              <p className="about-box-text">
                نستفيد من نتائج 2022 لرسم خطة عمل استراتيجية تحدّد أين تركزون،
                من تستهدفون، وما هي الرسائل التي تصلح للنجاح.
              </p>
              {/* <button className="read-more" onClick={() => setSelectedBox(2)}>
                المزيد <ArrowLeft className="arrow-icon" size={18} />
              </button>*/}
            </div>
          </motion.div>

          {/* Third Box */}
          <motion.div
            ref={ref3}
            initial={{ y: 100, opacity: 0 }}
            animate={inView3 ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="col-md-4"
          >
            <div className="about-box">
              <div className="about-icon-wrapper about-icon-wrapper-green">
                <Users className="about-icon" />
              </div>
              <h3 className="about-box-title">
                تقييم ذاتي للقيادة والإدارة الذاتية
              </h3>
              <p className="about-box-text">
                إذا كنت مرشحًا أو مرشحة للانتخابات البلدية أو الاختيارية، فإن
                <span style={{ fontWeight: "700", padding: "0 4px " }}>
                  Stewart Leadership
                </span>
                العالمية توفر لكم أداة عملية وعلميّة لتطوير مهاراتكم القيادية
                والإدارية، مما يمنحكم ميزة تنافسية حقيقية. من خلال تقييم شخصي
                شامل، ستتمكنون من اكتشاف نقاط قوتكم وفرص التطوير على المستويين
                الإداري والقيادي، مما يساعدكم على الاستعداد الفعّال للحملة
                الانتخابية وإدارة الشؤون البلدية بثقة وكفاءة .
              </p>
              <button className="read-more" onClick={() => setSelectedBox(2)}>
                المزيد <ArrowLeft className="arrow-icon" size={18} />
              </button>
            </div>
          </motion.div>
          {/* 4 Box */}
          <motion.div
            ref={ref4}
            initial={{ y: 100, opacity: 0 }}
            animate={inView4 ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="col-md-4"
          >
            <div className="about-box">
              <div className="about-icon-wrapper about-icon-wrapper-green">
                <Users className="about-icon" />
              </div>
              <h3 className="about-box-title">
                تطوير القيادة السياسية والشخصية{" "}
              </h3>
              <p className="about-box-text">
                هذا الجزء يركّز على تطوير شخصيّتكم القيادية من خلال فهم منظومة{" "}
                القيم الخاصّة بكم وكيفية تطبيقها في العمل النيابي الإداري
                والسياسي .
                <span style={{ fontWeight: "700", padding: "0 4px " }}>
                  Political coaching
                </span>
                يمكنكم من تطوير استراتيجيات تواصل فعّالة، تعزيز حضوركم السياسي،
                وفهم كيفية التأثير في المجتمع{" "}
              </p>
              <button className="read-more" onClick={() => setSelectedBox(3)}>
                المزيد <ArrowLeft className="arrow-icon" size={18} />
              </button>
            </div>
          </motion.div>
          {/* 5 Box */}
          <motion.div
            ref={ref5}
            initial={{ y: 100, opacity: 0 }}
            animate={inView5 ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="col-md-4"
          >
            <div className="about-box">
              <div className="about-icon-wrapper about-icon-wrapper-green">
                <Users className="about-icon" />
              </div>
              <h3 className="about-box-title">لإعلام والصورة الانتخابية </h3>
              <p className="about-box-text">
                بناء حضور قوي عبر الإعلام التقليدي والرقمي، صياغة خطاب سياسي
                فعّال، وإدارة الحملات الإعلامية والأزمات.
              </p>
              {/* <button className="read-more" onClick={() => setSelectedBox(3)}>
                المزيد <ArrowLeft className="arrow-icon" size={18} />
              </button>*/}
            </div>
          </motion.div>
          {/* 6 Box */}
          <motion.div
            ref={ref6}
            initial={{ y: 100, opacity: 0 }}
            animate={inView6 ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="col-md-4"
          >
            <div className="about-box">
              <div className="about-icon-wrapper about-icon-wrapper-green">
                <Users className="about-icon" />
              </div>
              <h3 className="about-box-title">
                إدارة الأزمات والسمعة السياسية
              </h3>
              <p className="about-box-text">
                إدارة ومراقبة الإعلام التقليدي والرقمي 24/7, رصد الحملات
                المضادة، إعداد ردود سريعة على الإشاعات والتسريبات، وصياغة
                السرديات للحفاظ على ثقة الناخبين .
              </p>
              {/*<button className="read-more" onClick={() => setSelectedBox(3)}>
                المزيد <ArrowLeft className="arrow-icon" size={18} />
              </button>*/}
            </div>
          </motion.div>
          {/* 7 Box */}
          <motion.div
            ref={ref7}
            initial={{ y: 100, opacity: 0 }}
            animate={inView7 ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="col-md-4"
          >
            <div className="about-box">
              <div className="about-icon-wrapper about-icon-wrapper-green">
                <Users className="about-icon" />
              </div>
              <h3 className="about-box-title">تدريب الماكينات الانتخابية </h3>
              <p className="about-box-text">
                يهدف هذا التدريب إلى تنظيم وتفعيل فريق العمل الميداني بطريقة
                احترافية، من خلال وضع هيكلية واضحة لتوزيع الأدوار، إدارة
                التحالفات الانتخابية بكفاءة، وتقديم استشارات سياسية قائمة على
                تحليلات علمية وبيانات رقمية دقيقة. كما يشمل التدريب مهارات
                التنسيق الكامل ليوم الانتخابات، لضمان سلاسة العمليات وتحقيق أعلى
                مستويات الجهوزية والفعالية .
              </p>
              {/*<button className="read-more" onClick={() => setSelectedBox(3)}>
                المزيد <ArrowLeft className="arrow-icon" size={18} />
              </button>*/}
            </div>
          </motion.div>
          {/* 8 Box */}
          <motion.div
            ref={ref8}
            initial={{ y: 100, opacity: 0 }}
            animate={inView8 ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="col-md-4"
          >
            <div className="about-box">
              <div className="about-icon-wrapper about-icon-wrapper-green">
                <Users className="about-icon" />
              </div>
              <h3 className="about-box-title">التدريب الدستوري والتشريعي</h3>
              <p className="about-box-text">
                يحضّر المرشّح قبل الانتخابات لفهم صلاحيات النائب وآليات التشريع
                والرقابة ودور اللجان. وبعد الفوز، نرافقه بخطة استراتيجية داخل
                البرلمان تشمل اختيار اللجان المناسبة، بناء التحالفات، وتحضير
                خطاب أوّل متماسك، لدخول المجلس بجهوزية وثبات.
              </p>
              {/*<button className="read-more" onClick={() => setSelectedBox(3)}>
                المزيد <ArrowLeft className="arrow-icon" size={18} />
              </button>*/}
            </div>
          </motion.div>
          {/* 9 Box */}
          <motion.div
            ref={ref9}
            initial={{ y: 100, opacity: 0 }}
            animate={inView9 ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="col-md-4"
          >
            <div className="about-box">
              <div className="about-icon-wrapper about-icon-wrapper-green">
                <Users className="about-icon" />
              </div>
              <h3 className="about-box-title">ما بعد الانتخابات</h3>
              <p className="about-box-text">
                سواء بالنجاح أو بالخسارة، نرافقكم بخطة واضحة: من التحضير للعمل
                البرلماني إلى الحفاظ على الزخم للاستحقاقات المقبلة.
              </p>
              {/*<button className="read-more" onClick={() => setSelectedBox(3)}>
                المزيد <ArrowLeft className="arrow-icon" size={18} />
              </button>*/}
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
          ref={ref10}
          initial={{ y: 100, opacity: 0 }}
          animate={inView10 ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="about-additional"
        >
          <h3 className="about-additional-title"> لماذا Al Mourachah ? </h3>
          <p>
            <strong>لأننا نعرض برنامج شامل ومتكامل يجمع بين:</strong>
          </p>
          <div className="about-additional-content">
            <p>
              <Check size={20} className="check-icon" />
              الخبرة البحثية والاستراتيجية.
            </p>
            <p>
              <Check size={20} className="check-icon" />
              الحلول الميدانية والرقمية.
            </p>
            <p>
              <Check size={20} className="check-icon" />
              التدريب القيادي الشخصي.
            </p>
            <p>
              <Check size={20} className="check-icon" />
              الظهور الإعلامي واستقطاب الجمهور.
            </p>
            <p>
              <Check size={20} className="check-icon" />
              السرية والخصوصية المطلقة.
            </p>
            <p>
              نحن لا نقدّم لكم فقط فرصة للفوز بمقعد نيابي، بل نصنع معكم مشروعًا
              قياديًا حقيقيًا قادرًا على إحداث فرق في لبنان.
            </p>
          </div>
        </motion.div>

        <motion.div
          ref={ref11}
          initial={{ y: 100, opacity: 0 }}
          animate={inView11 ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="about-cta"
        >
          <h4 className="about-cta-title">
            للتواصل وحجز استشارة أولية، يرجى الاتصال بنا عبر{" "}
            <span style={{ padding: "0 6px 0 0" }}>
              <a
                href="https://wa.me/96171346435"
                aria-label="Contact us on WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                className="about-cta-link"
              >
                WhatsApp Business
              </a>
            </span>
          </h4>
          <p className="about-cta-text">
            مع Al Mourachah طموحكم السياسي يتحوّل إلى مسيرة نجاح.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
