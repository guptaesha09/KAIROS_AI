// Main Application Script

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

// App State
const state = {
  currentResumeText: "",
  currentResumeFileName: "",
  targetRoleKey: "software_engineer",
  analysisResult: null,
  apiKeyGemini: localStorage.getItem('api_key_gemini') || "",
  apiKeyOpenAI: localStorage.getItem('api_key_openai') || "",
  selectedEngine: localStorage.getItem('selected_engine') || "local",
};

// DOM Elements
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const selectRole = document.getElementById('selectRole');
const analysisResultsContainer = document.getElementById('analysisResults');
const apiKeyBtn = document.getElementById('apiKeyBtn');
const keyModal = document.getElementById('keyModal');
const saveKeysBtn = document.getElementById('saveKeysBtn');
const closeModalBtn = document.getElementById('closeModalBtn');

// Toast Notification
function showToast(message, type = 'success') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconClass = 'check-circle';
  if (type === 'error') iconClass = 'alert-triangle';
  if (type === 'info') iconClass = 'info';
  
  toast.innerHTML = `
    <i data-lucide="${iconClass}"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);
  lucide.createIcons();
  
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s reverse forwards';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Init App Setup
function initApp() {
  lucide.createIcons();
  setupEventListeners();
  updateApiStatusIndicator();
  
  // Dynamic Role Dropdown population
  selectRole.innerHTML = '';
  Object.keys(JOB_ROLES_DB).forEach(key => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = JOB_ROLES_DB[key].title;
    selectRole.appendChild(option);
  });
  
  // Set default role
  selectRole.value = state.targetRoleKey;
}

// Event Listeners
function setupEventListeners() {
  // Role change
  selectRole.addEventListener('change', (e) => {
    state.targetRoleKey = e.target.value;
    if (state.currentResumeText) {
      runAnalysis();
    }
  });

  // API Modal toggle
  apiKeyBtn.addEventListener('click', () => {
    document.getElementById('geminiKeyInput').value = state.apiKeyGemini;
    document.getElementById('openaiKeyInput').value = state.apiKeyOpenAI;
    document.getElementById('engineSelect').value = state.selectedEngine;
    keyModal.classList.add('active');
  });

  closeModalBtn.addEventListener('click', () => {
    keyModal.classList.remove('active');
  });

  saveKeysBtn.addEventListener('click', () => {
    const geminiKey = document.getElementById('geminiKeyInput').value.trim();
    const openaiKey = document.getElementById('openaiKeyInput').value.trim();
    const engine = document.getElementById('engineSelect').value;

    state.apiKeyGemini = geminiKey;
    state.apiKeyOpenAI = openaiKey;
    state.selectedEngine = engine;

    localStorage.setItem('api_key_gemini', geminiKey);
    localStorage.setItem('api_key_openai', openaiKey);
    localStorage.setItem('selected_engine', engine);

    updateApiStatusIndicator();
    keyModal.classList.remove('active');
    showToast("API Configuration saved successfully!");

    if (state.currentResumeText) {
      runAnalysis();
    }
  });

  // Drag and Drop
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  });

  dropzone.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });
}

function updateApiStatusIndicator() {
  const badge = document.getElementById('apiStatusBadge');
  if (state.selectedEngine === 'gemini' && state.apiKeyGemini) {
    badge.className = 'api-badge active';
    badge.innerHTML = '<i data-lucide="cpu"></i> Gemini AI Active';
  } else if (state.selectedEngine === 'openai' && state.apiKeyOpenAI) {
    badge.className = 'api-badge active';
    badge.innerHTML = '<i data-lucide="cpu"></i> OpenAI Active';
  } else {
    badge.className = 'api-badge';
    badge.innerHTML = '<i data-lucide="cpu"></i> Local Analysis (No Key)';
  }
  lucide.createIcons();
}

// Load Sample Resume handler
function loadSampleResume(roleType) {
  if (SAMPLE_RESUMES[roleType]) {
    state.currentResumeText = SAMPLE_RESUMES[roleType];
    state.currentResumeFileName = `sample_${roleType}_resume.txt`;
    
    // Set matching role in dropdown
    state.targetRoleKey = roleType;
    selectRole.value = roleType;
    
    showToast(`Loaded sample ${JOB_ROLES_DB[roleType].title} resume!`, 'info');
    runAnalysis();
  }
}

// File Reading Logic with Server Call + Client Fallback
async function handleFile(file) {
  const validExtensions = ['.pdf', '.docx', '.txt'];
  const fileName = file.name;
  const fileExt = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

  if (!validExtensions.includes(fileExt)) {
    showToast("Unsupported file format! Please upload PDF, DOCX, or TXT.", "error");
    return;
  }

  dropzone.classList.add('analyzing');
  showToast(`Uploading and extracting text from: ${fileName}...`, 'info');

  try {
    // 1. First, attempt to run Flask backend analysis
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('role', state.targetRoleKey);

      const headers = {};
      if (state.apiKeyGemini) headers['X-Gemini-API-Key'] = state.apiKeyGemini;
      if (state.apiKeyOpenAI) headers['X-OpenAI-API-Key'] = state.apiKeyOpenAI;
      headers['X-Selected-Engine'] = state.selectedEngine;

      showToast("Sending document to Python backend analyzer...", "info");
      const res = await fetch('https://kairos-ai-1z9c.onrender.com', {
        method: 'POST',
        headers: headers,
        body: formData
      });

      if (res.ok) {
        const result = await res.json();
        state.analysisResult = result;
        state.currentResumeText = result.extractedText || "Raw text extracted by Python server.";
        state.currentResumeFileName = fileName;
        showToast("Backend analysis completed successfully!", "success");
        renderResults();
        analysisResultsContainer.classList.remove('results-hidden');
        if (result.score.overall >= 80) triggerConfetti();
        return; // Success! Exit handleFile
      } else {
        throw new Error(`Server status ${res.status}`);
      }
    } catch (backendError) {
      console.warn("Backend analysis unavailable, falling back to local client-side extraction:", backendError);
      showToast("Python backend offline. Falling back to local browser parser.", "warning");
    }

    // 2. Client-side local parser fallback
    let extractedText = "";

    if (fileExt === '.pdf') {
      const arrayBuffer = await file.arrayBuffer();
      extractedText = await parsePDF(arrayBuffer);
    } else if (fileExt === '.docx') {
      const arrayBuffer = await file.arrayBuffer();
      extractedText = await parseDOCX(arrayBuffer);
    } else if (fileExt === '.txt') {
      extractedText = await parseTXT(file);
    }

    if (!extractedText.trim()) {
      throw new Error("Could not extract any text content from the file.");
    }

    state.currentResumeText = extractedText;
    state.currentResumeFileName = fileName;
    
    showToast("Text extraction complete. Running local analysis...", "success");
    await runAnalysis();
  } catch (error) {
    console.error("Text extraction error:", error);
    showToast(`Failed to parse file: ${error.message}`, "error");
  } finally {
    dropzone.classList.remove('analyzing');
  }
}

// PDF Text Extractor using PDF.js
async function parsePDF(arrayBuffer) {
  const pdfjsLib = window['pdfjs-dist/build/pdf'];
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
  
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += pageText + '\n';
  }
  return fullText;
}

// DOCX Text Extractor using Mammoth
async function parseDOCX(arrayBuffer) {
  return new Promise((resolve, reject) => {
    mammoth.extractRawText({ arrayBuffer: arrayBuffer })
      .then(result => {
        resolve(result.value);
      })
      .catch(err => {
        reject(err);
      });
  });
}

// Plain Text Reader
function parseTXT(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = e => reject(e);
    reader.readAsText(file);
  });
}

// Main Analysis Hub
async function runAnalysis() {
  dropzone.classList.add('analyzing');
  analysisResultsContainer.classList.add('results-hidden');

  try {
    if (state.selectedEngine === 'gemini' && state.apiKeyGemini) {
      await runGeminiAnalysis();
    } else if (state.selectedEngine === 'openai' && state.apiKeyOpenAI) {
      await runOpenAIAnalysis();
    } else {
      await runLocalAnalysis();
    }
    
    renderResults();
    analysisResultsContainer.classList.remove('results-hidden');
    
    if (state.analysisResult && state.analysisResult.score.overall >= 80) {
      triggerConfetti();
    }
  } catch (error) {
    console.error("Analysis Failed:", error);
    showToast(`Analysis error: ${error.message}. Falling back to Local Engine.`, "error");
    await runLocalAnalysis();
    renderResults();
    analysisResultsContainer.classList.remove('results-hidden');
  } finally {
    dropzone.classList.remove('analyzing');
  }
}

// Local Analysis Engine
async function runLocalAnalysis() {
  const resumeText = state.currentResumeText;
  const resumeTextLower = resumeText.toLowerCase();
  const targetRole = JOB_ROLES_DB[state.targetRoleKey];

  // 1. Check sections present
  const hasEducation = SECTIONS_PATTERNS.education.test(resumeTextLower);
  const hasExperience = SECTIONS_PATTERNS.experience.test(resumeTextLower);
  const hasSkills = SECTIONS_PATTERNS.skills.test(resumeTextLower);
  const hasProjects = SECTIONS_PATTERNS.projects.test(resumeTextLower);
  const hasSummary = SECTIONS_PATTERNS.summary.test(resumeTextLower);

  let structureScoreVal = 0;
  if (hasEducation) structureScoreVal += 4;
  if (hasExperience) structureScoreVal += 4;
  if (hasSkills) structureScoreVal += 4;
  if (hasProjects) structureScoreVal += 4;
  if (hasSummary) structureScoreVal += 4;

  // 2. Extracted vs Missing Skills
  const extractedTech = [];
  const missingTech = [];

  targetRole.skills.technical.forEach(skill => {
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(resumeTextLower)) {
      extractedTech.push(skill);
    } else {
      missingTech.push(skill);
    }
  });

  const extractedSoft = SOFT_SKILLS_POOL.filter(skill => {
    const regex = new RegExp(`\\b${skill}\\b`, 'i');
    return regex.test(resumeTextLower);
  }).map(s => s.charAt(0).toUpperCase() + s.slice(1));

  const extractedDomain = DOMAIN_SKILLS_POOL.filter(skill => {
    const regex = new RegExp(`\\b${skill}\\b`, 'i');
    return regex.test(resumeTextLower);
  }).map(s => s.charAt(0).toUpperCase() + s.slice(1));

  // Skills alignment score out of 30
  const totalTargetSkills = targetRole.skills.technical.length;
  const skillsScoreVal = Math.round((extractedTech.length / totalTargetSkills) * 30);

  // 3. Action Verbs Score out of 20
  const matchedVerbs = ACTION_VERBS.filter(verb => {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    return regex.test(resumeTextLower);
  });
  const verbsScoreVal = Math.min(20, Math.round((matchedVerbs.length / 8) * 20));

  // 4. Metrics Quantification Score out of 20
  const metricRegex = /\b\d+(?:\.\d+)?%|\b\d+(?:\.\d+)?\s*(?:percent|%|usd|dollars|projects|years|users|conversion|leads|million|thousand|k|m)\b|\$\d+/gi;
  const metricMatches = resumeText.match(metricRegex) || [];
  const metricsScoreVal = Math.min(20, Math.round((metricMatches.length / 4) * 20));

  // 5. Contact / Profile Completeness out of 10
  const emailMatch = resumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  const phoneMatch = resumeText.match(/(?:\+?\d{1,3}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g);
  const socialMatch = /github\.com|linkedin\.com/i.test(resumeTextLower);

  let completenessScoreVal = 2;
  if (emailMatch) completenessScoreVal += 3;
  if (phoneMatch) completenessScoreVal += 3;
  if (socialMatch) completenessScoreVal += 2;

  // Compile Overall Score
  const overallScoreVal = skillsScoreVal + verbsScoreVal + structureScoreVal + metricsScoreVal + completenessScoreVal;

  // Build Career Suggestions based on category
  const alternativeRoles = [];
  if (targetRole.category === "Engineering") {
    alternativeRoles.push("DevOps Engineer", "Data Scientist");
  } else if (targetRole.category === "Data & AI") {
    alternativeRoles.push("Software Engineer", "Product Manager");
  } else if (targetRole.category === "Management") {
    alternativeRoles.push("UI/UX Designer", "Marketing Specialist");
  } else {
    alternativeRoles.push("Software Engineer", "Product Manager");
  }

  // Compile standard & custom improvement tips
  const tips = [];
  if (verbsScoreVal < 15) {
    tips.push({
      category: "Content Optimization",
      tip: "Increase the density of strong action verbs. Recruiters prefer details structured around concrete results and operational action, not list-based responsibilities.",
      before: "Responsible for writing and supporting code features for the company product.",
      after: "Engineered and deployed modular frontend code features in Agile sprints, cutting build error rate by 18%."
    });
  }
  if (metricsScoreVal < 15) {
    tips.push({
      category: "Quantify Results",
      tip: "Add measurable numbers, scales, or percentage indicators to highlight your actual performance and efficiency metrics.",
      before: "Helped load data and speed up database query times.",
      after: "Optimized SQL indexing strategies, reducing page loading times by 40% and supporting 15,000+ daily sessions."
    });
  }

  targetRole.customTips.forEach(ct => tips.push(ct));

  state.analysisResult = {
    score: {
      overall: Math.min(100, overallScoreVal),
      skills: skillsScoreVal,
      verbs: verbsScoreVal,
      structure: structureScoreVal,
      metrics: metricsScoreVal,
      completeness: completenessScoreVal,
      breakdownExplanation: `Local analysis evaluates: Match of critical skills (${skillsScoreVal}/30), action verb diversity (${verbsScoreVal}/20), visual/section parsing structure (${structureScoreVal}/20), quantifiable achievements (${metricsScoreVal}/20), and contact details (${completenessScoreVal}/10).`
    },
    extractedSkills: {
      technical: extractedTech,
      soft: extractedSoft.length > 0 ? extractedSoft : ["Teamwork", "Communication", "Problem Solving"],
      domain: extractedDomain.length > 0 ? extractedDomain : ["Agile / Scrum"]
    },
    missingSkills: missingTech,
    careerPaths: targetRole.careerPaths,
    alternativeRoles: alternativeRoles,
    improvementTips: tips,
    meta: {
      wordCount: resumeText.split(/\s+/).filter(Boolean).length,
      email: emailMatch ? emailMatch[0] : "Not found",
      phone: phoneMatch ? phoneMatch[0] : "Not found",
      socials: socialMatch ? "Found" : "Not found"
    }
  };
}

// AI Analysis: Gemini 1.5 Flash
async function runGeminiAnalysis() {
  const targetRoleTitle = JOB_ROLES_DB[state.targetRoleKey].title;
  const prompt = `You are a critical ATS reviewer and hiring strategist.
