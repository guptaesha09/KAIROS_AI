import os
import re
import json
import io
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import pypdf
import docx
import requests

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

# Local Knowledge Base in Python (Mirrors dictionary.js)
JOB_ROLES_DB = {
    "software_engineer": {
        "title": "Software Engineer",
        "category": "Engineering",
        "skills": {
            "technical": ["Python", "JavaScript", "Java", "C++", "Git", "SQL", "Docker", "REST APIs", "Data Structures", "Algorithms", "React", "Node.js"],
            "soft": ["Problem Solving", "Communication", "Teamwork", "Agile Methodology", "Time Management", "Adaptability"],
            "domain": ["Software Development Life Cycle (SDLC)", "Object-Oriented Programming (OOP)", "System Design", "Cloud Computing"]
        },
        "careerPaths": [
            { "step": 1, "title": "Junior Software Engineer", "time": "0-2 years", "desc": "Focuses on writing clean code, fixing bugs, and learning the codebase under mentorship." },
            { "step": 2, "title": "Mid-Level Software Engineer", "time": "2-5 years", "desc": "Owns features, designs smaller components, reviews code, and works independently." },
            { "step": 3, "title": "Senior Software Engineer", "time": "5-8 years", "desc": "Architects complex systems, mentors juniors, guides technical decisions, and designs for scalability." },
            { "step": 4, "title": "Staff Engineer / Tech Lead", "time": "8+ years", "desc": "Leads technical strategy across multiple teams, aligns engineering with business goals, or manages people." }
        ],
        "commonMissingSkills": ["Docker", "System Design", "CI/CD", "Cloud Computing (AWS/GCP)", "Unit Testing"],
        "customTips": [
            {
                "category": "Content Optimization",
                "tip": "Quantify your engineering achievements. Instead of writing 'Worked on backend services', write 'Redesigned backend APIs using Node.js, reducing latency by 35% and supporting 10k+ concurrent requests.'",
                "before": "Responsible for writing clean code and fixing bugs in the React web application.",
                "after": "Optimized React bundle sizes and implemented lazy loading, reducing initial page load time by 1.8 seconds and boosting lighthouse SEO score to 98%."
            },
            {
                "category": "ATS Keyword Optimization",
                "tip": "Ensure you mention system design and development methodologies like Agile or Scrum. Mentioning version control tools (like Git) and specific testing libraries (Jest, PyTest) boosts ATS visibility.",
                "before": "Tested code before pushing to production.",
                "after": "Established CI/CD pipelines using GitHub Actions and wrote unit tests (Jest, PyTest) increasing code coverage from 60% to 85%."
            }
        ]
    },
    "data_scientist": {
        "title": "Data Scientist",
        "category": "Data & AI",
        "skills": {
            "technical": ["Python", "R", "SQL", "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Pandas", "Scikit-Learn", "Data Visualisation", "Statistics", "Tableau"],
            "soft": ["Analytical Thinking", "Data Storytelling", "Business Acumen", "Curiosity", "Collaboration", "Presentation Skills"],
            "domain": ["Predictive Modelling", "A/B Testing", "Feature Engineering", "Statistical Hypothesis Testing", "Data Wrangling"]
        },
        "careerPaths": [
            { "step": 1, "title": "Junior Data Analyst / Scientist", "time": "0-2 years", "desc": "Cleans data, builds basic dashboards, writes SQL queries, and helps with exploratory data analysis." },
            { "step": 2, "title": "Data Scientist", "time": "2-5 years", "desc": "Builds and deploys machine learning models, designs experiments/A/B tests, and translates findings for business stakes." },
            { "step": 3, "title": "Senior Data Scientist", "time": "5-8 years", "desc": "Designs complex data architectures, leads advanced AI research, mentors junior scientists, and guides data strategy." },
            { "step": 4, "title": "Principal Data Scientist / Director of AI", "time": "8+ years", "desc": "Sets the enterprise AI roadmap, aligns machine learning initiatives with commercial impact, and leads large data divisions." }
        ],
        "commonMissingSkills": ["A/B Testing", "Feature Engineering", "Model Deployment (Docker/Kubernetes)", "Big Data Technologies (Spark/Hadoop)"],
        "customTips": [
            {
                "category": "Content Optimization",
                "tip": "Focus on the business outcomes of your models, not just the accuracy percentages. Tell recruiters how your models drove revenue, reduced churn, or optimized operations.",
                "before": "Built a classification model to detect fraudulent transactions.",
                "after": "Developed an XGBoost fraud detection model, improving precision by 14% and saving an estimated $120,000 in monthly transaction losses."
            },
            {
                "category": "Tooling Clarity",
                "tip": "Specify the exact library or framework used rather than general terms. Instead of saying 'analyzed data', name-drop 'Pandas, NumPy, and Seaborn'.",
                "before": "Analyzed customer data to find patterns.",
                "after": "Conducted exploratory data analysis (EDA) on 5M+ customer records using Pandas and NumPy, identifying key churn indicators and presenting insights via Tableau."
            }
        ]
    },
    "product_manager": {
        "title": "Product Manager",
        "category": "Management",
        "skills": {
            "technical": ["Product Roadmap", "Wireframing", "SQL", "Data Analytics", "Agile/Scrum", "Jira", "A/B Testing", "Market Research", "Figma", "User Analytics"],
            "soft": ["Leadership", "Stakeholder Management", "Negotiation", "Empathy", "Public Speaking", "Strategic Thinking"],
            "domain": ["Product Lifecycle Management", "Go-To-Market (GTM) Strategy", "User Experience (UX)", "Customer Discovery", "KPI Definition"]
        },
        "careerPaths": [
            { "step": 1, "title": "Associate Product Manager", "time": "0-2 years", "desc": "Supports core PMs, writes user stories, manages the backlog, and conducts market/user research." },
            { "step": 2, "title": "Product Manager", "time": "2-5 years", "desc": "Owns a feature or product line, collaborates with design/engineering, and defines roadmap and success metrics." },
            { "step": 3, "title": "Senior Product Manager", "time": "5-8 years", "desc": "Owns complex product portfolios, defines long-term vision, mentors APMs, and manages high-impact business outcomes." },
            { "step": 4, "title": "VP of Product / Chief Product Officer", "time": "8+ years", "desc": "Directs product organization strategy, defines company-wide portfolio directions, and aligns executives on product vision." }
        ],
        "commonMissingSkills": ["SQL", "A/B Testing", "GTM Strategy", "Technical API Integration", "User Analytics (Mixpanel/Amplitude)"],
        "customTips": [
            {
                "category": "Action-Impact Alignment",
                "tip": "Ensure every bullet point follows the X-Y-Z formula: Accomplished [X] as measured by [Y], by doing [Z]. For PMs, impact should focus on user adoption, revenue, retention, or velocity.",
                "before": "Launched a new checkout feature for the mobile app.",
                "after": "Delivered a redesigned mobile checkout flow, increasing conversion rate by 22% and reducing checkout drop-off by 15% through rapid prototyping and A/B testing."
            },
            {
                "category": "Cross-Functional Collaboration",
                "tip": "Emphasize your role in leading teams without direct authority. Highlight collaborations with Engineering, Design, QA, and Marketing.",
                "before": "Worked with developers and designers to build the app.",
                "after": "Led a cross-functional team of 6 engineers and 2 UX designers using Agile Scrum, reducing sprint spillover by 30% and delivering the MVP 2 weeks ahead of schedule."
            }
        ]
    }
}

