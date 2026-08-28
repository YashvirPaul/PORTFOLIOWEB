/* ============================================================
   YASHVIR PAUL PORTFOLIO — CORE APPLICATION JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const finePointer = matchMedia('(pointer:fine)').matches;
  const prefersReduced = matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ============================================================
     1. SIGNATURE WARM LUXURY CREAM THEME (LOCKED)
     ============================================================ */
  const htmlRoot = document.documentElement;
  htmlRoot.setAttribute('data-theme', 'light');

  /* ============================================================
     2. AMBIENT BACKGROUND INTERACTIVE CANVAS MESH
     ============================================================ */
  const ambientCanvas = document.getElementById('ambientCanvas');
  if (ambientCanvas) {
    const ctx = ambientCanvas.getContext('2d');
    let width, height;
    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, tx: window.innerWidth / 2, ty: window.innerHeight / 2 };

    function resizeCanvas() {
      width = ambientCanvas.width = window.innerWidth;
      height = ambientCanvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    window.addEventListener('mousemove', (e) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    });

    const orbs = [
      { x: width * 0.2, y: height * 0.3, vx: 0.4, vy: 0.3, r: 280, color: 'rgba(200, 241, 79, 0.08)' },
      { x: width * 0.8, y: height * 0.6, vx: -0.3, vy: -0.4, r: 340, color: 'rgba(156, 203, 30, 0.06)' },
      { x: width * 0.5, y: height * 0.8, vx: 0.2, vy: -0.2, r: 240, color: 'rgba(230, 245, 180, 0.05)' }
    ];

    function drawAmbient() {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse lerp
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;

      orbs.forEach((orb, i) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -100 || orb.x > width + 100) orb.vx *= -1;
        if (orb.y < -100 || orb.y > height + 100) orb.vy *= -1;

        const isDark = htmlRoot.getAttribute('data-theme') === 'dark';
        const grad = ctx.createRadialGradient(
          orb.x + (mouse.x - width / 2) * 0.05 * (i + 1),
          orb.y + (mouse.y - height / 2) * 0.05 * (i + 1),
          10,
          orb.x,
          orb.y,
          orb.r
        );

        if (isDark) {
          grad.addColorStop(0, 'rgba(210, 248, 72, 0.08)');
          grad.addColorStop(0.6, 'rgba(164, 224, 24, 0.02)');
          grad.addColorStop(1, 'transparent');
        } else {
          grad.addColorStop(0, 'rgba(200, 241, 79, 0.12)');
          grad.addColorStop(0.5, 'rgba(156, 203, 30, 0.04)');
          grad.addColorStop(1, 'transparent');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!prefersReduced) {
        requestAnimationFrame(drawAmbient);
      }
    }
    drawAmbient();
  }

  /* ============================================================
     3. TOAST NOTIFICATION UTILITY
     ============================================================ */
  const toastContainer = document.getElementById('toastContainer');
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast glass';
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s var(--ease)';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /* ============================================================
     4. WEBAUDIO SOUND SYNTHESIZER
     ============================================================ */
  let audioCtx = null;
  let isMuted = localStorage.getItem('yashvir_muted') === 'true';
  const sndBtn = document.getElementById('sndBtn');

  if (sndBtn) {
    if (isMuted) sndBtn.classList.add('muted');
    sndBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      localStorage.setItem('yashvir_muted', isMuted);
      sndBtn.classList.toggle('muted', isMuted);
      showToast(isMuted ? 'Sound muted' : 'Sound active');
      if (!isMuted) tone(660, 0.08, 'sine', 0.04);
    });
  }

  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function tone(freq, duration, type = 'sine', gainVal = 0.04, delay = 0) {
    if (isMuted || prefersReduced) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + delay;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(gainVal, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + duration + 0.02);
    } catch (e) { }
  }

  const hoverSound = () => tone(1150, 0.08, 'sine', 0.02);
  const clickSound = () => {
    tone(640, 0.09, 'sine', 0.035);
    tone(960, 0.12, 'sine', 0.02, 0.04);
  };

  let heroChordPlayed = false;
  function playHeroChord() {
    if (heroChordPlayed) return;
    heroChordPlayed = true;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
      tone(freq, 1.2, 'sine', 0.02, idx * 0.08);
    });
  }

  window.addEventListener('pointerdown', playHeroChord, { once: true });
  window.addEventListener('keydown', playHeroChord, { once: true });

  document.querySelectorAll('.snd-hover').forEach(el => el.addEventListener('mouseenter', hoverSound));
  document.querySelectorAll('.snd-click, .btn').forEach(el => el.addEventListener('click', clickSound));

  /* ============================================================
     5. FLOATING GLASS NAVIGATION & SCROLL TRACKING
     ============================================================ */
  const nav = document.getElementById('nav');
  const navLinks = [...document.querySelectorAll('#navLinks a')];
  const navPill = document.getElementById('navPill');

  window.addEventListener('scroll', () => {
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 40);
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(window.scrollY / (totalScroll || 1), 1);
      nav.style.setProperty('--glint', `${-120 + progress * 480}%`);
    }
  }, { passive: true });

  function movePill(targetLink) {
    if (!navPill || !targetLink) {
      if (navPill) navPill.classList.remove('on');
      return;
    }
    navPill.style.left = `${targetLink.offsetLeft}px`;
    navPill.style.width = `${targetLink.offsetWidth}px`;
    navPill.classList.add('on');
    navLinks.forEach(a => a.classList.toggle('active', a === targetLink));
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => movePill(link));
  });

  const observedSectionIds = ['services', 'simulator', 'calculator', 'architecture', 'about', 'faq'];
  const secObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
        const id = entry.target.id;
        const matchingLink = navLinks.find(a => a.getAttribute('href') === `#${id}`);
        if (matchingLink) movePill(matchingLink);
      }
    });
  }, { threshold: [0.3, 0.6] });

  observedSectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) secObserver.observe(el);
  });

  // Mobile Drawer Menu
  const burger = document.getElementById('burger');
  const mmenu = document.getElementById('mmenu');
  if (burger && mmenu) {
    burger.addEventListener('click', () => mmenu.classList.toggle('open'));
    mmenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mmenu.classList.remove('open')));
  }

  /* ============================================================
     6. REVEAL ON SCROLL OBSERVER
     ============================================================ */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.rv').forEach((el, idx) => {
    el.style.transitionDelay = `${(idx % 4) * 75}ms`;
    revealObserver.observe(el);
  });

  /* ============================================================
     7. CUSTOM SMOOTH CURSOR (DESKTOP)
     ============================================================ */
  if (finePointer) {
    const cursor = document.getElementById('cursor');
    if (cursor) {
      window.addEventListener('mousemove', e => {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      });

      document.querySelectorAll('a, button, .svc, .arch-node, .stat, .voice-card, input, select, textarea').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('big'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
      });
    }
  }

  // Magnetic Button Physics
  if (finePointer && !prefersReduced) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.26}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ============================================================
     8. LIVE AI VOICE CALL SIMULATOR ENGINE
     ============================================================ */
  const scenarios = {
    clinic: {
      name: 'Aria — Dental Clinic Receptionist',
      welcome: "Hello! Thank you for calling Beverly Hills Dental Care. I'm Aria, Dr. Miller's AI assistant. Are you calling to book a routine cleaning or discuss a specific dental consultation?",
      prompts: [
        { q: "I'd like to book an appointment this Thursday at 4 PM", a: "I have Thursday at 4:00 PM available with Dr. Miller for a complete oral examination and cleaning. May I confirm your full name and contact number?", data: "📅 Appt: Thursday 4:00 PM | Dr. Miller" },
        { q: "How much does a dental cleaning and whitening package cost?", a: "Our comprehensive hygiene and sonic whitening package is $280, which includes dental X-rays and polish. Would you like me to reserve a spot for you?", data: "💰 Inquiry: Cleaning + Whitening ($280)" },
        { q: "Do you accept Delta Dental insurance?", a: "Yes, we are in-network with Delta Dental Premier and PPO plans! We process claims directly so your out-of-pocket is minimized. Shall we get you scheduled?", data: "🛡️ Insurance: Delta Dental Confirmed" }
      ]
    },
    realestate: {
      name: 'Julian — Luxury Property Advisor',
      welcome: "Good afternoon! You've reached Kensington Estate Partners. I'm Julian. Are you inquiring about our panoramic penthouse collection or scheduling a private site tour?",
      prompts: [
        { q: "I want to schedule a private tour for the 3BHK Penthouse", a: "Superb choice! The 3,400 sq.ft Sky Penthouse is open for VIP previews this Saturday between 11 AM and 3 PM. Shall I reserve a private walkthrough for you?", data: "🏢 Tour: Sky Penthouse (Saturday 11 AM)" },
        { q: "What is the starting price range and payment plan?", a: "Units begin at $1.85M with a flexible 20/80 developer-backed milestone payment plan. I can immediately dispatch the floorplans to your WhatsApp at 9394389413. What is your name?", data: "💵 Pricing: $1.85M (20/80 Plan)" },
        { q: "Can you send the complete project brochure to my WhatsApp?", a: "Certainly! I have generated the high-res master brochure link. You can also chat directly with Yashvir on WhatsApp at 9394389413 for direct developer discounts.", data: "📲 Dispatch: WhatsApp Brochure Requested" }
      ]
    },
    restaurant: {
      name: 'Chloe — Le Mirabelle Bistro Concierge',
      welcome: "Bonsoir! Welcome to Le Mirabelle Bistro. I'm Chloe. Would you like to reserve a table for an upcoming evening or ask about our seasonal truffle tasting menu?",
      prompts: [
        { q: "Can I book a table for 4 guests this Saturday at 8:00 PM?", a: "I have a lovely booth available in our main dining room at 8:00 PM this Saturday for 4 guests. Shall I confirm this reservation under your name?", data: "🍽️ Table for 4 | Saturday 8:00 PM" },
        { q: "Do you offer vegan and gluten-free tasting menus?", a: "Yes! Our chef curates a dedicated 5-course plant-based and gluten-free tasting menu with optional organic wine pairings. Would anyone in your party have additional allergies?", data: "🌱 Dietary: Vegan/GF Tasting Menu" },
        { q: "Can we request outdoor heated patio seating?", a: "Absolutely. I will add a special seating request for our garden patio with overhead infrared heating. Would you like me to lock this in?", data: "🌿 Seating: Heated Garden Patio" }
      ]
    },
    b2b: {
      name: 'Leo — Growth Advisor, Yashvir Paul Studio',
      welcome: "Hi! Welcome to Yashvir Paul AI & Media Studio. I'm Leo. Are you looking to scale your business with AI voice agents, Meta & Google Ads, or viral video editing?",
      prompts: [
        { q: "Can you scale our Meta & Google Ads campaigns?", a: "Absolutely. We build full-funnel high-ROAS paid ad campaigns with viral creatives, retention-optimized video editing, and automated lead capture. What is your current monthly ad budget?", data: "📈 Paid Media: Meta & Google Ads Scaling" },
        { q: "What type of video editing do you specialize in?", a: "We produce scroll-stopping short-form content (Reels, TikToks, Shorts) and high-retention long-form YouTube videos with motion graphics, viral hooks, and dynamic pacing. Want to see our portfolio?", data: "🎬 Video Editing: Short & Long Form" },
        { q: "What are the terms for partnering directly with Yashvir?", a: "You partner 1-on-1 directly with Yashvir Paul with priority turnaround, transparent milestone pricing, and direct WhatsApp communication at 9394389413.", data: "🏆 Status: Direct Partnership Inquired" }
      ]
    }
  };

  let currentScenarioKey = 'clinic';
  let isCallActive = false;
  let callTimerInterval = null;
  let callSeconds = 0;

  const agentNameDisplay = document.getElementById('agentNameDisplay');
  const callStatusText = document.getElementById('callStatusText');
  const callTimer = document.getElementById('callTimer');
  const startCallBtn = document.getElementById('startCallBtn');
  const endCallBtn = document.getElementById('endCallBtn');
  const chipsList = document.getElementById('chipsList');
  const transcriptBody = document.getElementById('transcriptBody');
  const liveDot = document.getElementById('liveDot');
  const extractedDataBadge = document.getElementById('extractedDataBadge');
  const pulseRing = document.getElementById('pulseRing');

  // Voice Waveform Canvas
  const voiceCanvas = document.getElementById('voiceCanvas');
  const vCtx = voiceCanvas ? voiceCanvas.getContext('2d') : null;
  let isAgentSpeaking = false;

  function renderVoiceWave() {
    if (!vCtx) return;
    vCtx.clearRect(0, 0, voiceCanvas.width, voiceCanvas.height);
    const bars = 24;
    const barWidth = 4;
    const spacing = (voiceCanvas.width - bars * barWidth) / (bars - 1);

    for (let i = 0; i < bars; i++) {
      let h = 8;
      if (isCallActive) {
        if (isAgentSpeaking) {
          h = 10 + Math.sin(Date.now() * 0.015 + i * 0.4) * 26 + Math.cos(Date.now() * 0.008 + i) * 14;
        } else {
          h = 6 + Math.sin(Date.now() * 0.004 + i * 0.2) * 4;
        }
      }
      h = Math.max(4, Math.min(60, h));
      const x = i * (barWidth + spacing);
      const y = (voiceCanvas.height - h) / 2;

      vCtx.fillStyle = isAgentSpeaking ? '#9CCB1E' : (isCallActive ? '#56564F' : '#9C9C94');
      vCtx.beginPath();
      vCtx.roundRect(x, y, barWidth, h, 2);
      vCtx.fill();
    }
    requestAnimationFrame(renderVoiceWave);
  }
  renderVoiceWave();

  function speakText(text, callback) {
    isAgentSpeaking = true;
    if (pulseRing) pulseRing.classList.add('active');

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.02;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Siri')));
      if (naturalVoice) utterance.voice = naturalVoice;

      utterance.onend = () => {
        isAgentSpeaking = false;
        if (pulseRing) pulseRing.classList.remove('active');
        if (callback) callback();
      };
      utterance.onerror = () => {
        isAgentSpeaking = false;
        if (pulseRing) pulseRing.classList.remove('active');
        if (callback) callback();
      };
      window.speechSynthesis.speak(utterance);
    } else {
      const duration = Math.min(5000, Math.max(1800, text.length * 60));
      setTimeout(() => {
        isAgentSpeaking = false;
        if (pulseRing) pulseRing.classList.remove('active');
        if (callback) callback();
      }, duration);
    }
  }

  function renderScenarioPrompts() {
    const sc = scenarios[currentScenarioKey];
    if (agentNameDisplay) agentNameDisplay.textContent = sc.name;
    if (chipsList) {
      chipsList.innerHTML = '';
      sc.prompts.forEach((item) => {
        const btn = document.createElement('button');
        btn.className = 'prompt-btn snd-click';
        btn.textContent = `"${item.q}"`;
        btn.disabled = !isCallActive;
        btn.addEventListener('click', () => handleUserPrompt(item));
        chipsList.appendChild(btn);
      });
    }
  }

  function handleUserPrompt(item) {
    if (!isCallActive || isAgentSpeaking) return;

    appendTranscript('user', item.q);
    document.querySelectorAll('.prompt-btn').forEach(b => b.disabled = true);
    tone(880, 0.06, 'sine', 0.03);

    setTimeout(() => {
      appendTranscript('agent', item.a);
      if (extractedDataBadge && item.data) {
        extractedDataBadge.textContent = `Extracted: ${item.data}`;
        extractedDataBadge.style.color = 'var(--lime-deep)';
      }
      speakText(item.a, () => {
        document.querySelectorAll('.prompt-btn').forEach(b => b.disabled = false);
      });
    }, 450);
  }

  function appendTranscript(sender, text) {
    if (!transcriptBody) return;
    const msg = document.createElement('div');
    msg.className = `transcript-msg ${sender}`;
    msg.innerHTML = `<b>${sender === 'agent' ? 'AI Agent' : 'You'}:</b> ${text}`;
    transcriptBody.appendChild(msg);
    transcriptBody.scrollTop = transcriptBody.scrollHeight;
  }

  function startCall() {
    isCallActive = true;
    callSeconds = 0;
    if (startCallBtn) startCallBtn.style.display = 'none';
    if (endCallBtn) endCallBtn.style.display = 'inline-flex';
    if (callStatusText) {
      callStatusText.textContent = '● In Call (Connected)';
      callStatusText.style.color = '#10B981';
    }
    if (liveDot) {
      liveDot.textContent = 'CONNECTED';
      liveDot.classList.add('active');
    }

    tone(440, 0.15, 'sine', 0.05);
    tone(880, 0.25, 'sine', 0.05, 0.18);

    callTimerInterval = setInterval(() => {
      callSeconds++;
      const mins = String(Math.floor(callSeconds / 60)).padStart(2, '0');
      const secs = String(callSeconds % 60).padStart(2, '0');
      if (callTimer) callTimer.textContent = `${mins}:${secs}`;
    }, 1000);

    renderScenarioPrompts();
    document.querySelectorAll('.prompt-btn').forEach(b => b.disabled = true);

    if (transcriptBody) {
      transcriptBody.innerHTML = '';
    }

    const sc = scenarios[currentScenarioKey];
    appendTranscript('agent', sc.welcome);
    speakText(sc.welcome, () => {
      document.querySelectorAll('.prompt-btn').forEach(b => b.disabled = false);
    });
  }

  function endCall() {
    isCallActive = false;
    isAgentSpeaking = false;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    clearInterval(callTimerInterval);

    if (startCallBtn) startCallBtn.style.display = 'inline-flex';
    if (endCallBtn) endCallBtn.style.display = 'none';
    if (callStatusText) {
      callStatusText.textContent = 'Call Ended';
      callStatusText.style.color = 'var(--ink-60)';
    }
    if (liveDot) {
      liveDot.textContent = 'IDLE';
      liveDot.classList.remove('active');
    }
    if (pulseRing) pulseRing.classList.remove('active');

    tone(300, 0.2, 'sawtooth', 0.04);
    renderScenarioPrompts();
    appendTranscript('system', '✦ Call completed. Inbound telemetry logged.');
  }

  if (startCallBtn) startCallBtn.addEventListener('click', startCall);
  if (endCallBtn) endCallBtn.addEventListener('click', endCall);

  // Scenario Buttons Switcher
  document.querySelectorAll('.scenario-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.scenario-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentScenarioKey = btn.getAttribute('data-scenario');
      if (isCallActive) endCall();
      renderScenarioPrompts();
    });
  });

  renderScenarioPrompts();

  /* ============================================================
     9. ROI & REVENUE RECOVERY CALCULATOR ENGINE
     ============================================================ */
  const missedCallsInput = document.getElementById('missedCallsInput');
  const dealValueInput = document.getElementById('dealValueInput');
  const hoursSpentInput = document.getElementById('hoursSpentInput');

  const missedCallsVal = document.getElementById('missedCallsVal');
  const dealValueVal = document.getElementById('dealValueVal');
  const hoursSpentVal = document.getElementById('hoursSpentVal');

  const recoveredRevDisplay = document.getElementById('recoveredRevDisplay');
  const hoursSavedDisplay = document.getElementById('hoursSavedDisplay');
  const roiMultiplierDisplay = document.getElementById('roiMultiplierDisplay');
  const calcApplyBtn = document.getElementById('calcApplyBtn');

  function calculateROI() {
    if (!missedCallsInput || !dealValueInput || !hoursSpentInput) return;

    const calls = parseInt(missedCallsInput.value, 10);
    const dealVal = parseInt(dealValueInput.value, 10);
    const hours = parseInt(hoursSpentInput.value, 10);

    if (missedCallsVal) missedCallsVal.textContent = `${calls} calls`;
    if (dealValueVal) dealValueVal.textContent = `$${dealVal.toLocaleString()}`;
    if (hoursSpentVal) hoursSpentVal.textContent = `${hours} hrs`;

    const recoveredDealsPerMonth = calls * 0.35;
    const annualRecoveredRevenue = Math.round(recoveredDealsPerMonth * dealVal * 12);
    const annualHoursSaved = Math.round(hours * 52);
    const estimatedCost = 3000;
    const roiMultiplier = Math.max(3.5, (annualRecoveredRevenue / estimatedCost)).toFixed(1);

    if (recoveredRevDisplay) recoveredRevDisplay.textContent = annualRecoveredRevenue.toLocaleString();
    if (hoursSavedDisplay) hoursSavedDisplay.textContent = `${annualHoursSaved.toLocaleString()} hrs`;
    if (roiMultiplierDisplay) roiMultiplierDisplay.textContent = `${roiMultiplier}x`;
  }

  [missedCallsInput, dealValueInput, hoursSpentInput].forEach(inp => {
    if (inp) inp.addEventListener('input', calculateROI);
  });
  calculateROI();

  if (calcApplyBtn) {
    calcApplyBtn.addEventListener('click', () => {
      const volInput = document.getElementById('fvol');
      if (volInput && missedCallsInput) {
        volInput.value = `~${missedCallsInput.value} missed calls / month (Est. value: $${dealValueInput.value})`;
      }
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      showToast("Calculated numbers auto-filled into inquiry form!");
    });
  }

  /* ============================================================
     10. SYSTEM ARCHITECTURE INTERACTIVE NODE INSPECTOR
     ============================================================ */
  const archSteps = {
    1: {
      title: "Step 01: Omnichannel Ingestion Trigger",
      tag: "Latency: <50ms",
      desc: "Incoming calls route via Twilio SIP trunking or Meta Ad lead forms hit our custom webhook. Payloads are verified and streamed directly to our low-latency buffer.",
      code: `{\n  "event": "inbound_trigger",\n  "channel": "sip_twilio_vapi",\n  "caller_id": "+91 9394389413",\n  "status": "stream_connected",\n  "sample_rate": "16000Hz"\n}`
    },
    2: {
      title: "Step 02: Neural Reasoning & Extraction Layer",
      tag: "Latency: <200ms",
      desc: "Real-time speech-to-text (Deepgram Nova-2) pipes tokens into GPT-4o / Claude 3.5. Guardrails validate parameters (dates, intent, budget) and generate natural conversational responses.",
      code: `{\n  "intent": "appointment_booking",\n  "sentiment": "high_intent",\n  "extracted_parameters": {\n    "date": "2026-09-03T16:00:00Z",\n    "service": "Oral Hygiene & Whitening",\n    "client_contact": "9394389413"\n  }\n}`
    },
    3: {
      title: "Step 03: Autonomous Execution Engine",
      tag: "Latency: <150ms",
      desc: "Custom n8n nodes verify slot availability against Google Calendar/Outlook APIs, format customer records, and generate dynamic calendar hold events.",
      code: `{\n  "action": "calendar_slot_reserve",\n  "calendar_id": "yashvir_primary",\n  "hold_token": "hold_98a7bc21",\n  "status": "confirmed"\n}`
    },
    4: {
      title: "Step 04: Closed Outcome & Omnichannel Telemetry",
      tag: "Instant Delivery",
      desc: "An SMS confirmation + WhatsApp reminder is dispatched to the client. Simultaneously, a lead record is updated in CRM and your Slack channel is notified.",
      code: `{\n  "outcome": "meeting_locked",\n  "whatsapp_confirmation": "sent",\n  "crm_record_id": "lead_38402",\n  "slack_alert": "success"\n}`
    }
  };

  document.querySelectorAll('.arch-node').forEach(node => {
    node.addEventListener('click', () => {
      document.querySelectorAll('.arch-node').forEach(n => n.classList.remove('active'));
      node.classList.add('active');
      const step = node.getAttribute('data-step');
      const data = archSteps[step];

      if (data) {
        document.getElementById('inspectorTitle').textContent = data.title;
        document.getElementById('inspectorTag').textContent = data.tag;
        document.getElementById('inspectorDesc').textContent = data.desc;
        document.getElementById('inspectorCode').textContent = data.code;
        tone(750, 0.06, 'sine', 0.02);
      }
    });
  });

  /* ============================================================
     11. VOICE SOUNDBOARD PERSONA PLAYERS
     ============================================================ */
  document.querySelectorAll('.voice-play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-text');

      if (btn.classList.contains('playing')) {
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        btn.classList.remove('playing');
        btn.querySelector('span').textContent = 'Play Voice Sample';
        return;
      }

      document.querySelectorAll('.voice-play-btn').forEach(b => {
        b.classList.remove('playing');
        b.querySelector('span').textContent = 'Play Voice Sample';
      });

      btn.classList.add('playing');
      btn.querySelector('span').textContent = 'Playing...';

      speakText(text, () => {
        btn.classList.remove('playing');
        btn.querySelector('span').textContent = 'Play Voice Sample';
      });
    });
  });

  /* ============================================================
     12. FAQ ACCORDION
     ============================================================ */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (q && a) {
      q.addEventListener('click', () => {
        const isOpen = item.classList.toggle('open');
        a.style.maxHeight = isOpen ? `${a.scrollHeight}px` : '0px';
      });
    }
  });

  /* ============================================================
     13. CUSTOM PROFESSIONAL DROPDOWNS
     ============================================================ */
  document.querySelectorAll('.cselect').forEach(wrap => {
    const select = wrap.querySelector('select');
    if (!select) return;

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'cselect-trigger';
    trigger.innerHTML = `<span class="val">${select.options[select.selectedIndex]?.textContent || 'Select...'}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>`;

    const panel = document.createElement('div');
    panel.className = 'cselect-panel';

    [...select.options].forEach(opt => {
      if (opt.disabled) return;
      const row = document.createElement('div');
      row.className = 'cselect-opt';
      if (opt.dataset.sub) {
        row.innerHTML = `<b>${opt.textContent}</b><span>${opt.dataset.sub}</span>`;
      } else {
        row.textContent = opt.textContent;
      }
      row.addEventListener('click', () => {
        select.value = opt.value || opt.textContent;
        trigger.querySelector('.val').textContent = opt.textContent;
        wrap.classList.remove('open');
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });
      panel.appendChild(row);
    });

    wrap.appendChild(trigger);
    wrap.appendChild(panel);

    trigger.addEventListener('click', () => {
      document.querySelectorAll('.cselect.open').forEach(o => { if (o !== wrap) o.classList.remove('open'); });
      wrap.classList.toggle('open');
    });
  });

  document.addEventListener('click', (e) => {
    document.querySelectorAll('.cselect.open').forEach(w => {
      if (!w.contains(e.target)) w.classList.remove('open');
    });
  });

  /* ============================================================
     14. SMART CONTACT FORM & DIRECT WHATSAPP ROUTER
     ============================================================ */
  const leadForm = document.getElementById('leadForm');
  const whatsappDirectBtn = document.getElementById('whatsappDirectBtn');

  function getFormData(form) {
    return {
      name: form.name.value.trim() || 'Client',
      business: form.business.value.trim() || 'Brand/Company',
      category: form.category?.value || 'Industry',
      service: form.service?.value || 'AI & Media Solutions',
      volume: form.volume?.value.trim() || 'Not specified',
      contactPref: form.contact_pref?.value || 'WhatsApp',
      msg: form.msg?.value.trim() || 'Interested in AI systems, paid ads, or video editing.'
    };
  }

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const d = getFormData(leadForm);
      const subject = encodeURIComponent(`New Project Inquiry from ${d.name} (${d.business})`);
      const body = encodeURIComponent(
        `Name: ${d.name}\nCompany: ${d.business}\nNiche: ${d.category}\nService: ${d.service}\nEstimated Volume: ${d.volume}\nPreferred Contact: ${d.contactPref}\n\nProject Notes:\n${d.msg}`
      );

      location.href = `mailto:yashvirpaulyt@gmail.com?subject=${subject}&body=${body}`;
      showToast("Opening email client with pre-filled message...");
    });
  }

  if (whatsappDirectBtn && leadForm) {
    whatsappDirectBtn.addEventListener('click', () => {
      const d = getFormData(leadForm);
      const text = encodeURIComponent(
        `Hi Yashvir! I'd like to discuss a project for my business.\n\n👤 Name: ${d.name}\n🏢 Company: ${d.business} (${d.category})\n⚡ Service Needed: ${d.service}\n📊 Volume/Budget: ${d.volume}\n\nNotes: ${d.msg}`
      );
      window.open(`https://wa.me/919394389413?text=${text}`, '_blank');
      showToast("Connecting directly to Yashvir Paul on WhatsApp...");
    });
  }
});
