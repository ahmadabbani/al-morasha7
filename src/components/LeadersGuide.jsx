import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FileText } from "lucide-react";
import "./LeadersGuide.css";

const LeadersGuide = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const handleReadNow = () => {
    window.open("/Leaders in Municipalities 2025.pdf", "_blank");
  };

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
            دليل القادة في البلديات 2025
          </h2>

          <div className="leaders-guide-widget">
            <div className="leaders-guide-icon-wrapper">
              <FileText className="leaders-guide-icon" />
            </div>

            <div className="leaders-guide-description">
              <p>
                يقدم هذا الدليل الشامل رؤية معمقة حول دور القادة في البلديات
                وأهمية القيادة الفعالة في تطوير المجتمعات المحلية. يحتوي على
                إرشادات عملية وأفضل الممارسات لتمكين القادة المحليين من تحقيق
                التغيير الإيجابي في مجتمعاتهم.
              </p>
              <p>
                من خلال هذا الدليل، ستتعرفون على استراتيجيات القيادة الحديثة،
                أساليب إدارة المشاريع البلدية، وطرق تعزيز المشاركة المجتمعية
                لبناء مستقبل أفضل للمدن والقرى اللبنانية.
              </p>
            </div>

            <button className="leaders-guide-button" onClick={handleReadNow}>
              اقرأ/ي الآن
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeadersGuide;