ACTION_VERBS = [
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
]

SOFT_SKILLS_POOL = [
    "communication", "teamwork", "leadership", "problem solving", "time management",
    "adaptability", "critical thinking", "collaboration", "empathy", "negotiation",
    "conflict resolution", "active listening", "presentation", "public speaking",
    "stakeholder management", "mentoring", "creativity", "organization", "decision making"
]

DOMAIN_SKILLS_POOL = [
    "software development life cycle", "sdlc", "agile", "scrum", "project management",
    "system design", "cloud computing", "machine learning", "deep learning", "predictive modelling",
    "a/b testing", "data structures", "algorithms", "product lifecycle", "go-to-market", "gtm",
    "user experience", "ux", "customer discovery", "user-centered design", "wireframing",
    "information architecture", "responsive design", "infrastructure as code", "iac", "sre",
    "site reliability", "cloud security", "conversion rate optimisation", "cro", "customer acquisition",
    "brand positioning", "data wrangling", "feature engineering"
]

# Section checking
SECTIONS_PATTERNS = {
    "education": re.compile(r'(education|academic|studies|qualification|degree|university|college|schooling)', re.IGNORECASE),
    "experience": re.compile(r'(experience|employment|work history|career|professional background|jobs)', re.IGNORECASE),
    "skills": re.compile(r'(skills|core competencies|technologies|expertise|technical proficiencies|strengths)', re.IGNORECASE),
    "projects": re.compile(r'(projects|accomplishments|portfolio|personal works)', re.IGNORECASE),
    "summary": re.compile(r'(summary|profile|about me|objective|professional summary)', re.IGNORECASE)
}

