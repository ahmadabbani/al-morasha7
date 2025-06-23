import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { FileText, X } from "lucide-react";
import "./LeadersGuide.css";

const highlightEnglish = (text) => {
  // Replace English words with span for coloring and bold
  return text.replace(
    /([A-Za-z0-9!.,'\-]+)/g,
    '<span class="leaders-guide-english">$1</span>'
  );
};

const modalContent = {
  title: 'برنامج "قادة في البلديات"',
  description:
    '"قادة في البلديات" هو برنامج تدريبي مخصص لرؤساء وأعضاء المجالس البلدية، يشكّل النسخة المطوّرة من برنامج "المرشّح/ة" الذي حقق نجاحًا كبيرًا بانتخاب أكثر من 95٪ من المشاركين فيه كرؤساء بلديات وأعضاء مجالس ومخاتير.',
  goals: [
    "تعزيز مهارات القيادة في البلديات من خلال أدوات التقييم الذاتي والتدريب.",
    "التمكين القانوني والإداري عبر التدريب على قانون البلديات، قانون الشراء العام والمحاسبة العمومية.",
    "بناء قدرات التواصل.",
    "معرفة كيفية التشبيك مع مبادرات التنمية وتعزيز حضور المجالس البلدية في المجتمع المحلي.",
  ],
  content: [
    "تقييم ذاتي شخصي بالشراكة مع LEAD NOW! Self-Assessment from Stewart Leadership العالمية في الولايات المتحدة الأميركية.",
    "دليل قانوني يجمع ويفسّر قانون البلديات، قانون الشراء العام، سلطات الرقابة عالبلديات، قانون المحاسبة العمومية وغيرها.",
    "ورش تدريب على سير العمل الإداري داخل البلدية والحوكمة المحلية",
    "جلسات تدريب تفاعلية حول الشفافية، اتخاذ القرارات، العمل الجماعي، القيم في الشأن العام وغيرها",
    "تدريبات قانونية وتنظيمية متخصصة حول القيادة وفن التواصل قوانين البلديات، الشراء العام والمحاسبة العمومية.",
    "محتوى متنوع وتفاعلي يجمع بين المهارات وقانون البلديات، الشراء العام والمحاسبة العمومية.",
  ],
  target: ["رؤساء وأعضاء المجالس البلدية", "ناشطون سياسيون في الشأن المحلي"],
};

const LeadersGuide = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="leaders-guide-wrapper" id="leaders-guide">
      <div className="leaders-guide-overlay"></div>
      <div className="container leaders-guide-container">
        <motion.div
          ref={ref}
          initial={{ y: 100, opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="leaders-guide-content"
        >
          <h2 className="leaders-guide-main-title">
            برنامج القادة في البلديات 2025
          </h2>
          <div className="leaders-guide-widget">
            <div className="leaders-guide-icon-wrapper">
              <FileText className="leaders-guide-icon" />
            </div>
            <div className="leaders-guide-description">
              <p>
                يقدم هذا البرنامج الشامل رؤية معمقة حول دور القادة في البلديات
                وأهمية القيادة الفعالة في تطوير المجتمعات المحلية. يحتوي على
                إرشادات عملية وأفضل الممارسات لتمكين القادة المحليين من تحقيق
                التغيير الإيجابي في مجتمعاتهم.
              </p>
              <p>
                من خلال هذا البرنامج، ستتعرفون على استراتيجيات القيادة الحديثة،
                أساليب إدارة المشاريع البلدية، وطرق تعزيز المشاركة المجتمعية
                لبناء مستقبل أفضل للمدن والقرى اللبنانية.
              </p>
            </div>
            <button
              className="leaders-guide-button"
              onClick={() => setShowModal(true)}
            >
              اقرأ/ي الآن
            </button>
          </div>
        </motion.div>
      </div>
      {showModal && (
        <div
          className="leaders-guide-modal-overlay"
          onClick={() => setShowModal(false)}
        >
          <div
            className="leaders-guide-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="leaders-guide-modal-close"
              onClick={() => setShowModal(false)}
            >
              <X size={24} />
            </button>
            <div className="leaders-guide-modal-content">
              <div className="leaders-guide-modal-image">
                <img src="/images/leaders.jpeg" alt="Leaders" />
              </div>
              <div className="leaders-guide-modal-text" dir="rtl">
                <h2 className="leaders-guide-modal-title">
                  {modalContent.title}
                </h2>
                <p
                  className="leaders-guide-modal-desc"
                  dangerouslySetInnerHTML={{
                    __html: highlightEnglish(modalContent.description),
                  }}
                />
                <div className="leaders-guide-modal-section">
                  <h3 className="leaders-guide-modal-subtitle">
                    أهداف البرنامج:
                  </h3>
                  <ul className="leaders-guide-modal-list">
                    {modalContent.goals.map((goal, i) => (
                      <li
                        key={i}
                        dangerouslySetInnerHTML={{
                          __html: highlightEnglish(goal),
                        }}
                      />
                    ))}
                  </ul>
                </div>
                <div className="leaders-guide-modal-section">
                  <h3 className="leaders-guide-modal-subtitle">
                    محتوى البرنامج:
                  </h3>
                  <ul className="leaders-guide-modal-list">
                    {modalContent.content.map((item, i) => (
                      <li
                        key={i}
                        dangerouslySetInnerHTML={{
                          __html: highlightEnglish(item),
                        }}
                      />
                    ))}
                  </ul>
                </div>
                <div className="leaders-guide-modal-section">
                  <h3 className="leaders-guide-modal-subtitle">
                    الفئة المستهدفة:
                  </h3>
                  <ul className="leaders-guide-modal-list">
                    {modalContent.target.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadersGuide;
