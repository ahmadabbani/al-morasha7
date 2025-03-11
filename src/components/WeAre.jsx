import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Handshake, BarChart, CheckCircle } from "lucide-react";
import "./WeAre.css";

const WeAre = () => {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const inView1 = useInView(ref1, { once: true });
  const inView2 = useInView(ref2, { once: true });
  const inView3 = useInView(ref3, { once: true });
  const inView4 = useInView(ref4, { once: true });
  return (
    <section className="we-are-container" id="whoweare">
      <h1 className="we-are-title">من نحن</h1>
      <div className="container">
        <div className="row justify-content-center we-are-grid">
          {/* Card 1 */}
          <motion.div
            ref={ref1}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={
              inView1 ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }
            }
            transition={{ duration: 0.6, delay: 0 }}
            className="col-md-5 me-md-4 we-are-card "
          >
            <div className="we-are-icon">
              <Users size={50} />
            </div>
            <h2 className="we-are-card-title">
              من نحن في برنامج المرشّح/ة -{" "}
              <span className="english-text">Al Mourachah</span>
            </h2>
            <p className="we-are-card-text">
              يُعتبر برنامج المرشّح أول برنامج تدريبي مبتكر من نوعه في لبنان، تم
              تصميمه خصيصًا لدعم المرشحين الطامحين لخوض الانتخابات البلدية
              والاختيارية. هذا البرنامج ليس مجرد مبادرة فردية، بل هو ثمرة جهود
              فريق متكامل من الخبراء، الباحثين السياسيين، صانعي السياسات العامة،
              المدربين، الأخصائيين النفسيين، المحامين، وعلماء السياسة، الذين
              عملوا معًا لتطوير محتوى غني وفعّال يلبّي احتياجات المرشحين/ات
              الطموحين/ات.
              <br />
              من خلال نهج متكامل يجمع بين التخطيط الاستراتيجي، القيادة الشخصية
              والسياسية، المهارات الإدارية، إدارة الحملات، الخطاب السياسي،
              والتواصل الفعّال، يساعد برنامج المرشّح المشاركين على بناء شخصيتهم
              القيادية، تطوير استراتيجياتهم الانتخابية، والتعامل مع التحديات
              التي تواجههم خلال مسيرتهم الانتخابية.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            ref={ref2}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={
              inView2 ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }
            }
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-md-5 we-are-card me-md-4 "
          >
            <div className="we-are-icon">
              <Handshake size={50} />
            </div>
            <h2 className="we-are-card-title">
              تعاون استراتيجي مع{" "}
              <span className="english-text">Stewart Leadership</span> والتقييم
              الذاتي للقيادة
            </h2>
            <p className="we-are-card-text">
              في إطار تعزيز جودة البرنامج ورفع مستوى الكفاءة القيادية للمرشحين،
              نفخر بالتعاون الاستراتيجي مع شركة{" "}
              <span className="english-text">Stewart Leadership</span> الدولية،
              والرائدة عالميًا في تطوير القادة وتعزيز الأداء الشخصي والمهني.
              يشكل هذا التعاون ركيزة أساسية في برنامج المرشّح/ة، حيث يتيح
              للمشاركين/ات فرصة فريدة للاستفادة من أدوات متقدمة في تطوير الذات
              والقيادة، ومن أبرزها التقييم الذاتي للقيادة والإدارة.
              <br />
              يُعدّ التقييم الذاتي من{" "}
              <span className="english-text">Stewart Leadership</span> أداة
              احترافية تمكّن المرشحين من قياس نقاط القوة، الفعالية، ومستوى
              الأداء القيادي والإداري لديهم. هذا التقييم يساعدهم على تحديد
              المجالات التي تحتاج إلى تطوير، مما يوفّر لهم خارطة طريق واضحة
              لتحسين مهاراتهم وتعزيز جاهزيتهم قبل الوصول إلى المنصب.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            ref={ref3}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={
              inView3 ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }
            }
            transition={{ duration: 0.6, delay: 0.4 }}
            className="col-md-5 we-are-card me-md-4"
          >
            <div className="we-are-icon">
              <BarChart size={50} />
            </div>
            <h2 className="we-are-card-title">
              منهجية متكاملة لتحقيق النجاح الانتخابي
            </h2>
            <p className="we-are-card-text">
              يستند برنامج المرشّح إلى منهجية علمية متطورة تجمع بين التخطيط
              الاستراتيجي، القيادة الشخصية، المهارات الإدارية، إدارة الحملات،
              الخطاب السياسي، والتواصل الفعّال. ويهدف إلى تمكين المشاركين من
              بناء هوية قيادية قوية، وضع استراتيجيات انتخابية فعالة، والتفاعل
              بثقة مع الجمهور والناخبين.
            </p>
          </motion.div>

          {/* Card 4 */}
          <motion.div
            ref={ref4}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={
              inView4 ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }
            }
            transition={{ duration: 0.6, delay: 0.6 }}
            className="col-md-5 we-are-card me-md-4"
          >
            <div className="we-are-icon">
              <CheckCircle size={50} />
            </div>
            <h2 className="we-are-card-title">
              جاهزية كاملة قبل الوصول إلى المنصب
            </h2>
            <p className="we-are-card-text">
              نحن نؤمن بأن النجاح في العمل الاختياري والبلدي يتطلّب أكثر من مجرد
              نوايا حسنة، بل يحتاج إلى تأهيل علمي وعملي مبني على أسس متينة.
              لذلك، يقدّم برنامج "المرشّح/ة" محتوى تدريبي متطور يعتمد على أحدث
              الدراسات، التجارب العملية، والتحليل العميق للواقع السياسي
              والاجتماعي في لبنان.
              <br />
              إذا كنتم تسعون لأن تكونوا قادة مؤثّرون في مجتمعكم، فإن برنامج
              المرشّح هو خطوتكم الأولى نحو النجاح والاستعداد الأمثل لخوض
              الانتخابات بثقة واحترافية.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WeAre;
