/* =====================================================
   CAREER GUIDANCE SYSTEM — app.js
   
   Key additions vs v1:
   - PCMB fork modal: Biology (stream 2) vs CS Exploration (stream 1)
   - JOB_ROLES data: 4 roles per career tag with degree + skills
   - Result screen shows job role cards under the score bars
   ===================================================== */

const API_BASE = 'http://localhost:8080/api';

/* =====================================================
   CAREER DATA — field names, degrees, and job roles
   Mirrors the SQL inserts exactly.
   ===================================================== */

const CAREER_DATA = {

  /* ---- PCMC ---- */
  SWE: {
    field:  'Software Engineering',
    degree: 'B.Tech in CSE, IT or BCA/MCA',
    roles: [
      { name: 'Full-Stack Developer',  skills: 'Java · Spring Boot · React · SQL' },
      { name: 'Backend Architect',     skills: 'Microservices · System Design · Cloud (AWS)' },
      { name: 'Mobile App Developer',  skills: 'Android (Kotlin) · iOS (Swift) · Flutter' },
      { name: 'DevOps Engineer',       skills: 'Docker · Kubernetes · Jenkins · CI/CD' },
    ],
  },
  HW: {
    field:  'Hardware & Systems',
    degree: 'B.Tech in Computer Engineering / ECE',
    roles: [
      { name: 'Embedded Systems Engineer', skills: 'C · C++ · Microcontrollers · RTOS' },
      { name: 'VLSI Design Engineer',      skills: 'Verilog · VHDL · FPGA · CMOS Design' },
      { name: 'Hardware Test Engineer',    skills: 'Circuit Debugging · Oscilloscopes · PCB Design' },
      { name: 'Robotics Engineer',         skills: 'Control Systems · Sensor Integration · ROS' },
    ],
  },
  DS: {
    field:  'Data Science & Artificial Intelligence',
    degree: 'B.Tech AI-DS, B.Sc Statistics, or B.Math',
    roles: [
      { name: 'Machine Learning Engineer',         skills: 'Python · PyTorch · TensorFlow · Model Deployment' },
      { name: 'Data Scientist',                    skills: 'Statistical Modeling · Pandas · Scikit-learn · R' },
      { name: 'Big Data Engineer',                 skills: 'Apache Spark · Hadoop · Kafka · ETL Pipelines' },
      { name: 'Data Analyst / Business Intelligence', skills: 'SQL · Tableau · Power BI · Excel Analytics' },
    ],
  },
  CYBER: {
    field:  'Cyber Security & Network Defense',
    degree: 'B.Tech CSE (Cyber Security), IT, or B.Sc Cyber Security',
    roles: [
      { name: 'Ethical Hacker (Pentester)',             skills: 'Metasploit · Nmap · Burp Suite · Web Security' },
      { name: 'SOC Analyst',                            skills: 'SIEM Tools · Incident Response · Threat Hunting' },
      { name: 'Network Security Engineer',              skills: 'Firewalls · VPNs · IDS/IPS · Cisco Security' },
      { name: 'Digital Forensics Investigator',         skills: 'EnCase · FTK · Data Recovery · Evidence Handling' },
    ],
  },

  /* ---- PCMB ---- */
  MED: {
    field:  'Medicine & Surgery',
    degree: 'MBBS, BDS, or BAMS',
    roles: [
      { name: 'General Surgeon', skills: 'Surgical Precision · Anatomy · Patient Care' },
      { name: 'Pediatrician',    skills: 'Child Healthcare · Diagnosis · Empathy' },
      { name: 'Cardiologist',    skills: 'Heart Health · ECG Interpretation · Physiology' },
      { name: 'Radiologist',     skills: 'MRI/CT Scan Analysis · Diagnostic Imaging' },
    ],
  },
  GEN: {
    field:  'Genetics & Research',
    degree: 'B.Sc/B.Tech Biotech or Genetics',
    roles: [
      { name: 'Genetic Counselor',        skills: 'DNA Analysis · Patient Consultation · Ethics' },
      { name: 'Bio-Informatics Scientist', skills: 'Computational Biology · Python · Genomics' },
      { name: 'Clinical Researcher',      skills: 'Trial Management · FDA Regulations · Statistics' },
      { name: 'Laboratory Manager',       skills: 'Equipment Calibration · Quality Control · Micro-bio' },
    ],
  },
  PHARMA: {
    field:  'Pharmaceutical Sciences',
    degree: 'B.Pharm or Pharm.D',
    roles: [
      { name: 'Drug Safety Physician',    skills: 'Pharmacovigilance · Side-effect Tracking' },
      { name: 'Pharmaceutical Chemist',   skills: 'Drug Formulation · Organic Synthesis' },
      { name: 'Quality Assurance (QA)',   skills: 'GMP Standards · Chemical Testing · Compliance' },
      { name: 'Retail Pharmacist',        skills: 'Dosage Calculation · Medicine Counseling' },
    ],
  },
  ECO: {
    field:  'Ecology & Environmental Science',
    degree: 'B.Sc Ecology or Environmental Biology',
    roles: [
      { name: 'Conservation Biologist',      skills: 'Species Protection · Field Research' },
      { name: 'Environmental Consultant',    skills: 'Impact Assessment · Sustainability Audit' },
      { name: 'Wildlife Photographer/Writer', skills: 'Nature Observation · Visual Storytelling' },
      { name: 'Marine Biologist',            skills: 'Oceanic Ecosystems · Scuba/Field Collection' },
    ],
  },

  /* ---- PCME ---- */
  EMB: {
    field:  'Embedded Systems & IoT',
    degree: 'B.Tech ECE/EEE',
    roles: [
      { name: 'Firmware Engineer',             skills: 'Embedded C · RTOS · Device Drivers' },
      { name: 'IoT Solutions Architect',        skills: 'Cloud Integration · Sensors · MQTT Protocols' },
      { name: 'Automotive Systems Engineer',    skills: 'CAN Bus · Autonomous Driving Logic' },
      { name: 'Hardware Abstraction Layer Dev', skills: 'Low-level Coding · SPI/I2C Protocols' },
    ],
  },
  VLSI: {
    field:  'VLSI & Chip Design',
    degree: 'B.Tech ECE (Electronics)',
    roles: [
      { name: 'ASIC Design Engineer',     skills: 'Verilog · Digital Logic · Synthesis' },
      { name: 'Physical Design Engineer', skills: 'Floorplanning · Routing · Timing Closure' },
      { name: 'Verification Engineer',    skills: 'UVM · SystemVerilog · Bug Tracking' },
      { name: 'FPGA Prototyper',          skills: 'Xilinx/Vivado · Hardware Simulation' },
    ],
  },
  TEL: {
    field:  'Telecommunications',
    degree: 'B.Tech ECE (Telecom)',
    roles: [
      { name: '5G/6G Network Engineer',        skills: 'Signal Processing · MIMO · Protocol Stack' },
      { name: 'RF Engineer',                   skills: 'Antenna Design · Wave Propagation' },
      { name: 'Satellite Communications Tech', skills: 'Link Budgeting · Orbital Mechanics' },
      { name: 'Network Security Architect',    skills: 'Encryption · VPNs · VOIP Security' },
    ],
  },
  POW: {
    field:  'Electrical Power Systems',
    degree: 'B.Tech EEE (Electrical)',
    roles: [
      { name: 'Power Grid Manager',        skills: 'Load Balancing · SCADA Systems' },
      { name: 'Renewable Energy Engineer', skills: 'Solar/Wind Integration · Inverters' },
      { name: 'Electric Vehicle Engineer', skills: 'Battery Management (BMS) · DC Motors' },
      { name: 'High Voltage Technician',   skills: 'Transformer Maintenance · Safety Protocols' },
    ],
  },

  /* ---- Commerce ---- */
  ACC: {
    field:  'Accounting & Audit',
    degree: 'B.Com + CA/ACCA',
    roles: [
      { name: 'Chartered Accountant (CA)', skills: 'Taxation · Auditing · Financial Reporting' },
      { name: 'Forensic Accountant',       skills: 'Fraud Detection · Legal Evidence' },
      { name: 'Corporate Controller',      skills: 'Budget Management · Internal Controls' },
      { name: 'Tax Consultant',            skills: 'GST/Income Tax Compliance · Strategy' },
    ],
  },
  FIN: {
    field:  'Finance & Investment',
    degree: 'B.Com/BBA + CFA',
    roles: [
      { name: 'Investment Banker',        skills: 'M&A · Valuation · Capital Raising' },
      { name: 'Equity Research Analyst',  skills: 'Stock Picking · Financial Modeling' },
      { name: 'Portfolio Manager',        skills: 'Asset Allocation · Risk Assessment' },
      { name: 'Financial Risk Manager',   skills: 'Derivatives · Hedging · Market Analysis' },
    ],
  },
  MGT: {
    field:  'Business Management',
    degree: 'BBA or MBA',
    roles: [
      { name: 'Project Manager',         skills: 'Agile · Team Coordination · Resource Planning' },
      { name: 'HR Operations Head',      skills: 'Employee Relations · Policy Design' },
      { name: 'Operations Manager',      skills: 'Supply Chain · Process Optimization' },
      { name: 'Management Consultant',   skills: 'Strategy · Problem Solving · Client Relations' },
    ],
  },
  MKT: {
    field:  'Marketing & Advertising',
    degree: 'BBA/BMS in Marketing',
    roles: [
      { name: 'Digital Marketing Manager',   skills: 'SEO · SEM · Social Media Strategy' },
      { name: 'Brand Manager',               skills: 'Brand Identity · Market Positioning' },
      { name: 'Market Research Analyst',     skills: 'Consumer Behavior · Data Trends' },
      { name: 'Copywriter/Content Strategist', skills: 'Persuasive Writing · Storytelling' },
    ],
  },

  /* ---- Arts ---- */
  LAW: {
    field:  'Legal & Political Sciences',
    degree: 'B.A. LLB or LLB',
    roles: [
      { name: 'Corporate Lawyer',          skills: 'Contract Law · Mergers · Legal Compliance' },
      { name: 'Criminal Defense Attorney', skills: 'Litigation · Evidence · Public Speaking' },
      { name: 'Policy Analyst',            skills: 'Political Science · Legislative Drafting' },
      { name: 'Civil Rights Advocate',     skills: 'Human Rights · Constitutional Law' },
    ],
  },
  DSN: {
    field:  'Fine Arts & Design',
    degree: 'B.Des or BFA',
    roles: [
      { name: 'Graphic/UI-UX Designer', skills: 'Figma · Adobe Suite · User Centered Design' },
      { name: 'Fashion Designer',       skills: 'Textile Knowledge · Illustration · Trends' },
      { name: 'Art Director',           skills: 'Visual Leadership · Creative Concepts' },
      { name: 'Interior Designer',      skills: 'Space Planning · AutoCAD · Aesthetics' },
    ],
  },
  PSY: {
    field:  'Psychology & Social Work',
    degree: 'B.A. Psychology',
    roles: [
      { name: 'Clinical Psychologist',   skills: 'Therapy · Mental Health Assessment' },
      { name: 'Industrial Psychologist', skills: 'Workplace Behavior · HR Strategy' },
      { name: 'Educational Counselor',   skills: 'Student Guidance · Learning Disabilities' },
      { name: 'Social Worker',           skills: 'Community Support · Crisis Intervention' },
    ],
  },
  MC: {
    field:  'Journalism & Mass Communication',
    degree: 'B.A. Journalism/Media',
    roles: [
      { name: 'Investigative Journalist',    skills: 'Reporting · Research · Media Ethics' },
      { name: 'Film Director/Editor',        skills: 'Cinematography · Post-production · Scripting' },
      { name: 'Public Relations Specialist', skills: 'Crisis Comm · Media Relations' },
      { name: 'Digital Content Creator',     skills: 'Video Editing · Audience Engagement' },
    ],
  },
};

