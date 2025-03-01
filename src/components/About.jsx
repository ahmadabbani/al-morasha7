import React from "react";
import { BookOpen, Check, Target, Users } from "lucide-react";
import "./About.css";

const About = () => {
  return (
    <div className="about-wrapper" id="about">
      <div className="about-overlay"></div>

      <div className="container about-container">
        <h2 className="about-main-title">
          يتميّز هذا البرنامج بثلاثة محاور رئيسية:
        </h2>

        <div className="row about-features g-4">
          <div className="col-md-4">
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
                بفعالية وكفاءة. لن تحتاجوا للبحث في مصادر متفرّقة، فكل ما
                تحتاجونه سيكون بين يديكم في دليل واحد.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="about-box">
              <div className="about-icon-wrapper about-icon-wrapper-purple">
                <Target className="about-icon" />
              </div>
              <h3 className="about-box-title">تقييم ذاتي للقيادة والإدارة</h3>
              <p className="about-box-text">
                بعد التقييم الشخصي لكل مرشّح ستحصلون على تقرير شخصي متقدّم يكشف
                نقاط قوّتك وتحدياتك في مجال القيادة والإدارة. هذا التقييم
                سيساعدكم بالتعرّف إلى أسلوبكم القيادي من الناحية الإدارية
                والقياديّة.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="about-box">
              <div className="about-icon-wrapper about-icon-wrapper-green">
                <Users className="about-icon" />
              </div>
              <h3 className="about-box-title">
                تطوير القيادة السياسية والشخصية
              </h3>
              <p className="about-box-text">
                هذا الجزء يركّز على بناء شخصيّتكم القيادية عبر فهم منظومة القيم
                الخاصّة بكم وكيفية تطبيقها في العمل الإداري والسياسي. من خلال
                هذا المحور، سوف تتمكنوا من تطوير استراتيجيات تواصل فعّالة.
              </p>
            </div>
          </div>
        </div>

        <div className="about-additional">
          <h3 className="about-additional-title">
            بالإضافة إلى ذلك، سيتناول البرنامج مواضيع عملية هامّة مثل:
          </h3>
          <div className="about-additional-content">
            <p>
              <Check size={20} className="check-icon" />
              كيف تستعدّ شخصيًا لخوض الانتخابات وبناء فريق عمل فعّال؟
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
              ... والمزيد من المواضيع الأساسية التي تسهّل لكم فهم الصورة العامة
              لخوض هذا الاستحقاق بنجاح!
            </p>
          </div>
        </div>

        <div className="about-cta">
          <h4 className="about-cta-title">
            "المرشح/ة " هو دليلك الكامل والشامل لتكون جاهزًا لخوض الانتخابات
            بثقة ومعرفة متكاملة.
          </h4>
          <p className="about-cta-text">
            لا تضيّع الوقت،{" "}
            <a href="" className="about-cta-link">
              وسجّل الآن!
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
