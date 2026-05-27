// Local Knowledge Base for Resume Analyzer
const JOB_ROLES_DB = {
  "software_engineer": {
    title: "Software Engineer",
    category: "Engineering",
    skills: {
      technical: ["Python", "JavaScript", "Java", "C++", "Git", "SQL", "Docker", "REST APIs", "Data Structures", "Algorithms", "React", "Node.js"],
      soft: ["Problem Solving", "Communication", "Teamwork", "Agile Methodology", "Time Management", "Adaptability"],
      domain: ["Software Development Life Cycle (SDLC)", "Object-Oriented Programming (OOP)", "System Design", "Cloud Computing"]
    },
    keywords: ["scalability", "latency", "microservices", "unit testing", "CI/CD", "refactoring", "code review", "optimisation", "debugging", "version control"],
    careerPaths: [
      { step: 1, title: "Junior Software Engineer", time: "0-2 years", desc: "Focuses on writing clean code, fixing bugs, and learning the codebase under mentorship." },
      { step: 2, title: "Mid-Level Software Engineer", time: "2-5 years", desc: "Owns features, designs smaller components, reviews code, and works independently." },
      { step: 3, title: "Senior Software Engineer", time: "5-8 years", desc: "Architects complex systems, mentors juniors, guides technical decisions, and designs for scalability." },
      { step: 4, title: "Staff Engineer / Tech Lead", time: "8+ years", desc: "Leads technical strategy across multiple teams, aligns engineering with business goals, or manages people as an Engineering Manager." }
    ],
    commonMissingSkills: ["Docker", "System Design", "CI/CD", "Cloud Computing (AWS/GCP)", "Unit Testing"],
    customTips: [
      {
        category: "Content Optimization",
        tip: "Quantify your engineering achievements. Instead of writing 'Worked on backend services', write 'Redesigned backend APIs using Node.js, reducing latency by 35% and supporting 10k+ concurrent requests.'",
        before: "Responsible for writing clean code and fixing bugs in the React web application.",
        after: "Optimized React bundle sizes and implemented lazy loading, reducing initial page load time by 1.8 seconds and boosting lighthouse SEO score to 98%."
      },
      {
        category: "ATS Keyword Optimization",
        tip: "Ensure you mention system design and development methodologies like Agile or Scrum. Mentioning version control tools (like Git) and specific testing libraries (Jest, PyTest) boosts ATS visibility.",
        before: "Tested code before pushing to production.",
        after: "Established CI/CD pipelines using GitHub Actions and wrote unit tests (Jest, PyTest) increasing code coverage from 60% to 85%."
      }
    ]
  },
  "data_scientist": {
    title: "Data Scientist",
    category: "Data & AI",
    skills: {
      technical: ["Python", "R", "SQL", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Pandas", "Scikit-Learn", "Data Visualisation", "Statistics", "Tableau"],
      soft: ["Analytical Thinking", "Data Storytelling", "Business Acumen", "Curiosity", "Collaboration", "Presentation Skills"],
      domain: ["Predictive Modelling", "A/B Testing", "Feature Engineering", "Statistical Hypothesis Testing", "Data Wrangling"]
    },
    keywords: ["regression", "classification", "clustering", "neural networks", "hyperparameter tuning", "data pipeline", "metrics", "analytics", "random forest", "NLP"],
    careerPaths: [
      { step: 1, title: "Junior Data Analyst / Scientist", time: "0-2 years", desc: "Cleans data, builds basic dashboards, writes SQL queries, and helps with exploratory data analysis." },
      { step: 2, title: "Data Scientist", time: "2-5 years", desc: "Builds and deploys machine learning models, designs experiments/A/B tests, and translates findings for business stakes." },
      { step: 3, title: "Senior Data Scientist", time: "5-8 years", desc: "Designs complex data architectures, leads advanced AI research, mentors junior scientists, and guides data strategy." },
      { step: 4, title: "Principal Data Scientist / Director of AI", time: "8+ years", desc: "Sets the enterprise AI roadmap, aligns machine learning initiatives with commercial impact, and leads large data divisions." }
    ],
    commonMissingSkills: ["A/B Testing", "Feature Engineering", "Model Deployment (Docker/Kubernetes)", "Big Data Technologies (Spark/Hadoop)"],
    customTips: [
      {
        category: "Content Optimization",
        tip: "Focus on the business outcomes of your models, not just the accuracy percentages. Tell recruiters how your models drove revenue, reduced churn, or optimized operations.",
        before: "Built a classification model to detect fraudulent transactions.",
        after: "Developed an XGBoost fraud detection model, improving precision by 14% and saving an estimated $120,000 in monthly transaction losses."
      },
      {
        category: "Tooling Clarity",
        tip: "Specify the exact library or framework used rather than general terms. Instead of saying 'analyzed data', name-drop 'Pandas, NumPy, and Seaborn'.",
        before: "Analyzed customer data to find patterns.",
        after: "Conducted exploratory data analysis (EDA) on 5M+ customer records using Pandas and NumPy, identifying key churn indicators and presenting insights via Tableau."
      }
    ]
  },
  "product_manager": {
    title: "Product Manager",
    category: "Management",
    skills: {
      technical: ["Product Roadmap", "Wireframing", "SQL", "Data Analytics", "Agile/Scrum", "Jira", "A/B Testing", "Market Research", "Figma", "User Analytics"],
      soft: ["Leadership", "Stakeholder Management", "Negotiation", "Empathy", "Public Speaking", "Strategic Thinking"],
      domain: ["Product Lifecycle Management", "Go-To-Market (GTM) Strategy", "User Experience (UX)", "Customer Discovery", "KPI Definition"]
    },
    keywords: ["roadmap", "backlog", "user stories", "cross-functional", "conversion rate", "retention", "customer feedback", "revenue growth", "launch", "scrum master"],
    careerPaths: [
      { step: 1, title: "Associate Product Manager", time: "0-2 years", desc: "Supports core PMs, writes user stories, manages the backlog, and conducts market/user research." },
      { step: 2, title: "Product Manager", time: "2-5 years", desc: "Owns a feature or product line, collaborates with design/engineering, and defines roadmap and success metrics." },
      { step: 3, title: "Senior Product Manager", time: "5-8 years", desc: "Owns complex product portfolios, defines long-term vision, mentors APMs, and manages high-impact business outcomes." },
      { step: 4, title: "VP of Product / Chief Product Officer", time: "8+ years", desc: "Directs product organization strategy, defines company-wide portfolio directions, and aligns executives on product vision." }
    ],
    commonMissingSkills: ["SQL", "A/B Testing", "GTM Strategy", "Technical API Integration", "User Analytics (Mixpanel/Amplitude)"],
    customTips: [
      {
        category: "Action-Impact Alignment",
        tip: "Ensure every bullet point follows the X-Y-Z formula: Accomplished [X] as measured by [Y], by doing [Z]. For PMs, impact should focus on user adoption, revenue, retention, or velocity.",
        before: "Launched a new checkout feature for the mobile app.",
        after: "Delivered a redesigned mobile checkout flow, increasing conversion rate by 22% and reducing checkout drop-off by 15% through rapid prototyping and A/B testing."
      },
      {
        category: "Cross-Functional Collaboration",
        tip: "Emphasize your role in leading teams without direct authority. Highlight collaborations with Engineering, Design, QA, and Marketing.",
        before: "Worked with developers and designers to build the app.",
        after: "Led a cross-functional team of 6 engineers and 2 UX designers using Agile Scrum, reducing sprint spillover by 30% and delivering the MVP 2 weeks ahead of schedule."
      }
    ]
  },
  "uiux_designer": {
    title: "UI/UX Designer",
    category: "Design",
    skills: {
      technical: ["Figma", "Adobe XD", "Sketch", "Prototyping", "Wireframing", "User Research", "Usability Testing", "Information Architecture", "HTML/CSS", "Design Systems", "Interaction Design"],
      soft: ["Empathy", "Collaboration", "Communication", "Active Listening", "Creativity", "Presentation"],
      domain: ["User-Centered Design (UCD)", "Visual Design", "Personas", "User Journeys", "Heuristic Evaluation", "Responsive Design"]
    },
    keywords: ["prototypes", "wireframes", "user testing", "design system", "accessibility", "WCAG", "heuristic", "mockups", "high-fidelity", "user flows", "typography"],
    careerPaths: [
      { step: 1, title: "Junior UI/UX Designer", time: "0-2 years", desc: "Creates mockups, assets, and design components. Helps with user research and maintains existing screens." },
      { step: 2, title: "UI/UX Designer", time: "2-5 years", desc: "Owns feature layouts, designs high-fidelity interactive prototypes, runs usability tests, and builds design systems." },
      { step: 3, title: "Senior Designer / Product Designer", time: "5-8 years", desc: "Oversees large product designs, establishes visual directions, integrates business needs into UX, and mentors junior designers." },
      { step: 4, title: "UX Director / Head of Design", time: "8+ years", desc: "Leads the design team, sets user experience standards for the organization, and champions design-driven culture at executive level." }
    ],
    commonMissingSkills: ["Design Systems", "Accessibility (WCAG)", "Usability Testing", "HTML/CSS (Front-end familiarity)", "Information Architecture"],
    customTips: [
      {
        category: "Process over Output",
        tip: "Recruiters want to see how you solved the problem, not just finished mockups. Highlight user research, wireframing, testing, and iterations based on feedback.",
        before: "Created high fidelity designs for the landing page in Figma.",
        after: "Conducted usability tests with 12 active users, identifying 3 key navigation bottlenecks, which informed a redesigned landing page that improved sign-ups by 40%."
      },
      {
        category: "Design System Usage",
        tip: "Explicitly mention your experience building or maintaining scalable design systems. This shows you can design for engineering-friendly handoffs.",
        before: "Made components and UI kits for the company.",
        after: "Built and scaled a comprehensive Figma Design System containing 200+ reusable components, shortening developer handoff times by 35%."
      }
    ]
  },
  "devops_engineer": {
    title: "DevOps / Cloud Engineer",
    category: "Infrastructure",
    skills: {
      technical: ["Docker", "Kubernetes", "AWS", "Terraform", "Git", "Linux", "Bash", "Python", "CI/CD", "Jenkins", "GitHub Actions", "Ansible", "Prometheus", "Grafana", "Nginx"],
      soft: ["Incident Response", "Collaboration", "Problem Solving", "Adaptability", "Security Mindset", "Communication"],
      domain: ["Infrastructure as Code (IaC)", "Site Reliability Engineering (SRE)", "Cloud Security", "Log Analysis", "Network Security"]
    },
    keywords: ["automation", "uptime", "kubernetes", "terraform", "monitoring", "pipeline", "aws", "security", "microservices", "high availability", "scaling"],
    careerPaths: [
      { step: 1, title: "Junior DevOps/Cloud Administrator", time: "0-2 years", desc: "Maintains Linux systems, monitors active services, troubleshoots deployment errors, and learns automation." },
      { step: 2, title: "DevOps Engineer", time: "2-5 years", desc: "Builds automated CI/CD pipelines, provisions cloud infrastructure using Terraform, and orchestrates services with Docker/Kubernetes." },
      { step: 3, title: "Senior DevOps / SRE", time: "5-8 years", desc: "Architects high-availability cloud setups, optimizes cloud spending, establishes system monitoring, and designs disaster recovery procedures." },
      { step: 4, title: "DevOps Architect / Director of Infrastructure", time: "8+ years", desc: "Defines cloud security governance, leads platform engineering teams, and manages the entire developer experience infrastructure." }
    ],
    commonMissingSkills: ["Terraform (IaC)", "Kubernetes (K8s)", "Monitoring (Prometheus/Grafana)", "Cloud Cost Optimisation"],
    customTips: [
      {
        category: "Reliability Focus",
        tip: "DevOps is about automation, scalability, and stability. Highlight metrics related to deployment frequency, mean time to resolution (MTTR), cloud cost savings, or uptime achievements.",
        before: "Maintained cloud servers and ran scripts to fix issues.",
        after: "Automated AWS resource provisioning using Terraform, cutting configuration drift to zero and reducing monthly cloud infrastructure costs by 24%."
      },
      {
        category: "CI/CD Pipeline Improvements",
        tip: "Focus on how your automation speeded up the work of developers. Instead of 'built pipelines', describe the acceleration of the release cycle.",
        before: "Wrote CI/CD pipelines to build the app.",
        after: "Re-engineered Jenkins pipelines to cache build dependencies, slashing build and test execution time by 50% and doubling deployment frequency to 8 times daily."
      }
    ]
  },
  "marketing_specialist": {
    title: "Digital Marketing Specialist",
    category: "Marketing",
    skills: {
      technical: ["Google Analytics", "SEO", "SEM", "Google Ads", "Facebook Ads", "Email Marketing", "Copywriting", "Content Strategy", "SQL", "CRM (HubSpot/Salesforce)", "HTML/CSS"],
      soft: ["Creativity", "Analytical Skills", "Communication", "Adaptability", "Collaboration", "Persuasion"],
      domain: ["A/B Testing", "Conversion Rate Optimisation (CRO)", "Customer Acquisition", "Brand Positioning", "Campaign Planning"]
    },
    keywords: ["SEO", "ROI", "CTR", "CPC", "campaigns", "conversion", "acquisition", "email marketing", "social media", "traffic", "keywords"],
    careerPaths: [
      { step: 1, title: "Marketing Assistant / Coordinator", time: "0-2 years", desc: "Drafts social posts, organizes newsletters, gathers reports, and performs basic keyword research." },
      { step: 2, title: "Digital Marketer / SEO Specialist", time: "2-5 years", desc: "Manages paid budget, executes SEO strategies, runs email campaigns, and conducts A/B tests on landing pages." },
      { step: 3, title: "Growth Marketing Manager / SEO Manager", time: "5-8 years", desc: "Defines acquisition funnels, manages marketing budgets, leads cross-channel campaigns, and coordinates content and design resources." },
      { step: 4, title: "VP of Marketing / CMO", time: "8+ years", desc: "Shapes global brand narrative, oversees massive performance marketing budgets, and drives customer growth at scale." }
    ],
    commonMissingSkills: ["Conversion Rate Optimisation (CRO)", "Google Analytics 4 (GA4)", "SQL (for data extraction)", "A/B Testing"],
    customTips: [
      {
        category: "Metrics Focus",
        tip: "Marketing resumes are highly quantitative. Always state your budgets, traffic gains, conversion rates, and Return on Ad Spend (ROAS).",
        before: "Managed SEO and content writing for the company blog.",
        after: "Executed a targeted SEO keyword strategy that increased organic blog traffic by 180% year-over-year, generating over 15k new leads."
      },
      {
        category: "Paid Ad Achievements",
        tip: "When describing paid ads, clarify how you optimized efficiency (e.g. lowering Cost Per Acquisition while increasing clicks).",
        before: "Ran Google and Facebook Ads campaigns.",
        after: "Managed an annual ad budget of $50,000 across Google and Meta Ads, improving ROAS from 2.5x to 4.2x and reducing cost-per-acquisition (CPA) by 30%."
      }
    ]
  }
};

const ACTION_VERBS = [
  "accelerated", "accomplished", "achieved", "analyzed", "architected", "automated",
  "built", "collaborated", "coordinated", "created", "decreased", "designed",
  "developed", "directed", "engineered", "established", "evaluated", "executed",
  "facilitated", "formulated", "generated", "guided", "implemented", "improved",
  "increased", "initiated", "innovated", "inspected", "installed", "instituted",
  "launched", "led", "managed", "maximized", "mediated", "mentored", "minimized",
  "negotiated", "optimized", "orchestrated", "organized", "originated", "overhauled",
  "performed", "pioneered", "planned", "produced", "programmed", "promoted",
  "reduced", "redesigned", "reorganized", "resolved", "restructured", "revamped",
  "saved", "scheduled", "spearheaded", "standardized", "streamlined", "structured",
  "supervised", "surpassed", "trained", "transformed", "upgraded", "validated"
];

const SOFT_SKILLS_POOL = [
  "communication", "teamwork", "leadership", "problem solving", "time management",
  "adaptability", "critical thinking", "collaboration", "empathy", "negotiation",
  "conflict resolution", "active listening", "presentation", "public speaking",
  "stakeholder management", "mentoring", "creativity", "organization", "decision making"
];

const DOMAIN_SKILLS_POOL = [
  "software development life cycle", "sdlc", "agile", "scrum", "project management",
  "system design", "cloud computing", "machine learning", "deep learning", "predictive modelling",
  "a/b testing", "data structures", "algorithms", "product lifecycle", "go-to-market", "gtm",
  "user experience", "ux", "customer discovery", "user-centered design", "wireframing",
  "information architecture", "responsive design", "infrastructure as code", "iac", "sre",
  "site reliability", "cloud security", "conversion rate optimisation", "cro", "customer acquisition",
  "brand positioning", "data wrangling", "feature engineering"
];

// Helper dictionaries for parsing general structures
const SECTIONS_PATTERNS = {
  education: /(education|academic|studies|qualification|degree|university|college|schooling)/i,
  experience: /(experience|employment|work history|career|professional background|jobs)/i,
  skills: /(skills|core competencies|technologies|expertise|technical proficiencies|strengths)/i,
  projects: /(projects|accomplishments|portfolio|personal works)/i,
  summary: /(summary|profile|about me|objective|professional summary)/i
};

// Generates a mock resume for a student or developer to test the application instantly
const SAMPLE_RESUMES = {
  "software_engineer": `JOHN DOE
San Francisco, CA | (123) 456-7890 | john.doe@email.com | github.com/johndoe

PROFESSIONAL SUMMARY
Passionate Software Engineer with 3+ years of experience building scalable web applications. Strong background in JavaScript and Python. Skilled at working in Agile teams, solving complex programming challenges, and optimizing application speed. Looking to join a fast-growing team to design impactful microservices.

SKILLS
* Technical: JavaScript, React, Node.js, Python, Java, SQL, Git, HTML, CSS
* Soft: Communication, Problem Solving, Teamwork, Time Management
* Domain: SDLC, Agile Methodology, Object-Oriented Programming

EXPERIENCE
Software Developer | TechCorp Inc. | 2024 - Present
* Responsible for writing clean code and fixing bugs in the React web application.
* Worked with developers and designers to build the app features.
* Built REST APIs in Node.js for data retrieval.
* Wrote unit tests using Jest, achieving better coverage.

Junior Web Developer | StartUp Solutions | 2022 - 2024
* Assisted in developing the front end using React and Tailwind CSS.
* Maintained database schemas in PostgreSQL and ran optimization queries.
* Participated in daily standups and sprint planning sessions.
* Fixed 50+ bugs and worked on improving accessibility.

EDUCATION
B.S. in Computer Science | State University | 2018 - 2022
* Graduated Magna Cum Laude
* Relevant Coursework: Data Structures, Algorithms, Databases, Software Engineering`,

  "data_scientist": `JANE SMITH
New York, NY | (987) 654-3210 | jane.smith@email.com | linkedin.com/in/janesmith

SUMMARY
Analytical Data Scientist with 4 years of experience using quantitative methods to solve business problems. Expert in Python, SQL, and Machine Learning. Experienced in gathering data, cleaning data, building models, and showing data visualizations to stakeholders.

SKILLS
* Technical: Python, SQL, R, Pandas, Scikit-Learn, TensorFlow, Tableau, Data Visualisation, Statistics
* Soft: Data Storytelling, Business Acumen, Analytical Thinking, Collaboration
* Domain: Predictive Modelling, Data Wrangling, Statistical Hypothesis Testing

EXPERIENCE
Data Scientist | RetailGiant | 2024 - Present
* Analyzed customer data to find patterns.
* Built a classification model to detect customer churn.
* Managed database queries in SQL to extract large sets of transactional data.
* Created dashboards in Tableau to share insights with the marketing team.

Junior Data Scientist | InfoAnalytics | 2022 - 2024
* Cleaned messy customer data and handled missing values using Python (Pandas).
* Built linear regression models to forecast sales trends.
* Worked on A/B testing setup for website changes.
* Documented analysis steps and code libraries for team members.

EDUCATION
M.S. in Data Science | Ivy University | 2020 - 2022
B.S. in Statistics | Central College | 2016 - 2020`,

  "product_manager": `ALEX CHEN
Seattle, WA | (555) 019-2834 | alex.chen@email.com | alexchen.com

SUMMARY
Product Manager with 5 years of experience leading cross-functional teams to build mobile apps. Strong background in agile scrum, market research, and roadmap design. Focused on identifying customer friction and turning insights into profitable features.

SKILLS
* Technical: Product Roadmap, Jira, Figma, Agile/Scrum, Wireframing, Data Analytics
* Soft: Leadership, Stakeholder Management, Communication, Empathy
* Domain: Product Lifecycle Management, Customer Discovery, KPI Definition

EXPERIENCE
Product Manager | AppDynamics | 2023 - Present
* Launched a new checkout feature for the mobile app.
* Defined product roadmap and aligned engineering teams on execution steps.
* Wrote user stories and managed the product backlog in Jira.
* Conducted market research and gathered customer feedback to improve designs.

Associate Product Manager | CommuteTech | 2021 - 2023
* Collaborated with engineers and designers to build features for the driver app.
* Managed sprint execution and acted as scrum master.
* Analyzed conversion rate metrics using Google Analytics.
* Conducted 20+ user interviews to identify usability issues.

EDUCATION
B.A. in Business Administration | West Coast University | 2017 - 2021`
};