/* =====================================================
   APP STATE
   ===================================================== */

const state = {
  selectedStreamId:   null,
  selectedStreamName: '',
  quizStreamId:       null,   /* may differ from selectedStreamId for PCMB-CS fork */
  questions:          [],
  currentIndex:       0,
  answers:            {},
};

/* =====================================================
   SCREEN HELPERS
   ===================================================== */

const screens = {
  landing:  document.getElementById('screen-landing'),
  stream:   document.getElementById('screen-stream'),
  quiz:     document.getElementById('screen-quiz'),
  loading:  document.getElementById('screen-loading'),
  result:   document.getElementById('screen-result'),
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  window.scrollTo(0, 0);
}

function showToast(msg, duration = 3500) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* =====================================================
   LANDING
   ===================================================== */

document.getElementById('btn-start').addEventListener('click', () => {
  showScreen('stream');
});

/* =====================================================
   STREAM SELECTION
   ===================================================== */

document.getElementById('btn-back-stream').addEventListener('click', () => {
  showScreen('landing');
});

document.querySelectorAll('.stream-card').forEach(card => {
  card.addEventListener('click', async () => {
    document.querySelectorAll('.stream-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');

    state.selectedStreamId   = parseInt(card.dataset.streamId);
    state.selectedStreamName = card.dataset.streamName;

    await new Promise(r => setTimeout(r, 220));

    /* PCMB gets the fork modal; everything else loads directly */
    if (state.selectedStreamId === 2) {
      showModal();
    } else {
      state.quizStreamId = state.selectedStreamId;
      await loadQuiz();
    }
  });
});

