import { Exam, MCQQuestion } from '../types/competitive';

export const INITIAL_COMPETITIVE_EXAMS: Exam[] = [
  {
    id: 'upsc-cse',
    name: 'UPSC Civil Services Examination',
    country: 'India',
    category: 'Civil Services & Governance',
    badge: 'Premier National Exam',
    description: 'India\'s premier nationwide competitive examination conducted by the Union Public Service Commission for recruitment to higher Civil Services including IAS, IPS, and IFS.',
    eligibility: 'Graduate degree from a recognized university. Age: 21–32 years.',
    structure: 'Three stages: Preliminary (Objective), Mains (Descriptive, 9 papers), and Personality Test (Interview).',
    duration: 'Prelims: 2 Papers of 2 Hours each. Mains: 3 Hours per paper.',
    scoring: 'Prelims GS Paper 1 (200 marks, cut-off based), CSAT GS Paper 2 (Qualifying 33%). Mains + Interview = 2025 Total Marks.',
    sections: ['Indian Polity & Governance', 'Modern Indian History', 'Geography & Environment', 'Indian Economy', 'General Science & Tech', 'CSAT Aptitude'],
    subjects: [
      {
        id: 'polity',
        name: 'Indian Polity & Governance',
        topics: [
          {
            id: 'preamble-fundamental-rights',
            name: 'Preamble & Fundamental Rights (Articles 12-35)',
            overview: 'Fundamental Rights guaranteed under Part III of the Constitution form the bedrock of Indian Democracy, safeguarding individual liberties against state power.',
            importantPoints: [
              'Part III consists of 6 categories of Fundamental Rights.',
              'Article 21 (Right to Life & Liberty) has been expanded by Supreme Court to include right to privacy, clean environment, and education.',
              'Article 32 is called the "Heart and Soul" of the Constitution by Dr. B.R. Ambedkar.',
              'Fundamental Rights can be suspended during National Emergency under Article 359, except Articles 20 and 21.',
            ],
            definitions: [
              { term: 'Habeas Corpus', definition: 'A court order commanding a person or authority holding a prisoner to produce them in court to verify legal detention.' },
              { term: 'Basic Structure Doctrine', definition: 'Established in Kesavananda Bharati case (1973), stating Parliament cannot alter core tenets of the Constitution.' },
            ],
            formulas: [
              { name: 'Writ Jurisdiction', formula: 'Article 32 (Supreme Court) & Article 226 (High Court)', explanation: 'High Courts have wider writ power covering legal rights beyond fundamental rights.' },
            ],
            commonMistakes: [
              'Confusing Fundamental Rights with Fundamental Duties (Part IV-A).',
              'Assuming Right to Property is still a Fundamental Right (It became a Legal Right under Art 300A via 44th Amendment).',
            ],
            examTips: [
              'Memorize key Supreme Court landmark judgments (Minerva Mills, Maneka Gandhi, K.S. Puttaswamy).',
              'Analyze Articles 14, 19, and 21 together as the Golden Triangle of constitutional law.',
            ],
            quickRevision: [
              'Art 14-18: Equality',
              'Art 19-22: Freedom',
              'Art 23-24: Against Exploitation',
              'Art 25-28: Freedom of Religion',
              'Art 29-30: Cultural & Educational Rights',
              'Art 32: Constitutional Remedies',
            ],
            summary: 'Part III balances individual rights with public interest. Essential for UPSC Prelims and GS Paper 2.',
            diagramType: 'concept_map',
          },
          {
            id: 'parliamentary-system',
            name: 'Parliamentary System & Budgetary Process',
            overview: 'Examines the bicameral structure of Indian Parliament (Lok Sabha and Rajya Sabha), legislative procedure, and financial management.',
            importantPoints: [
              'Money Bills can only be introduced in Lok Sabha with prior recommendation of President (Art 110).',
              'Rajya Sabha has special powers under Art 249 (State List legislation) and Art 312 (All India Services).',
            ],
            definitions: [
              { term: 'Money Bill', definition: 'A bill containing exclusively provisions related to taxation, borrowing, or Consolidated Fund of India as certified by Lok Sabha Speaker.' },
            ],
            commonMistakes: ['Thinking Rajya Sabha can reject a Money Bill (It can only delay it by 14 days).'],
            examTips: ['Master the difference between Adjournment, Prorogation, and Dissolution.'],
            quickRevision: ['Art 108: Joint Sitting', 'Art 110: Money Bill', 'Art 112: Annual Financial Statement (Budget)'],
            summary: 'Core legislative mechanics for governance and policy analysis.',
            diagramType: 'flowchart',
          },
        ],
      },
      {
        id: 'economy',
        name: 'Indian Economy & Public Finance',
        topics: [
          {
            id: 'monetary-policy-rbi',
            name: 'Monetary Policy & Reserve Bank of India (RBI)',
            overview: 'Monetary policy tools, Repo Rate, Reverse Repo Rate, CRR, SLR, and inflation targeting framework (MPC).',
            importantPoints: [
              'Monetary Policy Committee (MPC) has 6 members and targets CPI inflation at 4% ± 2%.',
              'Repo Rate is the interest rate at which RBI lends short-term money to commercial banks against government securities.',
            ],
            definitions: [
              { term: 'Cash Reserve Ratio (CRR)', definition: 'Percentage of Net Demand and Time Liabilities (NDTL) banks must keep with RBI in cash form.' },
            ],
            formulas: [
              { name: 'Money Multiplier', formula: 'Money Multiplier = 1 / Reserve Ratio', explanation: 'Determines expansion of bank credit.' },
            ],
            commonMistakes: ['Confusing CRR (kept in cash with RBI) with SLR (kept in liquid assets like gold/govt bonds with banks themselves).'],
            examTips: ['Track monthly RBI MPC announcements for inflation and interest rate policy.'],
            quickRevision: ['Repo Rate: RBI -> Banks', 'Reverse Repo: Banks -> RBI', 'CRR: Cash at RBI', 'SLR: Liquid assets at Bank'],
            summary: 'High-frequency area in UPSC Prelims Economics.',
            diagramType: 'concept_map',
          }
        ]
      }
    ],
  },
  {
    id: 'jee-advanced',
    name: 'JEE Advanced',
    country: 'India',
    category: 'Engineering & Technology',
    badge: 'Top Tier Engineering',
    description: 'Premier national entrance exam conducted by top IITs for admission to undergraduate engineering programs across all Indian Institutes of Technology.',
    eligibility: 'Must qualify in top 2.5 lakh candidates in JEE Main and pass Class 12 Science stream.',
    structure: 'Two mandatory papers (Paper 1 & Paper 2) conducted on the same day, testing Physics, Chemistry, and Mathematics.',
    duration: '3 Hours per paper (Total 6 Hours).',
    scoring: 'Varies annually. Partial marking, single-choice, multiple-choice, numerical response, and matrix match.',
    sections: ['Physics (Mechanics, Electromagnetism, Modern Physics)', 'Chemistry (Physical, Organic, Inorganic)', 'Mathematics (Calculus, Algebra, Vectors, Geometry)'],
    subjects: [
      {
        id: 'jee-physics',
        name: 'Physics',
        topics: [
          {
            id: 'rotational-dynamics',
            name: 'Rotational Dynamics & Rigid Body Mechanics',
            overview: 'Study of moment of inertia, torque, angular momentum conservation, and rolling motion of rigid bodies.',
            importantPoints: [
              'Parallel Axis Theorem: I = I_cm + Md^2.',
              'Perpendicular Axis Theorem: I_z = I_x + I_y (valid only for laminar 2D objects).',
              'Pure rolling condition on stationary surface: v_cm = R * ω and a_cm = R * α.',
            ],
            definitions: [
              { term: 'Moment of Inertia', definition: 'Quantitative measure of rotational inertia of a body about a chosen axis.' },
              { term: 'Torque', definition: 'Rotational analog of linear force, τ = r × F.' },
            ],
            formulas: [
              { name: 'Angular Momentum', formula: 'L = I * ω  (or L = r × p for point particle)', explanation: 'Conserved when net external torque = 0.' },
              { name: 'Rotational Kinetic Energy', formula: 'K_rot = 1/2 * I * ω^2', explanation: 'Total KE of rolling body = 1/2 M v^2 + 1/2 I_cm ω^2.' },
            ],
            commonMistakes: [
              'Applying Perpendicular Axis Theorem to 3D solid objects like spheres or cylinders.',
              'Assuming friction always opposes pure rolling motion.',
            ],
            examTips: [
              'Draw instantaneous center of rotation (ICR) to simplify complex rolling motion problems.',
              'Check energy conservation before applying force equations in non-conservative setups.',
            ],
            quickRevision: ['τ = I * α', 'L = r × p', 'Pure rolling: v = Rω', 'Work done W = ∫ τ dθ'],
            summary: 'High-weightage topic in JEE Advanced Physics requiring strong vector and calculus fundamentals.',
            diagramType: 'comparison',
          },
        ],
      },
      {
        id: 'jee-chemistry',
        name: 'Chemistry (Physical, Organic, Inorganic)',
        topics: [
          {
            id: 'organic-reaction-mechanisms',
            name: 'Organic Reaction Mechanisms (SN1, SN2, E1, E2)',
            overview: 'Nucleophilic substitution and elimination reactions, carbocation stability, steric hindrance, and stereochemistry.',
            importantPoints: [
              'SN1 proceeds via carbocation intermediate (racemization); SN2 proceeds via concerted transition state (inversion of configuration).',
              'Polar protic solvents favor SN1; Polar aprotic solvents favor SN2.',
            ],
            definitions: [
              { term: 'Nucleophile', definition: 'Electron-rich chemical species that donates an electron pair to an electrophile.' },
            ],
            formulas: [
              { name: 'SN2 Rate Law', formula: 'Rate = k [Substrate] [Nucleophile]', explanation: 'Second-order bimolecular kinetics.' },
            ],
            commonMistakes: ['Forgetting carbocation rearrangements (1,2-hydride or methyl shifts) in SN1 reactions.'],
            examTips: ['Check solvent type (DMSO, DMF = SN2; H2O, EtOH = SN1) first.'],
            quickRevision: ['SN1: 3° > 2° > 1° (Carbocation)', 'SN2: 1° > 2° > 3° (Steric hindrance)'],
            summary: 'Fundamental core of JEE Organic Chemistry.',
            diagramType: 'flowchart',
          }
        ]
      },
      {
        id: 'jee-math',
        name: 'Mathematics (Calculus, Algebra, Geometry)',
        topics: [
          {
            id: 'definite-integrals-area',
            name: 'Definite Integrals & Bounded Area',
            overview: 'Properties of definite integrals, Leibniz rule for differentiation under integral sign, and area between curves.',
            importantPoints: [
              'King\'s Property: ∫_a^b f(x)dx = ∫_a^b f(a+b-x)dx.',
              'Leibniz Rule: d/dx [∫_{g(x)}^{h(x)} f(t)dt] = f(h(x))h\'(x) - f(g(x))g\'(x).',
            ],
            definitions: [
              { term: 'Bounded Area', definition: 'Integral Area = ∫_a^b |f(x) - g(x)| dx.' },
            ],
            formulas: [
              { name: 'King\'s Property', formula: '∫_0^a f(x)dx = ∫_0^a f(a-x)dx', explanation: 'Simplifies trigonometric fraction integrals.' },
            ],
            commonMistakes: ['Neglecting absolute value when area falls below x-axis.'],
            examTips: ['Apply King\'s property first when integral integrand contains sin(x)/(sin x + cos x).'],
            quickRevision: ['∫_-a^a f(x)dx = 0 if f is odd', 'Leibniz rule for differentiation'],
            summary: 'Guaranteed 2-3 questions in every JEE Advanced math paper.',
            diagramType: 'concept_map',
          }
        ]
      }
    ],
  },
  {
    id: 'neet-ug',
    name: 'NEET-UG',
    country: 'India',
    category: 'Medicine & Healthcare',
    badge: 'National Medical Test',
    description: 'National Eligibility cum Entrance Test for admission to MBBS, BDS, and allied healthcare degrees across India.',
    eligibility: 'Class 12 Physics, Chemistry, Biology graduates.',
    structure: '180 multiple-choice questions (720 marks): Biology (90), Physics (45), Chemistry (45).',
    duration: '3 Hours 20 Minutes.',
    scoring: '+4 for correct, -1 for incorrect.',
    sections: ['Biology (Botany & Zoology)', 'Physics', 'Chemistry'],
    subjects: [
      {
        id: 'biology',
        name: 'Biology (Botany & Zoology)',
        topics: [
          {
            id: 'molecular-basis-inheritance',
            name: 'Molecular Basis of Inheritance (DNA & Replication)',
            overview: 'Structure of DNA double helix, semi-conservative replication mechanism (Meselson-Stahl), transcription, and translation.',
            importantPoints: [
              'DNA replication is semi-conservative and occurs in 5\' to 3\' direction.',
              'Leading strand is continuous; Lagging strand produces Okazaki fragments joined by DNA Ligase.',
              'Central Dogma: DNA -> RNA (Transcription) -> Protein (Translation).',
            ],
            definitions: [
              { term: 'Okazaki Fragments', definition: 'Short synthetic DNA fragments formed on lagging template strand during replication.' },
            ],
            formulas: [
              { name: 'Chargaff\'s Rule', formula: '[A] = [T] and [G] = [C]; ([A]+[G])/([T]+[C]) = 1', explanation: 'Applies to double-stranded DNA.' },
            ],
            commonMistakes: [
              'Confusing RNA Polymerase I, II, and III functions in eukaryotic transcription.',
            ],
            examTips: ['NCERT textbook lines are tested verbatim in NEET Biology; review diagrams thoroughly.'],
            quickRevision: ['A=T (2 H-bonds)', 'G≡C (3 H-bonds)', 'Helicase unzips', 'DNA Polymerase synthesizes 5\'->3\''],
            summary: 'Highest weightage chapter in NEET Biology.',
            diagramType: 'process',
          },
        ],
      },
      {
        id: 'neet-physics',
        name: 'Physics',
        topics: [
          {
            id: 'ray-optics-instruments',
            name: 'Ray Optics & Optical Instruments',
            overview: 'Refraction, Total Internal Reflection (TIR), lenses, prisms, and compound microscope / telescope magnification.',
            importantPoints: [
              'Snell\'s Law: n1 sin θ1 = n2 sin θ2.',
              'Critical Angle for TIR: sin θc = n2 / n1 (where n1 > n2).',
            ],
            definitions: [
              { term: 'Total Internal Reflection', definition: 'Complete reflection of a light ray back into a denser medium when angle of incidence exceeds critical angle.' },
            ],
            formulas: [
              { name: 'Lens Maker\'s Formula', formula: '1/f = (n - 1) [1/R1 - 1/R2]', explanation: 'Relates focal length f to radii of curvature.' },
            ],
            commonMistakes: ['Forgetting Cartesian sign conventions (+ for real/virtual distances).'],
            examTips: ['Memorize optical instrument formula for compound microscope M = -(L/fo)*(D/fe).'],
            quickRevision: ['1/f = 1/v - 1/u (Lens)', 'Power P = 1/f (diopters)'],
            summary: 'High scoring physics section in NEET.',
            diagramType: 'flowchart',
          }
        ]
      },
      {
        id: 'neet-chemistry',
        name: 'Chemistry',
        topics: [
          {
            id: 'chemical-bonding-geometry',
            name: 'Chemical Bonding & Molecular Geometry (VSEPR)',
            overview: 'VSEPR theory, hybridization (sp, sp2, sp3, sp3d, sp3d2), dipole moments, and molecular orbital theory (MOT).',
            importantPoints: [
              'Bond order = 1/2 [Nb - Na]. Higher bond order implies stronger, shorter bond.',
              'Lone pair-lone pair repulsion > lone pair-bond pair > bond pair-bond pair.',
            ],
            definitions: [
              { term: 'Hybridization', definition: 'Mixing of atomic orbitals of slightly different energies to form new degenerate hybrid orbitals.' },
            ],
            commonMistakes: ['Assuming H2O is linear because it has 2 bonds (It is bent/V-shaped due to 2 lone pairs on Oxygen).'],
            examTips: ['Count total valence electron pairs to quickly deduce steric number and hybridization.'],
            quickRevision: ['sp3: Tetrahedral (109.5°)', 'sp2: Trigonal Planar (120°)', 'sp: Linear (180°)'],
            summary: 'Essential chemistry foundation tested in NEET every year.',
            diagramType: 'concept_map',
          }
        ]
      }
    ],
  },
  {
    id: 'mcat',
    name: 'MCAT (Medical College Admission Test)',
    country: 'USA & Canada',
    category: 'Medicine',
    badge: 'Premier Medical Exam',
    description: 'Standardized computer-based examination for prospective medical students in the United States and Canada testing scientific concepts and critical analysis.',
    eligibility: 'Pre-medical undergraduate students.',
    structure: 'Four sections: Chemical & Physical Foundations, CARS, Biological & Biochemical Foundations, Psychological & Social Behavior.',
    duration: '7 Hours and 30 Minutes.',
    scoring: 'Score range 472 to 528 (Percentile-based).',
    sections: ['Biological & Biochemical Foundations', 'Chemical & Physical Foundations', 'CARS (Critical Analysis & Reasoning)', 'Psychological & Social Behavior'],
    subjects: [
      {
        id: 'biochem',
        name: 'Biological & Biochemical Foundations',
        topics: [
          {
            id: 'enzyme-kinetics',
            name: 'Enzyme Kinetics & Michaelis-Menten Equation',
            overview: 'Quantitative study of enzymatic reaction velocity, substrate binding affinity, and competitive/non-competitive inhibition modes.',
            importantPoints: [
              'Vmax is maximum velocity reached when enzyme is fully saturated.',
              'Km (Michaelis Constant) is substrate concentration at which reaction rate is half of Vmax.',
              'Competitive inhibitors increase Km without changing Vmax.',
              'Non-competitive inhibitors decrease Vmax without changing Km.',
            ],
            definitions: [
              { term: 'Km (Michaelis constant)', definition: 'Substrate concentration at 1/2 Vmax; inverse measure of enzyme-substrate affinity.' },
              { term: 'Lineweaver-Burk Plot', definition: 'Double-reciprocal plot of 1/v vs 1/[S] used to determine Vmax and Km.' },
            ],
            formulas: [
              { name: 'Michaelis-Menten Equation', formula: 'v = (Vmax * [S]) / (Km + [S])', explanation: 'Relates initial rate v to substrate concentration [S].' },
            ],
            commonMistakes: [
              'Confusing uncompetitive inhibitors with non-competitive inhibitors on Lineweaver-Burk plots.',
            ],
            examTips: ['Memorize line shifts on double-reciprocal graphs for all 4 inhibition types.'],
            quickRevision: ['Competitive: Km up, Vmax constant', 'Non-competitive: Km constant, Vmax down', 'Uncompetitive: both down'],
            summary: 'High-yield biochemistry topic featured extensively in MCAT passage-based questions.',
            diagramType: 'comparison',
          },
        ],
      },
      {
        id: 'mcat-cars',
        name: 'CARS (Critical Analysis & Reasoning Skills)',
        topics: [
          {
            id: 'cars-passage-reasoning',
            name: 'Passage Argumentation & Author Stance Inference',
            overview: 'Analyzing complex humanities and social science texts to evaluate implicit assumptions, author tone, and counter-arguments.',
            importantPoints: [
              'Distinguish author opinion from quotes/arguments of outside sources mentioned in passage.',
              'Identify central thesis statement before answering sub-questions.',
            ],
            definitions: [
              { term: 'Main Idea', definition: 'The overarching argument that ties together all paragraphs in a CARS passage.' },
            ],
            commonMistakes: ['Selecting answers with extreme language ("always", "never") unless explicitly supported by text.'],
            examTips: ['Highlight transition words and author attitude indicators on the first read-through.'],
            quickRevision: ['Read passage -> summarize main thesis -> eliminate extreme answer choices.'],
            summary: 'CARS section is non-science based and determines top MCAT score percentiles.',
            diagramType: 'flowchart',
          }
        ]
      }
    ],
  },
  {
    id: 'gaokao',
    name: 'Gaokao (National College Entrance Examination)',
    country: 'China',
    category: 'Higher Education Entrance',
    badge: 'World\'s Toughest Exam',
    description: 'The National Higher Education Entrance Examination taken annually by over 12 million high school students in China.',
    eligibility: 'Chinese high school graduates.',
    structure: 'Chinese Literature, Mathematics, Foreign Language (usually English), plus chosen elective tracks (Physics/History stream).',
    duration: '2 to 3 days (Total ~9 Hours).',
    scoring: 'Max score 750 points.',
    sections: ['Higher Mathematics', 'Chinese Language & Essay', 'Foreign Language (English)', 'Comprehensive Science / Humanities'],
    subjects: [
      {
        id: 'gaokao-math',
        name: 'Higher Mathematics',
        topics: [
          {
            id: 'calculus-functions',
            name: 'Calculus of Functions & Derivatives',
            overview: 'Advanced mathematical analysis, extreme values of functions, and real-world optimization problems.',
            importantPoints: [
              'Derivatives evaluate instantaneous rates of change and curve monotonicity.',
              'Taylor expansion provides polynomial approximations near analytical points.',
            ],
            definitions: [
              { term: 'Monotonicity', definition: 'The property of a function remaining entirely non-increasing or non-decreasing.' },
            ],
            formulas: [
              { name: 'Derivative Definition', formula: 'f\'(x) = lim_{h->0} [f(x+h) - f(x)] / h', explanation: 'Fundamental building block of calculus.' },
            ],
            commonMistakes: ['Forgetting domain restrictions when finding extreme values.'],
            examTips: ['Practice analytical rigorous proof techniques standard in Gaokao Math.'],
            quickRevision: ['f\'(x) > 0 implies increasing', 'f\'\'(x) < 0 implies concave down'],
            summary: 'Cornerstone of Gaokao mathematics determining tier-1 university admissions.',
            diagramType: 'flowchart',
          },
        ],
      },
    ],
  },
  {
    id: 'suneung-csat',
    name: 'CSAT / Suneung',
    country: 'South Korea',
    category: 'Higher Education Entrance',
    badge: 'National Aptitude Test',
    description: 'South Korea\'s standard College Scholastic Ability Test that determines entry into top universities (SKY: Seoul National, Korea, Yonsei).',
    eligibility: 'High school seniors and graduates.',
    structure: 'Korean Language, Mathematics, English, Korean History (Mandatory), Subordinate Inquiry subjects (Science/Social).',
    duration: '8 Hours (Single intense day).',
    scoring: 'Standard score, percentile, and rank grade (1-9 stanine levels).',
    sections: ['Korean Language & Literature', 'Mathematics', 'English Language & Logic', 'Korean History', 'Inquiry Sciences'],
    subjects: [
      {
        id: 'suneung-english',
        name: 'English Language & Logic',
        topics: [
          {
            id: 'blank-inference',
            name: 'Blank Inference & Logical Flow',
            overview: 'Mastering high-difficulty paragraph completion questions requiring strict structural logical deduction.',
            importantPoints: [
              'Identify logical connectors (however, therefore, conversely, moreover).',
              'Trace argument progression from thesis statement to supporting premises.',
            ],
            definitions: [
              { term: 'Cohesion', definition: 'Grammatical and lexical linking within a text that holds it together.' },
            ],
            commonMistakes: ['Choosing answers that are factually true but logically irrelevant to paragraph context.'],
            examTips: ['Read sentence immediately preceding and following the blank for precise context clues.'],
            quickRevision: ['Identify premise -> trace contrast/continuation -> deduce missing argument.'],
            summary: 'The ultimate differentiator in Suneung English determining Grade 1 stanine qualification.',
            diagramType: 'flowchart',
          },
        ],
      },
    ],
  },
  {
    id: 'gre-general',
    name: 'GRE General Test',
    country: 'Global (USA/International)',
    category: 'Graduate Studies',
    badge: 'Graduate Admissions Standard',
    description: 'The world\'s most widely accepted admission test for master\'s, specialized master\'s, MBA, and doctoral programs.',
    eligibility: 'Prospective graduate school applicants.',
    structure: 'Analytical Writing, Verbal Reasoning, Quantitative Reasoning.',
    duration: '1 Hour 58 Minutes.',
    scoring: 'Verbal (130-170), Quant (130-170), Analytical Writing (0-6).',
    sections: ['Quantitative Reasoning (Algebra, Data, Geometry)', 'Verbal Reasoning (Vocabulary, Text Completion)', 'Analytical Writing'],
    subjects: [
      {
        id: 'gre-quant',
        name: 'Quantitative Reasoning',
        topics: [
          {
            id: 'data-interpretation-stats',
            name: 'Data Interpretation & Normal Distribution',
            overview: 'Statistical analysis of charts, graphs, standard deviation, and probability distributions.',
            importantPoints: [
              '68-95-99.7 Rule: 68% data within 1 standard deviation, 95% within 2 SD, 99.7% within 3 SD.',
            ],
            definitions: [
              { term: 'Standard Deviation', definition: 'Measure of the amount of variation or dispersion of a set of values.' },
            ],
            formulas: [
              { name: 'Z-score', formula: 'z = (X - μ) / σ', explanation: 'Number of standard deviations X lies from mean μ.' },
            ],
            commonMistakes: ['Confusing median with mean when distribution is skewed.'],
            examTips: ['Estimate calculations visually before doing exact arithmetic to save precious time.'],
            quickRevision: ['Mean = Sum/Count', 'Median = Middle value', 'Mode = Most frequent'],
            summary: 'Key area for securing a top 165+ score in GRE Quantitative reasoning.',
            diagramType: 'concept_map',
          },
        ],
      },
    ],
  },
  {
    id: 'gmat-focus',
    name: 'GMAT Focus Edition',
    country: 'Global',
    category: 'Business & Management',
    badge: 'Top MBA Entrance',
    description: 'Premier business school entrance examination measuring critical reasoning, data insights, and quantitative problem-solving.',
    eligibility: 'MBA & Business Master\'s applicants.',
    structure: 'Quantitative Reasoning, Verbal Reasoning, Data Insights.',
    duration: '2 Hours 15 Minutes.',
    scoring: 'Score range 205 to 805.',
    sections: ['Quantitative Reasoning', 'Verbal Reasoning', 'Data Insights'],
    subjects: [
      {
        id: 'gmat-di',
        name: 'Data Insights & Quantitative Logic',
        topics: [
          {
            id: 'data-sufficiency',
            name: 'Data Sufficiency Logic & Critical Reasoning',
            overview: 'Determining whether given statements contain sufficient information to answer a mathematical or logical query.',
            importantPoints: [
              'Test Statement (1) alone, then Statement (2) alone.',
              'Only combine Statement (1) and (2) if neither is sufficient individually.',
            ],
            definitions: [
              { term: 'Sufficiency', definition: 'Determining if statement guarantees ONE unique answer without needing to compute the actual value.' },
            ],
            commonMistakes: ['Carrying over assumptions from Statement (1) when evaluating Statement (2).'],
            examTips: ['Use AD / BCE elimination mnemonic method.'],
            quickRevision: ['A: 1 only', 'B: 2 only', 'C: Both together', 'D: Each alone', 'E: Neither sufficient'],
            summary: 'Signature question type distinguishing top GMAT Focus scores.',
            diagramType: 'flowchart',
          },
        ],
      },
    ],
  },
  {
    id: 'lsat',
    name: 'LSAT (Law School Admission Test)',
    country: 'USA, Canada, Australia',
    category: 'Law',
    badge: 'Juris Doctor Standard',
    description: 'Standardized exam assessing reading comprehension, analytical reasoning, and logical deduction for law school admissions.',
    eligibility: 'Prospective law school applicants.',
    structure: 'Logical Reasoning (2 sections), Reading Comprehension (1 section), plus ungraded Writing sample.',
    duration: 'approx. 2 Hours 30 Minutes.',
    scoring: 'Scale of 120 to 180.',
    sections: ['Logical Reasoning 1', 'Logical Reasoning 2', 'Reading Comprehension'],
    subjects: [
      {
        id: 'lsat-logic',
        name: 'Logical Reasoning',
        topics: [
          {
            id: 'conditional-logic-flaws',
            name: 'Conditional Reasoning & Logical Flaws',
            overview: 'Identifying formal logical fallacies such as mistaking necessary for sufficient conditions and cause-and-effect flaws.',
            importantPoints: [
              'Sufficient condition guarantees result; Necessary condition is required for result.',
              'Contrapositive is logically equivalent to original conditional statement.',
            ],
            definitions: [
              { term: 'Mistaken Reversal', definition: 'Assuming that if conclusion holds, the sufficient condition must have occurred (If A->B, assuming B->A).' },
            ],
            formulas: [
              { name: 'Contrapositive Rule', formula: 'If A -> B, then NOT B -> NOT A', explanation: 'Always valid.' },
            ],
            commonMistakes: ['Confusing "only if" (necessary condition) with "if" (sufficient condition).'],
            examTips: ['Diagram conditional statements rapidly during the exam using shorthand arrows.'],
            quickRevision: ['A -> B ≡ ~B -> ~A', 'Avoid Assuming Cause from Correlation'],
            summary: 'Essential skill for achieving a 170+ LSAT score.',
            diagramType: 'concept_map',
          },
        ],
      },
    ],
  },
];