Analyze this resume text against the requirements of the job title "${targetRoleTitle}".

Perform an evaluation and output the results STRICTLY in JSON format. Do not write any normal text, markdown markers (like \`\`\`json), or conversational preambles outside the JSON payload.

Strictly adhere to the following JSON structure:
{
  "score": {
    "overall": 75,
    "skills": 22,
    "verbs": 15,
    "structure": 16,
    "metrics": 12,
    "completeness": 10,
    "breakdownExplanation": "Detailed explanation of strengths and weaknesses."
  },
  "extractedSkills": {
    "technical": ["Python", "Git"],
    "soft": ["Collaboration"],
    "domain": ["Agile Methods"]
  },
  "missingSkills": ["Docker", "Kubernetes", "AWS"],
  "careerPaths": [
    { "step": 1, "title": "Junior Developer", "time": "1-2 years", "desc": "Focus on..." },
    { "step": 2, "title": "Developer", "time": "2-5 years", "desc": "..." }
  ],
  "alternativeRoles": ["DevOps Engineer", "Solutions Architect"],
  "improvementTips": [
    {
      "category": "Quantifiable Achievements",
      "tip": "Rewrite your experience items to contain numeric metrics showing impact.",
      "before": "Helped manage server deployment pipeline.",
      "after": "Managed and automated deployment pipeline, cutting release downtime by 40% and deploying 3x faster."
    }
  ],
  "meta": {
    "wordCount": 350,
    "email": "candidate@email.com",
    "phone": "555-1234",
    "socials": "Found"
  }
}

Resume Text:
${state.currentResumeText}`;

  showToast("Contacting Gemini AI Engine...", "info");
  
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${state.apiKeyGemini}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();
  const responseText = resJson.candidates[0].content.parts[0].text;
  
  let cleanedJson = responseText.trim();
  if (cleanedJson.startsWith("```")) {
    cleanedJson = cleanedJson.replace(/^```json/, "").replace(/```$/, "").trim();
  }

  state.analysisResult = JSON.parse(cleanedJson);
  showToast("Gemini AI Analysis Complete!", "success");
}