/* =====================================================
   PCMB FORK MODAL
   ===================================================== */

const modalOverlay = document.getElementById('modal-overlay');

function showModal() {
  modalOverlay.classList.remove('hidden');
}

function hideModal() {
  modalOverlay.classList.add('hidden');
}

/* Biology path → use PCMB questions (stream 2) */
document.getElementById('fork-biology').addEventListener('click', async () => {
  hideModal();
  state.quizStreamId = 2;
  state.selectedStreamName = 'PCMB · Biology';
  await loadQuiz();
});

/* CS exploration → use PCMC questions (stream 1) */
document.getElementById('fork-cs').addEventListener('click', async () => {
  hideModal();
  state.quizStreamId = 1;
  state.selectedStreamName = 'PCMB · CS Exploration';
  await loadQuiz();
});

/* Cancel — back to stream selection */
document.getElementById('modal-cancel').addEventListener('click', () => {
  hideModal();
  document.querySelectorAll('.stream-card').forEach(c => c.classList.remove('selected'));
});

/* Close on overlay backdrop click */
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    hideModal();
    document.querySelectorAll('.stream-card').forEach(c => c.classList.remove('selected'));
  }
});

/* =====================================================
   FETCH QUESTIONS
   ===================================================== */

async function loadQuiz() {
  showScreen('loading');

  try {
    const res = await fetch(`${API_BASE}/questions/${state.quizStreamId}`);

    if (!res.ok) throw new Error(`Server responded with ${res.status}`);

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No questions returned for this stream.');
    }

    state.questions    = data;
    state.currentIndex = 0;
    state.answers      = {};

    renderQuiz();
    showScreen('quiz');

  } catch (err) {
    console.error('Failed to load questions:', err);
    showToast('Could not load questions. Is the server running on port 8080?');
    showScreen('stream');
  }
}