# Serve Frontend static assets
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

# Main Analysis API
@app.route('/api/analyze', methods=['POST'])
def analyze_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
        
    file = request.files['file']
    role_key = request.form.get('role', 'software_engineer')
    
    if file.filename == '':
        return jsonify({"error": "Empty filename"}), 400

    filename = file.filename.lower()
    extracted_text = ""

    try:
        if filename.endswith('.pdf'):
            pdf_reader = pypdf.PdfReader(file.stream)
            pages_text = []
            for page in pdf_reader.pages:
                pages_text.append(page.extract_text() or "")
            extracted_text = "\n".join(pages_text)
            
        elif filename.endswith('.docx'):
            doc_file = docx.Document(io.BytesIO(file.read()))
            paragraphs = [para.text for para in doc_file.paragraphs]
            extracted_text = "\n".join(paragraphs)
            
        elif filename.endswith('.txt'):
            extracted_text = file.read().decode('utf-8', errors='ignore')
            
        else:
            return jsonify({"error": "Unsupported file format"}), 400
    except Exception as e:
        return jsonify({"error": f"Failed to parse file: {str(e)}"}), 500

    if not extracted_text.strip():
        return jsonify({"error": "Document contains no readable text content"}), 400

    # Retrieve Keys from Headers or Env
    gemini_key = request.headers.get('X-Gemini-API-Key') or os.environ.get('GEMINI_API_KEY')
    openai_key = request.headers.get('X-OpenAI-API-Key') or os.environ.get('OPENAI_API_KEY')
    engine = request.headers.get('X-Selected-Engine', 'local')

    # Run AI Analysis if keys are available
    if engine == 'gemini' and gemini_key:
        try:
            return run_gemini_api_analysis(extracted_text, role_key, gemini_key)
        except Exception as e:
            # Fallback to local
            print(f"Gemini API failure: {str(e)}. Falling back to local.")
            
    elif engine == 'openai' and openai_key:
        try:
            return run_openai_api_analysis(extracted_text, role_key, openai_key)
        except Exception as e:
            print(f"OpenAI API failure: {str(e)}. Falling back to local.")

    # Execute Local Parsing Fallback
    analysis = execute_local_analysis(extracted_text, role_key)
    return jsonify(analysis)