// AI Analysis: OpenAI (Alternative)
async function runOpenAIAnalysis() {
  const targetRoleTitle = JOB_ROLES_DB[state.targetRoleKey].title;
  const prompt = `Analyze this resume text against the requirements of the job title "${targetRoleTitle}".
Format the output as a valid JSON object matching this schema:
{
  "score": {
    "overall": number,
    "skills": number (out of 30),
    "verbs": number (out of 20),
    "structure": number (out of 20),
    "metrics": number (out of 20),
    "completeness": number (out of 10),
    "breakdownExplanation": string
  },
  "extractedSkills": { "technical": [string], "soft": [string], "domain": [string] },
  "missingSkills": [string],
  "careerPaths": [ { "step": number, "title": string, "time": string, "desc": string } ],
  "alternativeRoles": [string],
  "improvementTips": [ { "category": string, "tip": string, "before": string, "after": string } ],
  "meta": { "wordCount": number, "email": string, "phone": string, "socials": string }
}

Resume Text:
${state.currentResumeText}`;

  showToast("Contacting OpenAI Engine...", "info");

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${state.apiKeyOpenAI}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: "You are an ATS parser that outputs clean, compliant JSON analysis." },
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errText}`);
  }

  const resJson = await response.json();
  const cleanedJson = resJson.choices[0].message.content.trim();
  state.analysisResult = JSON.parse(cleanedJson);
  showToast("OpenAI Analysis Complete!", "success");
}

// Render Results to UI Dashboard
function renderResults() {
  const result = state.analysisResult;
  if (!result) return;

  // 1. Score indicator
  const radialProgress = document.getElementById('overallScoreDial');
  radialProgress.style.setProperty('--progress-val', result.score.overall);
  document.getElementById('overallScoreNum').textContent = result.score.overall;

  const ratingEl = document.getElementById('scoreRating');
  const ratingText = document.getElementById('scoreRatingText');
  
  if (result.score.overall >= 80) {
    ratingEl.textContent = "Excellent Match";
    ratingEl.style.color = 'var(--color-success)';
    ratingText.textContent = "Your resume is highly optimized for this role and exhibits solid ATS credentials.";
  } else if (result.score.overall >= 60) {
    ratingEl.textContent = "Good Potential";
    ratingEl.style.color = 'var(--color-warning)';
    ratingText.textContent = "Your resume matches the core requirements, but could improve by addressing key skill gaps and adding metrics.";
  } else {
    ratingEl.textContent = "Needs Redesign";
    ratingEl.style.color = 'var(--color-danger)';
    ratingText.textContent = "Significant gaps in structure, metrics, or required skills. Follow our tips to optimize it.";
  }

  // 2. Score Breakdown Rows
  setProgressBar('skillsBar', result.score.skills, 30);
  setProgressBar('verbsBar', result.score.verbs, 20);
  setProgressBar('structureBar', result.score.structure, 20);
  setProgressBar('metricsBar', result.score.metrics, 20);
  setProgressBar('completenessBar', result.score.completeness, 10);
  
  document.getElementById('breakdownTextExplanation').textContent = result.score.breakdownExplanation;

  // 3. Metadata
  document.getElementById('metaWordCount').textContent = result.meta?.wordCount || result.wordCount || "N/A";
  document.getElementById('metaEmail').textContent = result.meta?.email || "Not found";
  document.getElementById('metaPhone').textContent = result.meta?.phone || "Not found";
  document.getElementById('metaSocial').textContent = result.meta?.socials || "Not found";

  // 4. Extracted Skills Cards
  renderSkillBadges('extractedTechSkills', result.extractedSkills.technical, 'success', 'check');
  renderSkillBadges('extractedSoftSkills', result.extractedSkills.soft, 'success', 'smile');
  renderSkillBadges('extractedDomainSkills', result.extractedSkills.domain, 'success', 'globe');
  
  renderSkillBadges('missingSkillsBox', result.missingSkills, 'warning', 'plus-circle');

  // 5. Career Path Timeline
  const timeline = document.getElementById('careerTimeline');
  timeline.innerHTML = '';
  result.careerPaths.forEach(path => {
    const item = document.createElement('div');
    item.className = 'timeline-item';
    item.innerHTML = `
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <div class="timeline-title">
          <span>${path.title}</span>
          <span class="timeline-time">${path.time}</span>
        </div>
        <p class="timeline-desc">${path.desc}</p>
      </div>
    `;
    timeline.appendChild(item);
  });

  const altRolesContainer = document.getElementById('alternativeRoles');
  altRolesContainer.innerHTML = '';
  result.alternativeRoles.forEach(role => {
    const card = document.createElement('div');
    card.className = 'meta-card';
    card.style.textAlign = 'left';
    card.innerHTML = `
      <div class="meta-card-label" style="color: var(--accent-cyan);">SUGGESTED OPTION</div>
      <div class="meta-card-value" style="font-size: 1rem; margin-top: 0.25rem;">${role}</div>
    `;
    altRolesContainer.appendChild(card);
  });

  // 6. Actionable Tips (Accordions)
  const tipsContainer = document.getElementById('tipsAccordion');
  tipsContainer.innerHTML = '';
  
  if (result.improvementTips.length === 0) {
    tipsContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        <i data-lucide="award" style="font-size: 3rem; color: var(--color-success); margin-bottom: 0.5rem;"></i>
        <p>No major structural improvements needed. Outstanding job!</p>
      </div>
    `;
  } else {
    result.improvementTips.forEach((tip, idx) => {
      const card = document.createElement('div');
      card.className = 'tip-card';
      card.innerHTML = `
        <div class="tip-card-header" onclick="toggleTipAccordion(${idx})">
          <div class="tip-card-title">
            <i data-lucide="help-circle"></i>
            <span>${tip.category} Checkpoint</span>
          </div>
          <span class="tip-badge">REWRITE TIP</span>
        </div>
        <div id="tipBody-${idx}" class="tip-card-body">
          <p class="tip-explanation">${tip.tip}</p>
          <div class="compare-grid">
            <div class="compare-box compare-before">
              <span class="compare-box-label">Before</span>
              ${tip.before}
            </div>
            <div class="compare-box compare-after">
              <span class="compare-box-label">Optimized Recommendation</span>
              ${tip.after}
              <button class="btn btn-secondary btn-copy" onclick="copyTipText('${tip.after.replace(/'/g, "\\'")}', this)" style="padding: 0.25rem 0.5rem; font-size: 0.7rem; position: absolute; bottom: 0.5rem; right: 0.5rem;">
                <i data-lucide="copy" style="width:12px; height:12px;"></i> Copy
              </button>
            </div>
          </div>
        </div>
      `;
      tipsContainer.appendChild(card);
    });
  }

  document.getElementById('originalResumeText').textContent = state.currentResumeText;
  lucide.createIcons();
}