/* =====================================================
   QUIZ RENDER
   ===================================================== */

function renderQuiz() {
  const q     = state.questions[state.currentIndex];
  const total = state.questions.length;
  const idx   = state.currentIndex;

  document.getElementById('quiz-stream-badge').textContent  = state.selectedStreamName;
  document.getElementById('progress-fill').style.width      = `${((idx + 1) / total) * 100}%`;
  document.getElementById('progress-label').textContent     = `${idx + 1} / ${total}`;
  document.getElementById('q-counter').textContent          = `Question ${idx + 1}`;
  document.getElementById('q-text').textContent             = q.question || q.questionText || '';

  const list    = document.getElementById('options-list');
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  list.innerHTML = '';

  (q.options || []).forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className         = 'option-btn';
    btn.dataset.optId     = opt.opt_id;
    btn.dataset.careerTag = opt.career_tag || opt.careerTag || '';
    btn.dataset.points    = opt.points || 0;

    const saved = state.answers[q.q_id];
    if (saved && saved.opt_id === opt.opt_id) btn.classList.add('selected');

    btn.innerHTML = `
      <div class="option-letter">${letters[i] || i + 1}</div>
      <span class="option-text">${opt.text || opt.optionText || ''}</span>
    `;

    btn.addEventListener('click', () => selectOption(btn, q.q_id));
    list.appendChild(btn);
  });

  updateNavButtons();
}

function selectOption(clickedBtn, qId) {
  document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  clickedBtn.classList.add('selected');

  state.answers[qId] = {
    opt_id:    parseInt(clickedBtn.dataset.optId),
    careerTag: clickedBtn.dataset.careerTag,
    points:    parseInt(clickedBtn.dataset.points) || 0,
  };

  updateNavButtons();
}

function updateNavButtons() {
  const q        = state.questions[state.currentIndex];
  const answered = !!state.answers[q.q_id];
  const isFirst  = state.currentIndex === 0;
  const isLast   = state.currentIndex === state.questions.length - 1;

  document.getElementById('btn-prev').disabled = isFirst;
  document.getElementById('btn-next').disabled = !answered;

  const nextBtn = document.getElementById('btn-next');
  nextBtn.innerHTML = isLast && answered
    ? 'Submit <span class="btn-arrow">✓</span>'
    : 'Next <span class="btn-arrow">→</span>';
}

document.getElementById('btn-prev').addEventListener('click', () => {
  if (state.currentIndex > 0) { state.currentIndex--; renderQuiz(); }
});

document.getElementById('btn-next').addEventListener('click', () => {
  if (state.currentIndex === state.questions.length - 1) {
    submitQuiz();
  } else {
    state.currentIndex++;
    renderQuiz();
  }
});

document.getElementById('btn-back-quiz').addEventListener('click', () => {
  if (confirm('Go back to stream selection? Your progress will be lost.')) {
    showScreen('stream');
  }
});

/* =====================================================
   SUBMIT & SCORE
   ===================================================== */

