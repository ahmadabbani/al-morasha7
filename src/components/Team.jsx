import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Team.css";

const Team = () => {
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true });

  const teamMembers = [
    {
      id: 1,
      name: "مازن جبور",
      role: "إحصائي وخبير انتخابي",
      image: "/images/t4.jpeg",
      description: [
        "إحصائي وخبير انتخابي يتمتّع بخبرة تمتد لأكثر من 17 سنة في مجال الانتخابات والأبحاث",
        "مؤسس شركة OrcaStat للاستشارات والأبحاث، المتخصصة في تصميم وتنفيذ الاستبيانات، الدراسات الميدانية، والتحليلات الإحصائية المتقدمة",
        "شغل منصب خبير إحصائي وانتخابي في مؤسسات محلية ودولية، حيث عمل على محاكاة القوانين الانتخابية، تطوير برامج محاكاة متقدمة، وتحليل النتائج وتقديمها لصنّاع القرار",
        "تولّى قيادة فرق إحصائية متخصصة في مشاريع انتخابية بارزة شملت دراسات معمقة وسيناريوهات خاصة بالقوانين الانتخابية",
        "يتميّز بدقة عالية في التنبؤ بالنتائج الانتخابية، مع سجل إنجازات يتضمّن نسبة نجاح تفوق 95% في التوقّعات",
        "عمل على تطوير أدوات تقنية متقدمة لدعم يوم الانتخابات Election Day Applications وإدارة العمليات الانتخابية لحظة بلحظة",
        "يمتلك خبرة واسعة في تصميم العيّنات، إدارة فرق جمع البيانات، وضمان الوصول إلى مناطق صعبة جغرافياً أو سياسياً",
        "يجمع بين الخبرة الأكاديمية (ماجستير في الرياضيات التطبيقية من الجامعة اللبنانية) والخبرة العملية في استخدام أحدث البرمجيات الإحصائية",
        "يتمتّع بخبرة متميّزة في توظيف البيانات الإحصائية وتحويلها إلى رؤى استراتيجية معمقة",
      ],
    },
    {
      id: 2,
      name: "جو حمورة",
      role: "باحث ومحلّل سياسي",
      image: "/images/t5.jpg",
      description: [
        "حائز على دكتوراه في العلاقات الدولية، ماجستير في الدراسات الاستراتيجية وآخر في العلوم السياسية",
        "متخصص في السياسات العامة، الديمقراطية، حقوق الإنسان، التطرف الديني، والحوكمة في الشرق الأوسط",
        "مؤلف لعدة كتب، عشرات الأوراق البحثية، ومئات المقالات بأربع لغات: العربية، الإنكليزية، الفرنسية، التركية",
        "شارك كمستشار سياسي مع بعثة الاتحاد الأوروبي لمراقبة الانتخابات في لبنان 2022",
        "عمل باحثًا في عدة مراكز أبحاث معنية بشؤون لبنان، تركيا والشرق الأوسط",
        "مدرّب في القيادة، الإعلام، والتواصل مع خبرة في برامج محلية ودولية",
        "محاضر ومشارك دائم في مؤتمرات أكاديمية وإعلامية حول السياسة اللبنانية والعلاقات الدولية",
      ],
    },
    {
      id: 3,
      name: "غنوة عطية",
      role: "Media ID خبيرة إعلامية ومؤسِّسة شركة ",
      image: "/images/t2.jpg",
      description: [
        "Media ID (media-id.co) مؤسِّسة شركة ",
        "حاصلة على إجازة في الصحافة والإعلام",
        "حاصلة على ماجستير في الإعلام والتواصل، بشهادة مزدوجة من الجامعة الأنطونية (لبنان) وجامعة تولون (فرنسا) – ماجستير في العلوم الإنسانية والاجتماعية، اختصاص إعلام و تواصل",
        "تمتلك خبرة واسعة في مجالات الصحافة، التلفزيون، والإعلام الرقمي، بما في ذلك العمل كمراسلة ومنتجة تلفزيونية في مؤسسات رائدة تقليدية، وكذلك كمنتجة بودكاست في دبي",
        "خبيرة متعددة المهارات في الإعلام، تتميّز بسجل حافل في الصحافة والإنتاج التلفزيوني والبودكاست",
      ],
      link: "https://media-id.co",
    },
    {
      id: 4,
      name: "الياس عقل",
      role: "محامٍ ومستشار قانوني",
      image: "/images/t3.jpg",
      description: [
        "محامٍ وعضو نقابة المحامين في بيروت بخبرة تفوق 16 سنة في لبنان والإمارات. متخصص في القضايا التجارية والجزائية، المشاريع الكبرى، والمسائل المصرفية والعقود",
        "حائز على ماجستير في القانون الخاص والجزائي من جامعة الروح القدس – الكسليك، ويتقن العربية، الفرنسية والإنكليزية",
        "قدّم استشارات لعدد من الشركات والنقابات المحلية والدولية، ولعب دورًا بارزًا في صياغة قوانين وتشريعات لبنانية بالتعاون مع نواب البرلمان",
        "شارك مع UNDP و OMSAR في التحول الرقمي للدولة اللبنانية، وشارك بصياغة مرسوم التوقيع الإلكتروني وقانون حماية البيانات الرقمية",
        "يشغل موقع المستشار القانوني لعدد من الشركات، نقابات في بيروت، ورواد أعمال لبنانيين وأجانب",
      ],
    },

    {
      id: 5,
      name: "ميشال دكّاش",
      role: "مدرّب في فنّ القيادة الذاتية والسياسية",
      image: "/images/t1.jpg",
      description: [
        "خبير ومدرب في فن القيادة الذاتية وتغيير السلوك مع أكثر من 17,000 ساعة تدريب لقادة، رواد أعمال، بلديات ومرشحين للخدمة العامة",
        'مؤسس برنامج "المرشح/ة" لإعداد المرشحين للانتخابات النيابية والبلدية',
        "ماجستير في العلوم السياسية والإدارية، وماجستير في الدراسات الاستراتيجية من الجامعة اللبنانية ومركز البحوث والدراسات الاستراتيجية في الجيش اللبناني",
        "ديبلوم من جامعة فيرجينيا - أميركا، مركز السياسة في القيادة والتواصل السياسي",
        "حائز على عدة جوائز دولية: MEPI Alumni of the Year 2020 من وزارة الخارجية الأميركية، Leadership Management International – USA لأفضل مدرّب بين 80 دولة، Konrad Adenauer Stiftung – KAS في برلين في القيادة والتخاطب السياسي",
        "قدّم تدريبات في أكثر من 20 دولة وتعاون مع الأمم المتحدة، وزارة الخارجية الأميركية، الاتحاد الأوروبي، KAS، IRI، والمجلس الثقافي البريطاني",
        "خبير في الانتخابات، الحملات السياسية، وبناء الاستراتيجيات السياسية",
      ],
    },
  ];

  const NextArrow = ({ onClick }) => (
    <div className="team-arrow team-arrow-next" onClick={onClick}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M15 18L9 12L15 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div className="team-arrow team-arrow-prev" onClick={onClick}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 18L15 12L9 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    rtl: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "team-dots",
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
        },
      },
    ],
  };

  const renderDescription = (text) => {
    const parts = text.split(
      /(\b[A-Z][A-Za-z0-9\s&\-–.,:]+(?:\s[A-Z][A-Za-z0-9\s&\-–.,:]*)*)/g
    );

    return parts.map((part, idx) => {
      if (/[A-Z]/.test(part) && /[a-zA-Z]/.test(part)) {
        return (
          <span
            key={idx}
            dir="ltr"
            style={{
              display: "inline-block",
              fontWeight: "bold",
              marginLeft: "4px",
              marginRight: "4px",
            }}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const splitDescription = (description) => {
    const mid = Math.ceil(description.length / 2);
    return {
      right: description.slice(0, mid),
      left: description.slice(mid),
    };
  };

  return (
    <section className="team-section" ref={sectionRef} id="team">
      <h2 className="team-title">فريق العمل</h2>

      <motion.div
        className="team-slider-wrapper"
        initial={{ opacity: 0, y: 150 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 150 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <Slider {...settings}>
          {teamMembers.map((member) => {
            const { left, right } = splitDescription(member.description);
            return (
              <div key={member.id}>
                <div className="team-card">
                  <div className="team-card-image-wrapper">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="team-card-image"
                    />
                  </div>
                  <div className="team-card-content">
                    <h3 className="team-card-name">{member.name}</h3>
                    <p className="team-card-role">{member.role}</p>
                    <div className="team-card-description-wrapper">
                      <ul className="team-card-description">
                        {left.map((item, index) => (
                          <li key={index}>
                            {member.link && item.includes("media-id.co") ? (
                              <>
                                {renderDescription(item.split("(")[0])}(
                                <a
                                  href={member.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="team-card-link"
                                >
                                  media-id.co
                                </a>
                                )
                              </>
                            ) : (
                              renderDescription(item)
                            )}
                          </li>
                        ))}
                      </ul>
                      <ul className="team-card-description">
                        {right.map((item, index) => (
                          <li key={index}>{renderDescription(item)}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </motion.div>
    </section>
  );
};

export default Team;