function setProgressBar(barId, value, max) {
  const percentage = Math.round((value / max) * 100);
  const bar = document.getElementById(barId);
  const textVal = document.getElementById(`${barId}Val`);
  
  bar.style.width = `${percentage}%`;
  textVal.textContent = `${value}/${max}`;

  if (percentage >= 80) {
    bar.style.background = 'var(--color-success)';
  } else if (percentage >= 50) {
    bar.style.background = 'var(--color-warning)';
  } else {
    bar.style.background = 'var(--color-danger)';
  }
}

function renderSkillBadges(containerId, skillsArray, typeClass, iconName) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  
  if (!skillsArray || skillsArray.length === 0) {
    container.innerHTML = `<span style="font-size: 0.85rem; color: var(--text-muted); italic">None detected</span>`;
    return;
  }

  skillsArray.forEach(skill => {
    const badge = document.createElement('span');
    badge.className = `badge badge-${typeClass}`;
    badge.innerHTML = `
      <i data-lucide="${iconName}" style="width: 12px; height: 12px;"></i>
      ${skill}
    `;
    container.appendChild(badge);
  });
  lucide.createIcons();
}

// Helpers
window.toggleTipAccordion = function(index) {
  const body = document.getElementById(`tipBody-${index}`);
  if (body.style.display === 'none') {
    body.style.display = 'flex';
  } else {
    body.style.display = 'none';
  }
};