async function submitQuiz() {
  showScreen('loading');
  await new Promise(r => setTimeout(r, 1200));

  const scores = {};
  Object.values(state.answers).forEach(ans => {
    if (!ans.careerTag) return;
    scores[ans.careerTag] = (scores[ans.careerTag] || 0) + ans.points;
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    showToast('Could not calculate result. Please try again.');
    showScreen('quiz');
    return;
  }

  displayResult(sorted);
  showScreen('result');
}

/* =====================================================
   RESULT DISPLAY
   ===================================================== */

function displayResult(sorted) {
  const [topTag, topScore] = sorted[0];
  const careerInfo = CAREER_DATA[topTag];

  /* Fallback if tag isn't in our data */
  const fieldName  = careerInfo ? careerInfo.field  : topTag;
  const degreeLine = careerInfo ? careerInfo.degree : 'Relevant undergraduate degree';

  /* Hero */
  document.getElementById('result-career-title').textContent = fieldName;
  document.getElementById('result-career-desc').textContent  =
    `Your answers show a strong alignment with ${fieldName}. Your thinking style, interests, and problem-solving approach suit this career path well.`;
  document.getElementById('result-degree-pill').textContent  = '🎓 ' + degreeLine;

  /* Confetti */
  launchConfetti();

  /* Score bars */
  const barsContainer = document.getElementById('score-bars');
  barsContainer.innerHTML = '';

  sorted.forEach(([tag, score], index) => {
    const pct   = topScore > 0 ? Math.round((score / topScore) * 100) : 0;
    const label = CAREER_DATA[tag] ? CAREER_DATA[tag].field : tag;
    const isTop = index === 0;

    const row = document.createElement('div');
    row.className = 'score-row';
    row.style.animationDelay = `${index * 70}ms`;
    row.innerHTML = `
      <div class="score-label">${label}</div>
      <div class="score-track">
        <div class="score-bar ${isTop ? 'top' : ''}"
             style="width:${pct}%; animation-delay:${180 + index * 55}ms;"></div>
      </div>
      <div class="score-val">${score}pt</div>
    `;
    barsContainer.appendChild(row);
  });

  /* Job roles */
  const rolesGrid = document.getElementById('job-roles-grid');
  const rolesSub  = document.getElementById('job-roles-sub');
  rolesGrid.innerHTML = '';

  if (careerInfo && careerInfo.roles) {
    rolesSub.textContent = `Here are 4 specific roles within ${fieldName} and what you'll need to get there.`;

    careerInfo.roles.forEach((role, i) => {
      const card = document.createElement('div');
      card.className = 'role-card';
      card.style.animationDelay = `${300 + i * 90}ms`;

      /* Split skill string into individual chips */
      const skillChips = role.skills
        .split('·')
        .map(s => s.trim())
        .filter(Boolean)
        .map(s => `<span class="skill-chip">${s}</span>`)
        .join('');

      card.innerHTML = `
        <div class="role-number">ROLE 0${i + 1}</div>
        <div class="role-name">${role.name}</div>
        <div class="role-degree-label">Degree / Qualification</div>
        <div class="role-degree">${degreeLine}</div>
        <div class="role-skills-label">Key Skills</div>
        <div class="role-skills">${skillChips}</div>
      `;

      rolesGrid.appendChild(card);
    });

    document.getElementById('job-roles-section').style.display = 'block';
  } else {
    document.getElementById('job-roles-section').style.display = 'none';
  }
}

/* =====================================================
   CONFETTI
   ===================================================== */

function launchConfetti() {
  const area   = document.getElementById('confetti-area');
  area.innerHTML = '';
  const colors = ['#C8943A', '#2A6B65', '#C94F3A', '#F0DDB4', '#D4EDEB', '#ffffff'];

  for (let i = 0; i < 44; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width: ${5 + Math.random() * 6}px;
      height: ${5 + Math.random() * 6}px;
      animation-duration: ${1.5 + Math.random() * 2}s;
      animation-delay: ${Math.random() * 0.9}s;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    area.appendChild(piece);
  }
}

/* =====================================================
   RETAKE / CHANGE STREAM
   ===================================================== */

document.getElementById('btn-retake').addEventListener('click', () => {
  state.currentIndex = 0;
  state.answers = {};
  renderQuiz();
  showScreen('quiz');
});

document.getElementById('btn-change-stream').addEventListener('click', () => {
  document.querySelectorAll('.stream-card').forEach(c => c.classList.remove('selected'));
  state.selectedStreamId   = null;
  state.selectedStreamName = '';
  state.quizStreamId       = null;
  state.questions          = [];
  state.answers            = {};
  showScreen('stream');
});