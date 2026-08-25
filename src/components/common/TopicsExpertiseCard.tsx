import React, { useState } from 'react';
import { 
  Sparkles, 
  Atom, 
  Code2, 
  Binary, 
  Stethoscope, 
  Landmark, 
  GraduationCap, 
  ArrowRight,
  Zap,
  BookOpenCheck,
  CheckCircle2
} from 'lucide-react';
import { useI18n } from '../../i18n';
import { SupportedLanguage } from '../../types/i18n';

interface TopicCategory {
  id: string;
  name: string;
  badge: string;
  icon: React.ReactNode;
  color: string;
  accentBg: string;
  description: string;
  popularTopics: string[];
  features: string[];
}

interface TopicsExpertiseCardProps {
  onSelectTopic?: (topic: string) => void;
  className?: string;
}

export const TopicsExpertiseCard: React.FC<TopicsExpertiseCardProps> = ({ 
  onSelectTopic, 
  className = '' 
}) => {
  const { language } = useI18n();
  const [activeTab, setActiveTab] = useState<string>('stem');

  // Multi-lingual translations dictionary for topics expertise
  const isTa = language === 'ta';
  const isHi = language === 'hi';
  const isTe = language === 'te';
  const isMl = language === 'ml';
  const isKn = language === 'kn';
  const isBn = language === 'bn';
  const isMr = language === 'mr';
  const isAr = language === 'ar';
  const isEs = language === 'es';
  const isFr = language === 'fr';
  const isDe = language === 'de';
  const isJa = language === 'ja';
  const isKo = language === 'ko';
  const isZh = language === 'zh';

  // Localized Strings
  const headerBadge = isTa ? 'AI உள்ளடக்க தேர்ச்சி' : isHi ? 'AI सामग्री दक्षता' : isAr ? 'إتقان المحتوى بالذكاء الاصطناعي' : isEs ? 'Dominio de Contenido con IA' : isZh ? 'AI 学术内容精通' : 'AI Content Mastery';
  const headerTitle = isTa ? 'AI ஒயிட்போர்டு சிறந்து விளங்கும் பாடங்கள்' : isHi ? 'विषय जिनमें AI व्हाइटबोर्ड उत्कृष्ट है' : isAr ? 'المجالات الأكاديمية التي تتفوق بها المنصة' : isEs ? 'Temas en los que Destaca AI Whiteboard' : isZh ? 'AI 智能白板最擅长的核心学术领域' : 'Topics AI Whiteboard Excels At';
  const headerSubtitle = isTa ? 'எங்கள் மல்டிமாடல் இயந்திரம் கல்விசார் துல்லியம், சூத்திரங்கள் மற்றும் தேர்வுத் தாள்களுக்காக வடிவமைக்கப்பட்டுள்ளது.' : isHi ? 'हमारा मल्टीमॉडल इंजन संरचित अकादमिक सटीकता, सूत्र परिशुद्धता और परीक्षा-स्तरीय स्लाइडों के लिए ट्यून किया गया है।' : isAr ? 'محركنا متعدد الوسائط مصمم خصيصاً للدقة الأكاديمية وصياغة المعادلات وإعداد شرائح الامتحانات.' : isEs ? 'Nuestro motor multimodal está optimizado para la máxima precisión académica, fórmulas y diapositivas de examen.' : isZh ? '多模态引擎专为学术严谨性、数理公式高精推导及考试级课件深度优化。' : 'Our multimodal engine is tuned for structured academic accuracy, formula precision, and exam-grade slides.';
  
  const factCheckTitle = isTa ? '100% உண்மை சரிபார்க்கப்பட்டது' : isHi ? '100% तथ्य-सत्यापित' : isAr ? 'موثوق ومدقق بنسبة 100%' : isEs ? '100% Verificado' : isZh ? '100% 事实核查' : '100% Fact-Checked';
  const factCheckSubtitle = isTa ? 'கடுமையான துல்லிய விதிகள்' : isHi ? 'सटीक और प्रामाणिक नियम' : isAr ? 'قواعد صارمة لمنع التخمين' : isEs ? 'Reglas estrictas de precisión' : isZh ? '严格防幻觉推导规则' : 'Strict anti-hallucination rules';

  const popularHeader = isTa ? 'பிரபலமான உயர் துல்லிய தலைப்புகள்' : isHi ? 'लोकप्रिय उच्च-सटीकता विषय' : isAr ? 'أهم الموضوعات عالية الدقة' : isEs ? 'Temas Populares de Alta Precisión' : isZh ? '热门高精度学术课题' : 'Popular High-Accuracy Topics';
  const clickToTest = isTa ? 'சோதிக்க ஏதேனும் தலைப்பைத் தேர்ந்தெடுக்கவும்' : isHi ? 'परीक्षण के लिए किसी भी विषय पर क्लिक करें' : isAr ? 'انقر على أي موضوع لتجربته فوراً' : isEs ? 'Haz clic en un tema para probar' : isZh ? '点击任意课题立即测试' : 'Click any topic to test';

  const categories: TopicCategory[] = [
    {
      id: 'stem',
      name: isTa ? 'அறிவியல் & இயற்பியல்' : isHi ? 'विज्ञान एवं भौतिकी' : isAr ? 'العلوم والفيزياء' : isEs ? 'Ciencia y Física' : isZh ? '自然科学与物理' : 'Science & Physics',
      badge: isTa ? 'சூத்திர வழித்தோன்றல்கள்' : isHi ? 'सूत्र व्युत्पत्ति' : isAr ? 'اشتقاق المعادلات' : isEs ? 'Derivaciones de Fórmulas' : isZh ? '公式推导与定理' : 'Formula Derivations',
      icon: <Atom className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      accentBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
      description: isTa ? 'உயிர்வேதியியல் வழிமுறைகள், இயற்பியல் விதிகள், சமன்பாடுகள் மற்றும் செல்லுலார் உயிரியலில் சிறந்தது.' : isHi ? 'जैव रासायनिक तंत्र, भौतिकी के नियम, समीकरण, रासायनिक अभिक्रियाएं और कोशिका जीव विज्ञान में उत्कृष्ट।' : isAr ? 'يتفوق في آليات الكيمياء الحيوية، قوانين الفيزياء، المعادلات، والتفاعلات الحيوية.' : isEs ? 'Destaca en mecanismos bioquímicos, leyes de física, ecuaciones, reacciones y biología celular.' : isZh ? '精通生化反应机理、物理学定律推导、化学方程式配平与细胞生物学。' : 'Excels at biochemical mechanisms, physics laws, equations, reactions, and cellular biology.',
      popularTopics: isTa ? [
        'ஒளிச்சேர்க்கை & ஒளி வினைகள்',
        'குவாண்டம் இயக்கவியல் & அலை செயல்பாடுகள்',
        'நியூட்டனின் இயக்கவியல் & விசைகள்',
        'வெப்ப இயக்கவியல் & கார்னோட் இயந்திரம்',
        'செல்லுலார் சுவாசம் & ATP சுழற்சி',
        'கரிம வேதியியல் வினைகள்'
      ] : isHi ? [
        'प्रकाश संश्लेषण और प्रकाश अभिक्रियाएं',
        'क्वांटम यांत्रिकी और तरंग फलन',
        'न्यूटनियन गतिविज्ञान और बल',
        'ऊष्मागतिकी और कार्नो इंजन',
        'कोशिकीय श्वसन और एटीपी चक्र',
        'कार्बनिक अभिक्रिया तंत्र'
      ] : isAr ? [
        'التمثيل الضوئي وتفاعلات الضوء',
        'ميكانيكا الكم والدوال الموجية',
        'ديناميكا نيوتن وقوانين القوى',
        'الديناميكا الحرارية ومحرك كارنو',
        'التنفس الخلوي ودورة ATP',
        'آليات التفاعلات العضوية'
      ] : isEs ? [
        'Fotosíntesis y Reacciones Luminosas',
        'Mecánica Cuántica y Funciones de Onda',
        'Dinámica Newtoniana y Fuerzas',
        'Termodinámica y Motor de Carnot',
        'Respiración Celular y Ciclo ATP',
        'Mecanismos de Reacciones Orgánicas'
      ] : isZh ? [
        '光合作用与光反应全机理',
        '量子力学与薛定谔波函数',
        '牛顿力学与受力分析推导',
        '热力学定律与卡诺热机循环',
        '细胞呼吸与 ATP 能量转化',
        '有机化学反应机理与合成路径'
      ] : [
        'Photosynthesis & Light Reactions',
        'Quantum Mechanics & Wave Functions',
        'Newtonian Dynamics & Forces',
        'Thermodynamics & Carnot Engine',
        'Cellular Respiration & ATP Cycle',
        'Organic Reaction Mechanisms'
      ],
      features: isTa ? ['படி-படியான எதிர்வினை ஓட்டம்', 'முக்கிய சூத்திர பிரித்தெடுத்தல்', 'வரைபட காட்சி விளக்கங்கள்'] : isHi ? ['चरणबद्ध अभिक्रिया प्रवाह', 'मुख्य सूत्र निष्कर्षण', 'आरेख दृश्य विवरण'] : isAr ? ['تدفق التفاعلات خطوة بخطوة', 'استخراج المعادلات الرئيسية', 'وصف مرئي للمخططات'] : isEs ? ['Flujos de reacción paso a paso', 'Extracción de fórmulas clave', 'Descripciones visuales de esquemas'] : isZh ? ['分步反应全流程拆解', '关键公式参数结构化提取', '学术图表高清重绘描述'] : ['Step-by-step reaction flows', 'Key formula extraction', 'Diagram visual descriptions']
    },
    {
      id: 'tech',
      name: isTa ? 'கணினி அறிவியல் & AI' : isHi ? 'कंप्यूटर साइंस एवं AI' : isAr ? 'علوم الحاسوب والذكاء الاصطناعي' : isEs ? 'Ciencias de la Computación e IA' : isZh ? '计算机科学与人工智能' : 'Computer Science & AI',
      badge: isTa ? 'குறியீடு & கட்டமைப்பு' : isHi ? 'कोड और संरचना' : isAr ? 'البرمجة وهندسة البرمجيات' : isEs ? 'Código y Arquitectura' : isZh ? '算法逻辑与系统架构' : 'Code & Architecture',
      icon: <Code2 className="w-5 h-5" />,
      color: 'from-indigo-500 to-purple-500',
      accentBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
      description: isTa ? 'கணினி வடிவமைப்புகள், தரவு கட்டமைப்புகள், வழிமுறைகள் மற்றும் நரம்பியல் நெட்வொர்க் கருத்துகளுக்கு ஏற்றது.' : isHi ? 'सिस्टम डिजाइन, डेटा संरचनाएं, एल्गोरिदम, एसक्यूएल और न्यूरल नेटवर्क अवधारणाओं के लिए आदर्श।' : isAr ? 'مثالي لتصميم الأنظمة وهياكل البيانات والخوارزميات واستعلامات SQL والشبكات العصبية.' : isEs ? 'Ideal para diseño de sistemas, estructuras de datos, algoritmos, SQL y redes neuronales.' : isZh ? '专为系统设计、数据结构、算法复杂度分析、SQL 关联查询及神经网络优化。' : 'Ideal for system designs, data structures, algorithms, SQL querying, and neural network concepts.',
      popularTopics: isTa ? [
        'பைனரி தேடல் & சிக்கலானது (O(log n))',
        'நரம்பியல் நெட்வொர்க்குகள் & பேக்ரோபகேஷன்',
        'டேட்டாபேஸ் இயல்பாக்கம் & SQL இணைப்புகள்',
        'கணினி கட்டமைப்பு & மைக்ரோ சர்வீசஸ்',
        'டைனமிக் புரோகிராமிங் & மறுநிகழ்வு',
        'REST APIகள் & ஒத்திசைவற்ற JS'
      ] : isHi ? [
        'बाइनरी सर्च और जटिलता (O(log n))',
        'न्यूरल नेटवर्क और बैकप्रॉपैगैशन',
        'डेटाबेस सामान्यीकरण और SQL जॉइन',
        'सिस्टम आर्किटेक्चर और माइक्रोसर्विसेज',
        'डायनेमिक प्रोग्रामिंग और रिकर्सन',
        'REST APIs और एसिंक्रोनस जावास्क्रिप्ट'
      ] : isAr ? [
        'البحث الثنائي والتعقيد الزمني (O(log n))',
        'الشبكات العصبية والانتشار الخلفي',
        'تنظيم قواعد البيانات وربط SQL',
        'هندسة الأنظمة والخدمات المصغرة',
        'البرمجة الديناميكية والتكرار',
        'واجهات REST API والجافاسكريبت غير المتزامن'
      ] : isEs ? [
        'Búsqueda Binaria y Complejidad (O(log n))',
        'Redes Neuronales y Retropropagación',
        'Normalización de BD y Joins en SQL',
        'Arquitectura de Sistemas y Microservicios',
        'Programación Dinámica y Recursión',
        'APIs REST y JavaScript Asíncrono'
      ] : isZh ? [
        '二分查找与时间复杂度 (O(log n))',
        '深度神经网络与反向传播算法',
        '数据库范式设计与 SQL 多表连接',
        '高并发微服务架构与分布式系统',
        '动态规划状态转移与递归剪枝',
        'RESTful API 规范与异步并发编程'
      ] : [
        'Binary Search & Complexity (O(log n))',
        'Neural Networks & Backpropagation',
        'Database Normalization & SQL Joins',
        'System Architecture & Microservices',
        'Dynamic Programming & Recursion',
        'REST APIs & Asynchronous JavaScript'
      ],
      features: isTa ? ['அல்காரிதம் நேர சிக்கலானது', 'கணினி கட்டமைப்பு ஓட்டம்', 'தரவு கட்டமைப்பு ஒப்பீடுகள்'] : isHi ? ['एल्गोरिदम समय जटिलता', 'सिस्टम आर्किटेक्चर प्रवाह', 'डेटा संरचना तुलना'] : isAr ? ['تحليل التعقيد الزمني للخوارزميات', 'مخططات تدفق بنية الأنظمة', 'مقارنة هياكل البيانات'] : isEs ? ['Complejidad algorítmica', 'Flujos de arquitectura de sistemas', 'Comparación de estructuras de datos'] : isZh ? ['算法时间与空间复杂度评估', '分布式微服务拓扑图绘制', '核心数据结构优劣势对比'] : ['Algorithmic time complexity', 'System architecture flows', 'Data structure comparisons']
    },
    {
      id: 'math',
      name: isTa ? 'கணிதம் & புள்ளிவிவரம்' : isHi ? 'गणित एवं सांख्यिकी' : isAr ? 'الرياضيات والإحصاء' : isEs ? 'Matemáticas y Estadística' : isZh ? '高等数学与统计学' : 'Mathematics & Stats',
      badge: isTa ? 'சான்றுகள் & தீர்வுகள்' : isHi ? 'प्रमाण और समाधान' : isAr ? 'البراهين والحلول الرياضية' : isEs ? 'Demostraciones y Soluciones' : isZh ? '定理推导与方程求解' : 'Proofs & Solutions',
      icon: <Binary className="w-5 h-5" />,
      color: 'from-amber-500 to-orange-500',
      accentBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      description: isTa ? 'இயற்கணித சூத்திரங்கள், கால்குலஸ் தேற்றங்கள் மற்றும் நிகழ்தகவுக்கான உயர் துல்லியம்.' : isHi ? 'बीजगणितीय सूत्र, कलन प्रमेय, प्रायिकता और निर्देशांक ज्यामिति के लिए उच्च परिशुद्धता।' : isAr ? 'دقة فائقة في المعادلات الجبرية، نظريات التفاضل والتكامل، والاحتمالات.' : isEs ? 'Alta precisión para fórmulas algebraicas, cálculo, probabilidad y geometría analítica.' : isZh ? '高度适配微积分定理、线性代数矩阵运算、概率论与贝叶斯推断。' : 'High precision for algebraic formulas, calculus theorems, probability, and coordinate geometry.',
      popularTopics: isTa ? [
        'கால்குலஸ்: வழித்தோன்றல்கள் & ஒருங்கிணைப்பு',
        'நேரியல் இயற்கணிதம் & அணி செயல்பாடுகள்',
        'நிகழ்தகவு & பேயஸ் தேற்றம்',
        'முக்கோணவியல் அடையாளங்கள் & சான்றுகள்',
        'வேறுபட்ட சமன்பாடுகள் மாடலிங்',
        'சிக்கலான எண்கள் & ஆய்லர் அடையாளம்'
      ] : isHi ? [
        'कैलकुलस: अवकलन और समाकलन',
        'रैखिक बीजगणित और आव्यूह संक्रियाएं',
        'प्रायिकता और बेयस प्रमेय',
        'त्रिकोणमितीय सर्वसमिकाएं और प्रमाण',
        'अवकल समीकरण मॉडलिंग',
        'सम्मिश्र संख्याएं और यूलर पहचान'
      ] : isAr ? [
        'التفاضل والتكامل: المشتقات والتكاملات',
        'الجبر الخطي وعمليات المصفوفات',
        'الاحتمالات ونظرية بايز',
        'المتطابقات المثلثية والبراهين',
        'نمذجة المعادلات التفاضلية',
        'الأعداد المركبة ومتطابقة أويلر'
      ] : isEs ? [
        'Cálculo: Derivadas e Integrales',
        'Álgebra Lineal y Matrices',
        'Probabilidad y Teorema de Bayes',
        'Identidades Trigonométricas y Demostraciones',
        'Modelado de Ecuaciones Diferenciales',
        'Números Complejos e Identidad de Euler'
      ] : isZh ? [
        '微积分：导数、微分与定积分求解',
        '线性代数：特征值、特征向量与矩阵变换',
        '概率论与数理统计：贝叶斯全概率定理',
        '三角函数恒等式变形与几何证明',
        '常微分方程建模与动力系统分析',
        '复变函数、欧拉公式与傅里叶变换'
      ] : [
        'Calculus: Derivatives & Integration',
        'Linear Algebra & Matrix Operations',
        'Probability & Bayes Theorem',
        'Trigonometric Identities & Proofs',
        'Differential Equations Modeling',
        'Complex Numbers & Euler Identity'
      ],
      features: isTa ? ['துல்லியமான சூத்திர முறிவுகள்', 'படி-படியான கணக்கீடுகள்', 'நடைமுறை கணித பயன்பாடுகள்'] : isHi ? ['सटीक सूत्र विश्लेषण', 'चरणबद्ध गणनाएं', 'वास्तविक जीवन में अनुप्रयोग'] : isAr ? ['تحليل دقيق للمعادلات', 'حسابات خطوة بخطوة', 'تطبيقات عملية في الواقع'] : isEs ? ['Desglose exacto de fórmulas', 'Cálculos paso a paso', 'Aplicaciones prácticas'] : isZh ? ['严谨公式推演拆解', '分步计算过程全展示', '数理逻辑实际应用解析'] : ['Exact formula breakdowns', 'Stepwise calculations', 'Real-world math applications']
    },
    {
      id: 'med',
      name: isTa ? 'மருத்துவம் & நல்வாழ்வு' : isHi ? 'चिकित्सा एवं स्वास्थ्य' : isAr ? 'الطب والرعاية الصحية' : isEs ? 'Medicina y Salud' : isZh ? '基础医学与临床医学' : 'Medicine & Healthcare',
      badge: isTa ? 'மருத்துவ நோயறிதல்' : isHi ? 'नैदानिक ​​निदान' : isAr ? 'التشخيص السريري' : isEs ? 'Diagnóstico Clínico' : isZh ? '病理病机与临床诊断' : 'Clinical Diagnostics',
      icon: <Stethoscope className="w-5 h-5" />,
      color: 'from-rose-500 to-pink-500',
      accentBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      description: isTa ? 'உடற்கூறியல் கட்டமைப்புகள், நோய் உருவாக்கம் மற்றும் மருந்தியல் விவரிக்க சிறந்தது.' : isHi ? 'शारीरिक संरचनाओं, रोग रोगजनन, औषध विज्ञान और नैदानिक ​​मामलों के लिए अनुकूलित।' : isAr ? 'مصمم خصيصاً للتشريح وعلم الأمراض وعلم الأدوية والحالات السريرية.' : isEs ? 'Optimizado para anatomía, patogénesis, farmacología y casos clínicos.' : isZh ? '深度解析人体解剖结构、疾病发病机理、药理作用机制与临床典型病例。' : 'Specially optimized for anatomical structures, disease pathogenesis, pharmacology, and medical vignettes.',
      popularTopics: isTa ? [
        'இதய சுழற்சி & ECG அலைவடிவங்கள்',
        'மருந்தியல் & மருந்து செயல்பாட்டு வழிமுறை',
        'இரத்தவியல் & இரத்த சோகை வகைப்பாடு',
        'நாளமில்லா சுரப்பி அமைப்பு & ஹார்மோன்கள்',
        'நோயியல் & நோயறிதல் அளவுகோல்கள்',
        'நியூரோஅனாடமி & மண்டை நரம்புகள்'
      ] : isHi ? [
        'हृदय चक्र और ईसीजी तरंगें',
        'औषध विज्ञान और दवा क्रिया तंत्र',
        'हेमेटोलॉजी और एनीमिया वर्गीकरण',
        'अंतःस्रावी तंत्र और हार्मोन',
        'पैथोलॉजी और नैदानिक ​​मानदंड',
        'न्यूरोएनाटॉमी और कपाल तंत्रिकाएं'
      ] : isAr ? [
        'الدورة القلبية وتخطيط القلب (ECG)',
        'علم الأدوية وآليات عمل العقاقير',
        'أمراض الدم وتصنيفات فقر الدم',
        'جهاز الغدد الصماء والهرمونات',
        'علم الأمراض ومعايير التشخيص',
        'تشريح الجهاز العصبي والأعصاب القحفية'
      ] : isEs ? [
        'Ciclo Cardíaco y Ondas de ECG',
        'Farmacología y Mecanismos de Fármacos',
        'Hematología y Tipos de Anemia',
        'Sistema Endocrino y Hormonas',
        'Patología y Criterios Diagnósticos',
        'Neuroanatomía y Pares Craneales'
      ] : isZh ? [
        '心动周期生理学与心电图 (ECG) 波形解析',
        '药理学：药物代谢动力学与受体作用机制',
        '血液学：各类贫血发病机制与鉴别诊断',
        '内分泌系统激素调节轴与代谢紊乱',
        '病理学核心诊断标准与临床病理联系',
        '神经解剖学：12对脑神经走行与传导通路'
      ] : [
        'Cardiac Cycle & ECG Waveforms',
        'Pharmacology & Drug Mechanism',
        'Hematology & Anemia Classifications',
        'Endocrine System & Hormones',
        'Pathology & Diagnostic Criteria',
        'Neuroanatomy & Cranial Nerves'
      ],
      features: isTa ? ['உடலியல் வழிமுறை ஓட்டம்', 'நோயறிதல் அட்டவணைகள்', 'மருத்துவ பரிசோதனை தொடர்பு'] : isHi ? ['शारीरिक तंत्र प्रवाह', 'नैदानिक ​​तालिकाएं', 'नैदानिक ​​परीक्षण प्रासंगिकता'] : isAr ? ['مخططات الآليات الفسيولوجية', 'جداول تشخيصية مقارنة', 'تطبيقات التجارب السريرية'] : isEs ? ['Flujos fisiológicos', 'Tablas de diagnóstico', 'Relevancia clínica'] : isZh ? ['生理病理机制闭环导图', '临床鉴别诊断对照表', '循证医学临床指南要点'] : ['Physiological mechanism flows', 'Diagnostic tables', 'Clinical trial relevance']
    },
    {
      id: 'history',
      name: isTa ? 'வரலாறு & குடிமையியல்' : isHi ? 'इतिहास एवं नागरिक शास्त्र' : isAr ? 'التاريخ والعلوم السياسية' : isEs ? 'Historia y Civismo' : isZh ? '历史学与政治文明' : 'History & Civics',
      badge: isTa ? 'காலவரிசைகள் & அரசியல்' : isHi ? 'समयरेखा और राजनीति' : isAr ? 'التسلسل الزمني والجيوسياسي' : isEs ? 'Cronologías y Geopolítica' : isZh ? '历史纪年与宪制脉络' : 'Timelines & Geopolitics',
      icon: <Landmark className="w-5 h-5" />,
      color: 'from-emerald-500 to-teal-500',
      accentBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      description: isTa ? 'துல்லியமான காலவரிசைகள், அரசியலமைப்பு பிரிவுகள் மற்றும் வரலாற்று காரணங்கள்.' : isHi ? 'सटीक कालानुक्रमिक समयरेखा, संवैधानिक अनुच्छेद, संधियों का विश्लेषण और ऐतिहासिक कारण।' : isAr ? 'تسلسل زمني دقيق، المواد الدستورية، تفكيك المعاهدات، والأسباب التاريخية.' : isEs ? 'Líneas de tiempo precisas, artículos constitucionales, tratados y causas históricas.' : isZh ? '构建严谨的历史编年史时间轴、宪法法条沿革与重大地缘政治事件动因。' : 'Accurate chronological timelines, constitutional articles, treaty breakdowns, and historical causes.',
      popularTopics: isTa ? [
        'இரண்டாம் உலகப் போர்: போர்கள் & அரசியல்',
        'அரசியலமைப்பு உரிமைகள் & சட்டப் பிரிவுகள்',
        'தொழில்துறை புரட்சி மாற்றங்கள்',
        'பனிப்போர் கூட்டணிகள் & விண்வெளி பந்தயம்',
        'பண்டைய நாகரிகங்கள் & வர்த்தக வழிகள்',
        'பொருளாதார கொள்கைகள் & நாணயக் கொள்கை'
      ] : isHi ? [
        'द्वितीय विश्व युद्ध: युद्ध और भू-राजनीति',
        'संवैधानिक अधिकार और कानून के अनुच्छेद',
        'औद्योगिक क्रांति के परिवर्तन',
        'शीत युद्ध गठबंधन और अंतरिक्ष दौड़',
        'प्राचीन सभ्यताएं और व्यापार मार्ग',
        'आर्थिक नीतियां और मौद्रिक नीति'
      ] : isAr ? [
        'الحرب العالمية الثانية: المعارك والجيوسياسة',
        'الحقوق الدستورية والمواد القانونية',
        'تحولات الثورة الصناعية',
        'تحالفات الحرب الباردة وسباق الفضاء',
        'الحضارات القديمة وطرق التجارة',
        'السياسات الاقتصادية والنقدية'
      ] : isEs ? [
        'Segunda Guerra Mundial: Batallas y Geopolítica',
        'Derechos Constitucionales y Artículos de Ley',
        'Transformaciones de la Revolución Industrial',
        'Alianzas de la Guerra Fría y Carrera Espacial',
        'Civilizaciones Antiguas y Rutas Comerciales',
        'Políticas Económicas y Monetarias'
      ] : isZh ? [
        '第二次世界大战：关键战役与战后地缘格局',
        '国家宪法核心条款与公民基本权利保障',
        '工业革命与全球经济社会结构转型',
        '冷战两极对峙格局演变与航天太空竞赛',
        '古代丝绸之路贸易路线与东西方文明互鉴',
        '宏观经济学财政政策与货币调控机制'
      ] : [
        'World War 2: Battles & Geopolitics',
        'Constitutional Rights & Law Articles',
        'Industrial Revolution Transformations',
        'Cold War Alliances & Space Race',
        'Ancient Civilizations & Trade Routes',
        'Economic Policies & Monetary Policy'
      ],
      features: isTa ? ['காலவரிசை வரைபட அமைப்பு', 'அரசியலமைப்பு கட்டுரை அட்டவணை', 'உலகளாவிய காரண-காரிய ஆய்வு'] : isHi ? ['कालानुक्रमिक समयरेखा मानचित्रण', 'संवैधानिक अनुच्छेद सूचकांक', 'कारण और प्रभाव विश्लेषण'] : isAr ? ['رسم التسلسل الزمني للأحداث', 'فهرس المواد الدستورية', 'تحليل الأسباب والنتائج التاريخية'] : isEs ? ['Mapeo cronológico', 'Índice de artículos constitucionales', 'Análisis de causa y efecto'] : isZh ? ['全景历史纪年脉络图谱', '宪法与民法重点法条速查', '全球重大历史动因深度剖析'] : ['Chronological timeline mapping', 'Constitutional article index', 'Global cause-and-effect']
    },
    {
      id: 'exams',
      name: isTa ? 'போட்டித் தேர்வுகள்' : isHi ? 'प्रतियोगी परीक्षाएं' : isAr ? 'الامتحانات التنافسية' : isEs ? 'Exámenes Competitivos' : isZh ? '升学备考与资格认证' : 'Competitive Exams',
      badge: isTa ? 'இலக்கு MCQகள்' : isHi ? 'लक्षित बहुविकल्पीय प्रश्न' : isAr ? 'أسئلة اختيار مركزة' : isEs ? 'Preguntas Tipo Test' : isZh ? '高频考点专项题库' : 'Targeted MCQs',
      icon: <GraduationCap className="w-5 h-5" />,
      color: 'from-violet-500 to-fuchsia-500',
      accentBg: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
      description: isTa ? 'முக்கிய தேசிய மற்றும் சர்வதேச நுழைவுத் தேர்வுகளுக்கான பிரத்யேக வினாத் தொகுப்பு.' : isHi ? 'प्रमुख राष्ट्रीय और अंतर्राष्ट्रीय प्रवेश परीक्षाओं के लिए विशेष प्रश्न पाठ्यक्रम।' : isAr ? 'منهج أسئلة مخصص لاجتياز أهم الامتحانات التنافسية واختبارات القبول.' : isEs ? 'Plan de estudios adaptado para las principales oposiciones y exámenes de admisión.' : isZh ? '深度对标各类升学统考、执业医师资格证及学术竞赛高频大纲考点。' : 'Built-in question syllabus tailored for major national and international entrance exams.',
      popularTopics: isTa ? [
        'UPSC / சிவில் சர்வீசஸ் தேர்வு',
        'NEET / மருத்துவ நுழைவுத் தேர்வு',
        'JEE முதன்மை & மேம்பட்ட இயற்பியல்',
        'USMLE படி 1 உயர் மகசூல் தலைப்புகள்',
        'GRE / GMAT அளவு பகுப்பாய்வு',
        'GATE / பொறியியல் நுழைவுத் தேர்வு'
      ] : isHi ? [
        'UPSC / सिविल सेवा प्रारंभिक परीक्षा',
        'NEET / मेडिकल प्रवेश परीक्षा',
        'JEE मेन और एडवांस भौतिकी',
        'USMLE स्टेप 1 उच्च-उपज वाले विषय',
        'GRE / GMAT मात्रात्मक विश्लेषण',
        'GATE / इंजीनियरिंग प्रवेश परीक्षा'
      ] : isAr ? [
        'اختبارات القبول الطبية والرعاية الصحية',
        'اختبارات الهندسة والعلوم التطبيقية',
        'اختبارات القدرات والتحصيلي الأكاديمي',
        'اختبارات USMLE الطبية الدولية',
        'التحليل الكمي لاختبارات GRE و GMAT',
        'امتحانات التوظيف والخدمة المدنية'
      ] : isEs ? [
        'Exámenes de Admisión a Medicina',
        'Física y Matemáticas para Ingenierías',
        'Oposiciones y Función Pública',
        'Preparación USMLE Step 1',
        'Razonamiento Cuantitativo GRE / GMAT',
        'Pruebas de Acceso a la Universidad'
      ] : isZh ? [
        '国家公务员考试行政能力测验与申论',
        '高考/考研数学与理化综合专项精讲',
        '临床执业医师资格考试核心考点',
        'USMLE Step 1 国际医师资格真题',
        'GRE / GMAT 考研逻辑与定量分析',
        '全国计算机等级考试与软考高频考点'
      ] : [
        'UPSC / Civil Services Prelims',
        'NEET / Medical Entrance Exam',
        'JEE Main & Advanced Physics',
        'USMLE Step 1 High-Yield Topics',
        'GRE / GMAT Quantitative Section',
        'GATE / Engineering Entrance Exam'
      ],
      features: isTa ? ['தேர்வு முறை சார்ந்த கேள்விகள்', 'உடனடி விடை விளக்கங்கள்', 'நேர மேலாண்மை உத்திகள்'] : isHi ? ['परीक्षा पैटर्न के अनुसार प्रश्न', 'त्वरित उत्तर व्याख्या', 'समय प्रबंधन रणनीतियां'] : isAr ? ['نماذج أسئلة تحاكي الامتحانات الحقيقية', 'شروحات فورية للإجابات الصحيحة', 'استراتيجيات إدارة وقت الاختبار'] : isEs ? ['Preguntas basadas en exámenes reales', 'Explicaciones instantáneas', 'Estrategias de tiempo'] : isZh ? ['真题考点分步透彻精讲', '选项易错陷阱规避解析', '考试限时解题应试技巧'] : ['Exam-pattern questions', 'Instant answer rationale', 'Time management strategies']
    }
  ];

  const currentCategory = categories.find((c) => c.id === activeTab) || categories[0];

  return (
    <div className={`relative overflow-hidden rounded-3xl bg-slate-900/90 dark:bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl text-white ${className}`}>
      
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="relative z-10 p-6 sm:p-8 border-b border-slate-800/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{headerBadge}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {headerTitle}
            </h3>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              {headerSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-800/80 border border-slate-700/60 shrink-0 self-start sm:self-center">
            <BookOpenCheck className="w-5 h-5 text-emerald-400" />
            <div className="text-xs">
              <span className="font-bold text-slate-200">{factCheckTitle}</span>
              <span className="block text-slate-400 text-[10px]">{factCheckSubtitle}</span>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                activeTab === cat.id
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-lg shadow-indigo-600/30 scale-[1.02]`
                  : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/40'
              }`}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Category Content */}
      <div className="relative z-10 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
          <div>
            <div className={`inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-[11px] font-semibold mb-2 border ${currentCategory.accentBg}`}>
              <Zap className="w-3 h-3" />
              <span>{currentCategory.badge}</span>
            </div>
            <h4 className="text-xl font-bold text-white">{currentCategory.name}</h4>
            <p className="text-xs text-slate-400 mt-1">{currentCategory.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {currentCategory.features.map((feat, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800/90 border border-slate-700/60 text-slate-300 text-xs font-medium"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{feat}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Popular Topic Pills (Clickable) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {popularHeader}
            </span>
            <span className="text-[11px] text-indigo-400">{clickToTest}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {currentCategory.popularTopics.map((topic, i) => (
              <button
                key={i}
                onClick={() => onSelectTopic && onSelectTopic(topic)}
                className="group p-3 rounded-2xl bg-slate-800/50 hover:bg-indigo-950/50 border border-slate-700/60 hover:border-indigo-500/50 text-left transition-all duration-200 flex items-center justify-between gap-3 cursor-pointer active:scale-[0.98]"
              >
                <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-200 transition-colors line-clamp-1">
                  {topic}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