window.copyTipText = function(text, btnElement) {
  navigator.clipboard.writeText(text).then(() => {
    const originalHtml = btnElement.innerHTML;
    btnElement.innerHTML = `<i data-lucide="check" style="width:12px; height:12px;"></i> Copied!`;
    lucide.createIcons();
    setTimeout(() => {
      btnElement.innerHTML = originalHtml;
      lucide.createIcons();
    }, 2000);
  });
};

window.checkIndividualSkill = function() {
  const input = document.getElementById('skillSearchInput');
  const query = input.value.trim().toLowerCase();
  const resultDiv = document.getElementById('skillSearchResult');
  
  if (!query) {
    resultDiv.classList.add('results-hidden');
    return;
  }

  const resumeText = state.currentResumeText.toLowerCase();
  const hasSkill = new RegExp(`\\b${query}\\b`, 'i').test(resumeText);

  resultDiv.classList.remove('results-hidden');
  if (hasSkill) {
    resultDiv.className = 'badge badge-success';
    resultDiv.innerHTML = `<i data-lucide="check-circle" style="width:14px; height:14px;"></i> Found! "${input.value.trim()}" is listed in your resume.`;
  } else {
    resultDiv.className = 'badge badge-warning';
    resultDiv.innerHTML = `<i data-lucide="alert-circle" style="width:14px; height:14px;"></i> Missing! "${input.value.trim()}" was not detected.`;
  }
  lucide.createIcons();
};