def execute_local_analysis(text, role_key):
    text_lower = text.lower()
    target_role = JOB_ROLES_DB.get(role_key, JOB_ROLES_DB['software_engineer'])

    # Section Checking
    has_edu = 1 if SECTIONS_PATTERNS['education'].search(text_lower) else 0
    has_exp = 1 if SECTIONS_PATTERNS['experience'].search(text_lower) else 0
    has_skl = 1 if SECTIONS_PATTERNS['skills'].search(text_lower) else 0
    has_prj = 1 if SECTIONS_PATTERNS['projects'].search(text_lower) else 0
    has_sum = 1 if SECTIONS_PATTERNS['summary'].search(text_lower) else 0

    structure_score = (has_edu + has_exp + has_skl + has_prj + has_sum) * 4

    # Technical Skills matching
    extracted_tech = []
    missing_tech = []
    for skill in target_role["skills"]["technical"]:
        escaped = re.escape(skill)
        pattern = re.compile(rf'\b{escaped}\b', re.IGNORECASE)
        if pattern.search(text_lower):
            extracted_tech.append(skill)
        else:
            missing_tech.append(skill)

    total_target = len(target_role["skills"]["technical"])
    skills_score = round((len(extracted_tech) / total_target) * 30) if total_target > 0 else 0

    # Soft skills matching
    extracted_soft = []
    for skill in SOFT_SKILLS_POOL:
        escaped = re.escape(skill)
        pattern = re.compile(rf'\b{escaped}\b', re.IGNORECASE)
        if pattern.search(text_lower):
            extracted_soft.append(skill.capitalize())

    # Domain skills matching
    extracted_domain = []
    for skill in DOMAIN_SKILLS_POOL:
        escaped = re.escape(skill)
        pattern = re.compile(rf'\b{escaped}\b', re.IGNORECASE)
        if pattern.search(text_lower):
            extracted_domain.append(skill.capitalize())

    # Action Verbs check
    matched_verbs = []
    for verb in ACTION_VERBS:
        escaped = re.escape(verb)
        pattern = re.compile(rf'\b{escaped}\b', re.IGNORECASE)
        if pattern.search(text_lower):
            matched_verbs.append(verb)
    verbs_score = min(20, round((len(matched_verbs) / 8) * 20))

    # Metrics Check
    metric_pattern = re.compile(r'\b\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?\s*(?:percent|%|usd|dollars|projects|years|users|conversion|leads|million|thousand|k|m)\b|\$\d+', re.IGNORECASE)
    metrics_matches = metric_pattern.findall(text)
    metrics_score = min(20, round((len(metrics_matches) / 4) * 20))

    # Completeness check
    email_pattern = re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')
    phone_pattern = re.compile(r'(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}')
    has_social = 1 if re.search(r'github\.com|linkedin\.com', text_lower) else 0

    completeness_score = 2
    if email_pattern.search(text):
        completeness_score += 3
    if phone_pattern.search(text):
        completeness_score += 3
    if has_social:
        completeness_score += 2

    overall_score = skills_score + verbs_score + structure_score + metrics_score + completeness_score

    # Setup alternative roles
    alternative_roles = ["DevOps Engineer", "Data Scientist"] if target_role["category"] == "Engineering" else ["Software Engineer", "Product Manager"]

    # Tips compile
    tips = []
    if verbs_score < 15:
        tips.append({
            "category": "Content Optimization",
            "tip": "Increase the density of strong action verbs. Highlight achievements with operational keywords rather than passive listing.",
            "before": "Responsible for writing and supporting code features.",
            "after": "Engineered and deployed modular frontend code features in Agile sprints, cutting build error rate by 18%."
        })
    if metrics_score < 15:
        tips.append({
            "category": "Quantify Results",
            "tip": "Add quantifiable metrics to illustrate your actual performance scale (percentages, dollar values, timelines).",
            "before": "Helped speed up database query times.",
            "after": "Optimized SQL indexing structures, reducing page loading times by 40% and supporting 15,000+ daily sessions."
        })

    # Append custom tips
    for ct in target_role.get("customTips", []):
        tips.append(ct)

    # Word count
    word_count = len(text.split())

    return {
        "score": {
            "overall": min(100, overall_score),
            "skills": skills_score,
            "verbs": verbs_score,
            "structure": structure_score,
            "metrics": metrics_score,
            "completeness": completeness_score,
            "breakdownExplanation": f"Python backend analysis: Critical skills matched ({skills_score}/30), action verbs count ({verbs_score}/20), section layout checks ({structure_score}/20), quantified results metrics ({metrics_score}/20), and contact details ({completeness_score}/10)."
        },
        "extractedSkills": {
            "technical": extracted_tech,
            "soft": extracted_soft if extracted_soft else ["Teamwork", "Communication"],
            "domain": extracted_domain if extracted_domain else ["Agile / Scrum"]
        },
        "missingSkills": missing_tech,
        "careerPaths": target_role["careerPaths"],
        "alternativeRoles": alternative_roles,
        "improvementTips": tips,
        "meta": {
            "wordCount": word_count,
            "email": email_pattern.search(text).group(0) if email_pattern.search(text) else "Not found",
            "phone": phone_pattern.search(text).group(0) if phone_pattern.search(text) else "Not found",
            "socials": "Found" if has_social else "Not found"
        },
        "extractedText": text
    }