export const INITIAL_PRACTICE_QUESTIONS: MCQQuestion[] = [
  // UPSC Questions
  {
    id: 'q-upsc-1',
    examId: 'upsc-cse',
    topicId: 'preamble-fundamental-rights',
    topicName: 'Preamble & Fundamental Rights (Articles 12-35)',
    question: 'Which of the following Fundamental Rights cannot be suspended even during a proclamation of National Emergency under Article 352 of the Indian Constitution?',
    options: [
      'Article 14 and Article 19',
      'Article 19 and Article 20',
      'Article 20 and Article 21',
      'Article 21 and Article 32',
    ],
    correctAnswer: 2,
    explanation: 'By the 44th Constitutional Amendment Act of 1978, the right to protection in respect of conviction for offenses (Article 20) and the right to life and personal liberty (Article 21) cannot be suspended even during a National Emergency under Article 359.',
    difficulty: 'medium',
    isSourceBased: true,
    sourceTag: 'UPSC Civil Services Prelims 2021',
  },
  {
    id: 'q-upsc-2',
    examId: 'upsc-cse',
    topicId: 'monetary-policy-rbi',
    topicName: 'Monetary Policy & Reserve Bank of India (RBI)',
    question: 'If the Reserve Bank of India (RBI) decides to adopt an expansionary monetary policy, which of the following actions would it NOT take?',
    options: [
      'Cut the Repo Rate and Statutory Liquidity Ratio (SLR)',
      'Increase the Cash Reserve Ratio (CRR)',
      'Conduct Open Market Operations to purchase government bonds',
      'Lower the Bank Rate',
    ],
    correctAnswer: 1,
    explanation: 'Increasing the Cash Reserve Ratio (CRR) locks up more bank funds with RBI, contracting liquidity (tight monetary policy). To adopt an expansionary policy, RBI lowers CRR, Repo Rate, and SLR.',
    difficulty: 'medium',
    isSourceBased: true,
    sourceTag: 'UPSC Civil Services Prelims 2020',
  },

  // JEE Advanced Questions
  {
    id: 'q-jee-1',
    examId: 'jee-advanced',
    topicId: 'rotational-dynamics',
    topicName: 'Rotational Dynamics & Rigid Body Mechanics',
    question: 'A uniform solid sphere of mass M and radius R rolls purely without slipping down an inclined plane of angle θ. What is the acceleration of the center of mass of the sphere?',
    options: [
      '(5/7) g sin θ',
      '(2/5) g sin θ',
      '(3/5) g sin θ',
      '(1/2) g sin θ',
    ],
    correctAnswer: 0,
    explanation: 'For pure rolling on an incline: a_cm = (g sin θ) / (1 + I_cm / (M R^2)). For a solid sphere, I_cm = (2/5) M R^2. Thus, a_cm = (g sin θ) / (1 + 2/5) = (5/7) g sin θ.',
    difficulty: 'hard',
    isSourceBased: true,
    sourceTag: 'JEE Advanced Physics 2020',
  },
  {
    id: 'q-jee-2',
    examId: 'jee-advanced',
    topicId: 'organic-reaction-mechanisms',
    topicName: 'Organic Reaction Mechanisms (SN1, SN2, E1, E2)',
    question: 'Which of the following reaction conditions will favor an SN2 substitution mechanism over an SN1 mechanism?',
    options: [
      'Primary alkyl halide in polar aprotic solvent (e.g. Acetone/DMSO) with strong nucleophile',
      'Tertiary alkyl halide in polar protic solvent (e.g. Water/Ethanol)',
      'Tertiary carbocation intermediate with weak nucleophile',
      'High temperature elimination with bulky hindered base',
    ],
    correctAnswer: 0,
    explanation: 'SN2 reactions proceed via a single concerted step with unhindered primary alkyl halides and strong nucleophiles in polar aprotic solvents like DMSO or Acetone.',
    difficulty: 'medium',
    isSourceBased: true,
    sourceTag: 'JEE Advanced Chemistry 2022',
  },

  // NEET-UG Questions
  {
    id: 'q-neet-1',
    examId: 'neet-ug',
    topicId: 'molecular-basis-inheritance',
    topicName: 'Molecular Basis of Inheritance (DNA & Replication)',
    question: 'If a double-stranded DNA sample contains 30% Cytosine, what percentage of Adenine will be present in this sample according to Chargaff\'s rules?',
    options: ['20%', '30%', '40%', '60%'],
    correctAnswer: 0,
    explanation: 'According to Chargaff\'s rules, [C] = [G] and [A] = [T]. If Cytosine = 30%, Guanine = 30% (Total C+G = 60%). Remaining 40% consists of Adenine + Thymine. Therefore, Adenine = 40% / 2 = 20%.',
    difficulty: 'easy',
    isSourceBased: true,
    sourceTag: 'NEET-UG Biology 2022',
  },
  {
    id: 'q-neet-2',
    examId: 'neet-ug',
    topicId: 'ray-optics-instruments',
    topicName: 'Ray Optics & Optical Instruments',
    question: 'A convex lens of focal length 20 cm is placed in contact with a concave lens of focal length 25 cm. What is the power of the combined lens system?',
    options: ['+1.0 Diopters', '-1.0 Diopters', '+5.0 Diopters', '-0.5 Diopters'],
    correctAnswer: 0,
    explanation: 'P1 = 1/f1 = 1/0.20m = +5.0 D. P2 = 1/f2 = 1/(-0.25m) = -4.0 D. Combined Power P = P1 + P2 = +5.0 D - 4.0 D = +1.0 Diopters.',
    difficulty: 'medium',
    isSourceBased: true,
    sourceTag: 'NEET-UG Physics 2021',
  },

  // MCAT Questions
  {
    id: 'q-mcat-1',
    examId: 'mcat',
    topicId: 'enzyme-kinetics',
    topicName: 'Enzyme Kinetics & Michaelis-Menten Equation',
    question: 'In the presence of a competitive inhibitor, what changes occur to the Km and Vmax values of an enzymatic reaction?',
    options: [
      'Km increases, Vmax remains unchanged',
      'Km decreases, Vmax decreases',
      'Km remains unchanged, Vmax decreases',
      'Km increases, Vmax increases',
    ],
    correctAnswer: 0,
    explanation: 'Competitive inhibitors compete directly with the substrate for the active site of the enzyme. This reduces the apparent affinity of the enzyme for the substrate (increasing Km), but at very high substrate concentrations, the inhibitor can be outcompeted, reaching the maximum velocity Vmax unchanged.',
    difficulty: 'medium',
    isSourceBased: true,
    sourceTag: 'MCAT Biochemistry Official Sample',
  },

  // LSAT Questions
  {
    id: 'q-lsat-1',
    examId: 'lsat',
    topicId: 'conditional-logic-flaws',
    topicName: 'Conditional Reasoning & Logical Flaws',
    question: 'Consider the statement: "If a legal contract is signed under duress, it is unenforceable in court." Which of the following is the valid contrapositive of this statement?',
    options: [
      'If a contract is unenforceable in court, it was signed under duress.',
      'If a contract is enforceable in court, it was not signed under duress.',
      'If a contract is not signed under duress, it is enforceable in court.',
      'A contract is enforceable only if it was signed voluntarily.',
    ],
    correctAnswer: 1,
    explanation: 'The contrapositive of "If A then B" is "If NOT B then NOT A". Here, A = "signed under duress" and B = "unenforceable". Thus, the contrapositive is "If NOT B (enforceable), then NOT A (not signed under duress)".',
    difficulty: 'medium',
    isSourceBased: true,
    sourceTag: 'LSAT Logical Reasoning Official',
  },
];