window.switchTab = function(tabName, event) {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(t => t.classList.remove('active'));
  event.currentTarget.classList.add('active');

  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(c => c.classList.remove('active'));
  document.getElementById(tabName).classList.add('active');
};

function triggerConfetti() {
  if (typeof confetti !== 'undefined') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f2fe', '#4facfe', '#7f00ff', '#e100ff', '#10b981']
    });
  }
}

window.downloadAnalysisPDF = function() {
  if (!state.analysisResult) return;
  
  const { score, extractedSkills, missingSkills } = state.analysisResult;
  const roleName = JOB_ROLES_DB[state.targetRoleKey].title;
  
  const reportWindow = window.open('', '_blank');
  reportWindow.document.write(`
    <html>
    <head>
      <title>Kairos AI Resume Intelligence Report - ${state.currentResumeFileName}</title>
      <style>
        body { font-family: 'Inter', sans-serif; padding: 40px; color: #1f2937; line-height: 1.6; }
        .header { border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .title { font-size: 24px; font-weight: bold; color: #1e3a8a; margin: 0; }
        .score-circle { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 15px 25px; border-radius: 50%; font-size: 32px; font-weight: 800; margin: 20px 0; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: 600; color: #1e3a8a; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; margin-bottom: 15px; }
        .badge { display: inline-block; background: #f3f4f6; border: 1px solid #e5e7eb; padding: 4px 8px; border-radius: 4px; font-size: 13px; margin: 3px; }
        .badge-success { background: #d1fae5; color: #065f46; border-color: #a7f3d0; }
        .badge-warning { background: #fef3c7; color: #92400e; border-color: #fde68a; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="title">Resume Intelligence Analysis</h1>
        <p>Target Role: <strong>${roleName}</strong> | Document: ${state.currentResumeFileName}</p>
        <div class="score-circle">${score.overall}/100</div>
        <div>Rating: <strong>${score.overall >= 80 ? 'Excellent Match' : score.overall >= 60 ? 'Good Match' : 'Needs Redesign'}</strong></div>
      </div>
      
      <div class="section">
        <div class="section-title">Score Breakdown</div>
        <p>${score.breakdownExplanation}</p>
        <ul>
          <li>Skill Alignment: ${score.skills}/30</li>
          <li>Action Verbs: ${score.verbs}/20</li>
          <li>ATS Structure: ${score.structure}/20</li>
          <li>Quantified Results: ${score.metrics}/20</li>
          <li>Completeness: ${score.completeness}/10</li>
        </ul>
      </div>

      <div class="section">
        <div class="section-title">Extracted Skills</div>
        <p><strong>Technical:</strong></p>
        <div>${extractedSkills.technical.map(s => `<span class="badge badge-success">${s}</span>`).join('')}</div>
        <p><strong>Soft:</strong></p>
        <div>${extractedSkills.soft.map(s => `<span class="badge">${s}</span>`).join('')}</div>
      </div>

      <div class="section">
        <div class="section-title">Detected Gaps (Missing Skills)</div>
        <div>${missingSkills.map(s => `<span class="badge badge-warning">${s}</span>`).join('')}</div>
      </div>

      <div class="section">
        <div class="section-title">Actionable Recommendation Tips</div>
        <ul>
          ${state.analysisResult.improvementTips.map(tip => `
            <li>
              <strong>[${tip.category}]</strong> ${tip.tip}
              <br/><em>Before:</em> <strike>${tip.before}</strike>
              <br/><em>After:</em> <strong>${tip.after}</strong>
            </li>
          `).join('')}
        </ul>
      </div>
      
      <script>window.print();</script>
    </body>
    </html>
  `);
  reportWindow.document.close();
};