def run_gemini_api_analysis(text, role_key, api_key):
    target_role_title = JOB_ROLES_DB.get(role_key, JOB_ROLES_DB['software_engineer'])['title']
    prompt = f"""You are a critical ATS reviewer and hiring strategist.
Analyze this resume text against the requirements of the job title "{target_role_title}".

Perform an evaluation and output the results STRICTLY in JSON format matching this schema:
{{
  "score": {{
    "overall": 75,
    "skills": 22,
    "verbs": 15,
    "structure": 16,
    "metrics": 12,
    "completeness": 10,
    "breakdownExplanation": "Explanation sentence."
  }},
  "extractedSkills": {{
    "technical": ["Python", "Git"],
    "soft": ["Collaboration"],
    "domain": ["Agile Methods"]
  }},
  "missingSkills": ["Docker"],
  "careerPaths": [
    {{ "step": 1, "title": "Junior Developer", "time": "1-2 years", "desc": "Focus on..." }}
  ],
  "alternativeRoles": ["DevOps Engineer"],
  "improvementTips": [
    {{
      "category": "Quantifiable Achievements",
      "tip": "Rewrite your experience items.",
      "before": "Managed pipeline",
      "after": "Automated pipeline, saving 4 hours daily."
    }}
  ],
  "meta": {{
    "wordCount": 350,
    "email": "candidate@email.com",
    "phone": "555-1234",
    "socials": "Found"
  }}
}}

Resume Text:
{text}"""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.2
        }
    }
    
    res = requests.post(url, json=payload, headers={"Content-Type": "application/json"})
    res.raise_for_status()
    
    parts_text = res.json()['candidates'][0]['content']['parts'][0]['text']
    
    # Strip potential markdown markers
    parts_text = parts_text.strip()
    if parts_text.startswith("```"):
        parts_text = parts_text.replace("```json", "").replace("```", "").strip()
        
    analysis_data = json.loads(parts_text)
    analysis_data["extractedText"] = text
    return jsonify(analysis_data)

def run_openai_api_analysis(text, role_key, api_key):
    target_role_title = JOB_ROLES_DB.get(role_key, JOB_ROLES_DB['software_engineer'])['title']
    prompt = f"""Analyze this resume text against the requirements of the job title "{target_role_title}".
Format the output as a valid JSON object matching this schema:
{{
  "score": {{
    "overall": number,
    "skills": number (out of 30),
    "verbs": number (out of 20),
    "structure": number (out of 20),
    "metrics": number (out of 20),
    "completeness": number (out of 10),
    "breakdownExplanation": string
  }},
  "extractedSkills": {{ "technical": [string], "soft": [string], "domain": [string] }},
  "missingSkills": [string],
  "careerPaths": [ {{ "step": number, "title": string, "time": string, "desc": string }} ],
  "alternativeRoles": [string],
  "improvementTips": [ {{ "category": string, "tip": string, "before": string, "after": string }} ],
  "meta": {{ "wordCount": number, "email": string, "phone": string, "socials": string }}
}}

Resume Text:
{text}"""

    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    payload = {
        "model": "gpt-3.5-turbo",
        "response_format": { "type": "json_object" },
        "messages": [
            { "role": "system", "content": "You are an ATS parser that outputs clean, compliant JSON analysis." },
            { "role": "user", content: prompt }
        ],
        "temperature": 0.2
    }
    
    res = requests.post(url, json=payload, headers=headers)
    res.raise_for_status()
    
    parts_text = res.json()['choices'][0]['message']['content'].strip()
    analysis_data = json.loads(parts_text)
    analysis_data["extractedText"] = text
    return jsonify(analysis_data)

if __name__ == '__main__':
    print("Starting Resume Analyzer Full Stack Server...")
    print("Serving frontend files from '../frontend' directory.")
    print("API Endpoint available at '/api/analyze'.")
    app.run(host='0.0.0.0', port=5000, debug=True)
