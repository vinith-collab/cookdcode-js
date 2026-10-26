/**
 * CookDcode - Challenge Workspace with Personalized AI Mentor (CTC Methodology)
 * Plain Vanilla JavaScript implementation replacing React.js
 */
import {
  PROBLEMS,
  USERS,
  getInitialProblemId,
  getInitialUser,
  getSavedProblemData,
  getInitialHintForProblem,
  getSectionHumanTouchPrompts
} from './problemsData.js';

// Application State
const state = {
  currentProblemId: getInitialProblemId(),
  currentUser: getInitialUser(),
  tokens: 10,
  sidebarOpen: false,
  profileDropdownOpen: false,
  autoSaveStatus: 'saved',

  inputs: {
    logic: '',
    recipe: '',
    ingredients: '',
    samplecode: ''
  },
  completed: {
    logic: false,
    recipe: false,
    ingredients: false,
    samplecode: false
  },
  openSections: {
    logic: true,
    recipe: false,
    ingredients: false,
    samplecode: false
  },
  stageFeedback: {
    logic: null,
    recipe: null,
    ingredients: null,
    samplecode: null
  },

  feedbackOpen: true,
  feedbackLoading: false,
  currentHint: null,
  activeHintSection: 'logic',
  userQuestion: '',
  lastStudentThought: '',
  currentHintLevel: 1,
  isSpeaking: false,
  deliveredHints: [],

  stageHelpCount: { logic: 0, recipe: 0, ingredients: 0, samplecode: 0 },
  stageAttemptCounts: { logic: 0, recipe: 0, ingredients: 0, samplecode: 0 },
  isGeneratingSectionHint: { logic: false, recipe: false, ingredients: false, samplecode: false },

  revealSection: null,
  showHistoryModal: false,
  historyList: [],
  showTestModal: false,
  testResults: null,
  runningTests: false,
  showCompletePopup: false,
  showResetConfirmModal: false
};

// Initialize Problem Data into State
function loadProblemData(problemId, user) {
  const data = getSavedProblemData(user.id, problemId);
  state.inputs = {
    logic: data?.logic || '',
    recipe: data?.recipe || '',
    ingredients: data?.ingredients || '',
    samplecode: data?.samplecode || ''
  };
  state.completed = {
    logic: !!data?.completedLogic,
    recipe: !!data?.completedRecipe,
    ingredients: !!data?.completedIngredients,
    samplecode: !!data?.completedSample
  };
  state.openSections = {
    logic: true,
    recipe: !!data?.completedLogic,
    ingredients: !!(data?.completedLogic && data?.completedRecipe),
    samplecode: !!(data?.completedLogic && data?.completedRecipe && data?.completedIngredients)
  };
  state.stageFeedback = {
    logic: data?.stageFeedback?.logic || null,
    recipe: data?.stageFeedback?.recipe || null,
    ingredients: data?.stageFeedback?.ingredients || null,
    samplecode: data?.stageFeedback?.samplecode || null
  };

  const initHint = getInitialHintForProblem(problemId);
  state.currentHint = initHint;
  state.currentHintLevel = initHint?.hintLevel || 1;
  state.activeHintSection = 'logic';
  state.userQuestion = '';
  state.lastStudentThought = '';
  state.deliveredHints = initHint?.hint ? [initHint.hint] : [];
  state.stageHelpCount = { logic: 0, recipe: 0, ingredients: 0, samplecode: 0 };
  state.stageAttemptCounts = { logic: 0, recipe: 0, ingredients: 0, samplecode: 0 };
}

// Toast System
function triggerToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const typeClasses = {
    success: 'bg-emerald-950/80 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50',
    error: 'bg-rose-950/80 border-rose-500/40 text-rose-200 shadow-rose-950/50',
    warning: 'bg-amber-950/80 border-amber-500/40 text-amber-200 shadow-amber-950/50',
    info: 'bg-indigo-950/80 border-indigo-500/40 text-indigo-200 shadow-indigo-950/50'
  };
  const iconClasses = {
    success: 'fa-check-circle text-emerald-400',
    error: 'fa-times-circle text-rose-400',
    warning: 'fa-exclamation-triangle text-amber-400',
    info: 'fa-info-circle text-indigo-400'
  };

  toast.className = `px-6 py-3 rounded-full shadow-2xl backdrop-blur-2xl border flex items-center gap-3 font-semibold text-sm transition-all duration-300 pointer-events-auto ${typeClasses[type] || typeClasses.info}`;
  toast.innerHTML = `<i class="fas ${iconClasses[type] || iconClasses.info}"></i><span>${message}</span>`;

  container.innerHTML = '';
  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode === container) {
      toast.remove();
    }
  }, 3500);
}

// Append Example Helper
function appendBelowExisting(existing, addition) {
  const current = (existing || '').trimEnd();
  const toAdd = (addition || '').trim();
  if (!current) return toAdd;
  if (!toAdd) return current;

  const currentLinesLower = current.split('\n').map(l => l.trim().toLowerCase());
  const newLines = toAdd.split('\n').filter(line => {
    const trimmed = line.trim().toLowerCase();
    return trimmed && !currentLinesLower.includes(trimmed);
  });

  if (newLines.length === 0) {
    return `${current}\n${toAdd}`;
  }
  return `${current}\n${newLines.join('\n')}`;
}

// Unlock sequence calculation
function isUnlocked(section) {
  if (section === 'logic') return true;
  if (section === 'recipe') return state.completed.logic;
  if (section === 'ingredients') return state.completed.logic && state.completed.recipe;
  if (section === 'samplecode') return state.completed.logic && state.completed.recipe && state.completed.ingredients;
  return false;
}

// Save Progress Helper
function saveCurrentProgress(isManual = false) {
  try {
    const payload = {
      logic: state.inputs.logic,
      recipe: state.inputs.recipe,
      ingredients: state.inputs.ingredients,
      samplecode: state.inputs.samplecode,
      completedLogic: state.completed.logic,
      completedRecipe: state.completed.recipe,
      completedIngredients: state.completed.ingredients,
      completedSample: state.completed.samplecode,
      stageFeedback: state.stageFeedback,
      updatedAt: Date.now()
    };
    localStorage.setItem(`cookdcode_${state.currentUser.id}_${state.currentProblemId}`, JSON.stringify(payload));
    localStorage.setItem('cookdcode_active_problem_id', state.currentProblemId);
    localStorage.setItem('cookdcode_active_user_id', state.currentUser.id);

    state.autoSaveStatus = 'saved';
    renderAutoSaveStatus();

    if (isManual) {
      triggerToast('Progress successfully saved in glass container!', 'success');
    }
  } catch (e) {
    console.error('Error saving progress:', e);
  }
}

let autoSaveTimer = null;
function scheduleAutoSave() {
  state.autoSaveStatus = 'saving';
  renderAutoSaveStatus();
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    saveCurrentProgress(false);
  }, 300);
}

// Render Functions
function renderAutoSaveStatus() {
  const dot = document.getElementById('nav-autosave-dot');
  const text = document.getElementById('nav-autosave-text');
  if (!dot || !text) return;

  if (state.autoSaveStatus === 'saving') {
    dot.className = 'w-2 h-2 rounded-full transition-all duration-300 bg-amber-400 animate-pulse';
    text.textContent = 'Saving...';
  } else {
    dot.className = 'w-2 h-2 rounded-full transition-all duration-300 bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]';
    text.textContent = 'Auto-Saved';
  }
}

function renderNavbar() {
  const prob = PROBLEMS[state.currentProblemId] || PROBLEMS['sum-natural-numbers'];

  // Problem dropdowns
  const navSelect = document.getElementById('nav-problem-select');
  const cardSelect = document.getElementById('card-problem-select');
  const optionsHtml = Object.values(PROBLEMS).map(p => `
    <option value="${p.id}" class="bg-slate-900 text-white font-medium" ${p.id === state.currentProblemId ? 'selected' : ''}>
      ${p.problemNo}: ${p.shortTitle || p.title.replace('Write a program to ', '').replace('find the ', '').replace('.', '')}
    </option>
  `).join('');

  if (navSelect) navSelect.innerHTML = optionsHtml;
  if (cardSelect) cardSelect.innerHTML = optionsHtml;

  // Dots
  const dotLogic = document.getElementById('nav-dot-logic');
  const dotRecipe = document.getElementById('nav-dot-recipe');
  const dotIngredients = document.getElementById('nav-dot-ingredients');
  const dotSample = document.getElementById('nav-dot-samplecode');

  if (dotLogic) dotLogic.className = `w-2.5 h-2.5 rounded-full transition-all ${state.completed.logic ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'bg-slate-700'}`;
  if (dotRecipe) dotRecipe.className = `w-2.5 h-2.5 rounded-full transition-all ${state.completed.recipe ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'bg-slate-700'}`;
  if (dotIngredients) dotIngredients.className = `w-2.5 h-2.5 rounded-full transition-all ${state.completed.ingredients ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]' : 'bg-slate-700'}`;
  if (dotSample) dotSample.className = `w-2.5 h-2.5 rounded-full transition-all ${state.completed.samplecode ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-slate-700'}`;

  // Role & Progress
  const roleEl = document.getElementById('nav-user-role');
  if (roleEl) roleEl.textContent = state.currentUser.role;

  const percent =
    (state.completed.logic ? 25 : 0) +
    (state.completed.recipe ? 25 : 0) +
    (state.completed.ingredients ? 25 : 0) +
    (state.completed.samplecode ? 25 : 0);

  const barEl = document.getElementById('nav-progress-bar');
  const percentEl = document.getElementById('nav-progress-percent');
  if (barEl) barEl.style.width = `${percent}%`;
  if (percentEl) percentEl.textContent = `${percent}%`;

  // Tokens
  const tokensEl = document.getElementById('nav-tokens');
  if (tokensEl) tokensEl.textContent = state.tokens;

  // Profile
  const initialsEl = document.getElementById('user-avatar-initials');
  if (initialsEl) initialsEl.textContent = state.currentUser.name.split(' ').map(n => n[0]).join('');

  const profName = document.getElementById('profile-user-name');
  const profRole = document.getElementById('profile-user-role');
  if (profName) profName.textContent = state.currentUser.name;
  if (profRole) profRole.textContent = state.currentUser.role;

  const usersList = document.getElementById('profile-users-list');
  if (usersList) {
    usersList.innerHTML = USERS.map(u => `
      <button
        data-user-id="${u.id}"
        class="w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-all cursor-pointer ${
          state.currentUser.id === u.id ? 'bg-indigo-500/20 text-indigo-200 font-bold border border-indigo-500/40' : 'hover:bg-white/5 text-slate-300'
        }"
      >
        <span>${u.name}</span>
        ${state.currentUser.id === u.id ? '<i class="fas fa-check text-indigo-400"></i>' : ''}
      </button>
    `).join('');
  }
}

function renderChallengeCard() {
  const prob = PROBLEMS[state.currentProblemId] || PROBLEMS['sum-natural-numbers'];

  const phaseBadge = document.getElementById('problem-phase-badge');
  if (phaseBadge) phaseBadge.textContent = `${prob.phaseLabel} • ${prob.problemNo}`;

  const titleEl = document.getElementById('problem-title');
  if (titleEl) titleEl.textContent = prob.title;

  const descList = document.getElementById('problem-description-list');
  if (descList) {
    descList.innerHTML = prob.description.map(line => `
      <p class="flex items-start gap-2.5">
        <span class="text-indigo-400 font-bold mt-1 text-xs">•</span>
        <span>${line}</span>
      </p>
    `).join('');
  }

  const conceptEl = document.getElementById('problem-concept');
  if (conceptEl) conceptEl.textContent = prob.concept;
}

function renderSidebar() {
  const sidebar = document.getElementById('sidebar-drawer');
  if (!sidebar) return;
  if (state.sidebarOpen) {
    sidebar.classList.remove('hidden');
  } else {
    sidebar.classList.add('hidden');
  }

  const list = document.getElementById('sidebar-problems-list');
  if (!list) return;

  list.innerHTML = Object.values(PROBLEMS).map(p => `
    <button
      data-problem-id="${p.id}"
      class="w-full text-left p-3.5 rounded-2xl text-xs font-bold flex items-center gap-3.5 transition-all cursor-pointer ${
        state.currentProblemId === p.id
          ? 'bg-indigo-500/20 text-indigo-100 border border-indigo-500/40 backdrop-blur-xl shadow-lg shadow-indigo-500/10'
          : 'hover:bg-white/5 text-slate-300 border border-transparent'
      }"
    >
      <span class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
        state.currentProblemId === p.id ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/40' : 'bg-slate-800 text-slate-400'
      }">
        ${p.problemNo.replace('Problem ', '')}
      </span>
      <div>
        <div class="font-bold text-white leading-tight">${p.shortTitle || p.title.replace('Write a program to ', '').replace('find the ', '').replace('.', '')}</div>
        <div class="text-[10px] font-normal text-indigo-300/70 mt-0.5">${p.concept}</div>
      </div>
    </button>
  `).join('');
}

function renderAiMentor() {
  const prob = PROBLEMS[state.currentProblemId] || PROBLEMS['sum-natural-numbers'];

  const sectionBadge = document.getElementById('mentor-active-section-badge');
  if (sectionBadge) sectionBadge.textContent = state.activeHintSection;

  const speechIcon = document.getElementById('icon-speech');
  if (speechIcon) speechIcon.className = `fas ${state.isSpeaking ? 'fa-pause' : 'fa-volume-up'}`;

  const bodyEl = document.getElementById('mentor-body');
  const toggleIcon = document.getElementById('icon-toggle-feedback');
  if (bodyEl && toggleIcon) {
    if (state.feedbackOpen) {
      bodyEl.classList.remove('hidden');
      toggleIcon.className = 'fas fa-chevron-down';
    } else {
      bodyEl.classList.add('hidden');
      toggleIcon.className = 'fas fa-chevron-up';
    }
  }

  const loadingEl = document.getElementById('mentor-loading');
  const hintContainer = document.getElementById('mentor-hint-container');
  const emptyContainer = document.getElementById('mentor-empty-container');

  if (state.feedbackLoading) {
    if (loadingEl) loadingEl.classList.remove('hidden');
    if (hintContainer) hintContainer.classList.add('hidden');
    if (emptyContainer) emptyContainer.classList.add('hidden');
    return;
  }

  if (loadingEl) loadingEl.classList.add('hidden');

  if (!state.currentHint) {
    if (hintContainer) hintContainer.classList.add('hidden');
    if (emptyContainer) emptyContainer.classList.remove('hidden');
  } else {
    if (emptyContainer) emptyContainer.classList.add('hidden');
    if (hintContainer) hintContainer.classList.remove('hidden');

    const levelBadge = document.getElementById('hint-level-badge');
    if (levelBadge) levelBadge.textContent = `Level ${state.currentHint.hintLevel} of 4`;

    const sourceBadge = document.getElementById('hint-source-badge');
    if (sourceBadge) {
      sourceBadge.innerHTML = `<i class="fas ${state.currentHint.source === 'firebase' ? 'fa-database' : 'fa-brain'} mr-1 text-[9px]"></i>${state.currentHint.source === 'firebase' ? 'FIREBASE' : 'GEMINI AI'}`;
    }

    const conceptBadge = document.getElementById('hint-concept-badge');
    if (conceptBadge) {
      if (state.currentHint.concept) {
        conceptBadge.textContent = state.currentHint.concept;
        conceptBadge.classList.remove('hidden');
      } else {
        conceptBadge.classList.add('hidden');
      }
    }

    const hintText = document.getElementById('hint-text');
    if (hintText) hintText.textContent = state.currentHint.hint;

    const nextActionBox = document.getElementById('hint-next-action-container');
    const nextActionText = document.getElementById('hint-next-action-text');
    if (nextActionBox && nextActionText) {
      if (state.currentHint.nextSuggestedAction) {
        nextActionText.textContent = state.currentHint.nextSuggestedAction;
        nextActionBox.classList.remove('hidden');
      } else {
        nextActionBox.classList.add('hidden');
      }
    }

    const progressBar = document.getElementById('hint-progress-bar');
    const progressText = document.getElementById('hint-progress-text');
    if (progressBar) progressBar.style.width = `${(state.currentHint.hintLevel / 4) * 100}%`;
    if (progressText) progressText.textContent = `Level ${state.currentHint.hintLevel}/4`;

    const clarityBtn = document.getElementById('btn-need-more-clarity');
    if (clarityBtn) {
      if (state.currentHint.hintLevel >= 4) {
        clarityBtn.classList.add('hidden');
      } else {
        clarityBtn.classList.remove('hidden');
      }
    }

    const writeBtn = document.getElementById('btn-write-in-section');
    if (writeBtn) writeBtn.textContent = `WRITE MY ANSWER IN ${state.activeHintSection.toUpperCase()}`;
  }

  // Question pills
  const askLabel = document.getElementById('mentor-ask-label');
  if (askLabel) askLabel.textContent = `Ask Mentor About ${state.activeHintSection.toUpperCase()}:`;

  const pillsContainer = document.getElementById('mentor-question-pills');
  if (pillsContainer) {
    const pills = prob.starterQuestionSuggestions[state.activeHintSection] || [];
    pillsContainer.innerHTML = pills.map(q => `
      <button
        data-question="${q.replace(/"/g, '&quot;')}"
        class="text-[11px] bg-white/[0.06] hover:bg-indigo-500/20 text-slate-300 hover:text-indigo-200 border border-white/10 px-3 py-1 rounded-full font-medium transition-all cursor-pointer"
      >
        ${q}
      </button>
    `).join('');
  }
}

function renderStageCards() {
  const stages = ['logic', 'recipe', 'ingredients', 'samplecode'];

  stages.forEach(stage => {
    const cardEl = document.getElementById(`stage-${stage}`);
    const contentEl = document.getElementById(`content-${stage}`);
    const textareaEl = document.getElementById(`input-${stage}`);
    const writeBtn = document.getElementById(`btn-write-${stage}`);
    const successBadge = document.getElementById(`badge-${stage}-success`);
    const lockedBadge = document.getElementById(`badge-locked-${stage}`);
    const revealBtn = document.getElementById(`btn-reveal-${stage}`);
    const helpBtn = document.getElementById(`btn-help-${stage}`);

    const unlocked = isUnlocked(stage);
    const isOpen = state.openSections[stage];
    const isCompleted = state.completed[stage];

    // Card state
    if (cardEl) {
      if (!unlocked) {
        cardEl.className = 'backdrop-blur-xl rounded-[28px] border transition-all duration-300 overflow-hidden bg-white/[0.02] border-white/5 opacity-60';
      } else {
        cardEl.className = 'backdrop-blur-xl bg-white/[0.06] border border-white/15 rounded-[28px] shadow-2xl shadow-indigo-950/20 overflow-hidden transition-all duration-300';
      }
    }

    // Number indicator
    const numBadge = document.getElementById(`stage-num-${stage}`);
    if (numBadge) {
      if (isCompleted) {
        numBadge.className = 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-500/50';
      } else if (unlocked) {
        numBadge.className = 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-500/50';
      } else {
        numBadge.className = 'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-slate-800 text-slate-500 border border-white/5';
      }
    }

    // Header badges and buttons
    if (lockedBadge) {
      if (unlocked) lockedBadge.classList.add('hidden');
      else lockedBadge.classList.remove('hidden');
    }
    if (successBadge) {
      if (isCompleted) successBadge.classList.remove('hidden');
      else successBadge.classList.add('hidden');
    }
    if (revealBtn) {
      if (unlocked) revealBtn.classList.remove('hidden');
      else revealBtn.classList.add('hidden');
    }
    if (helpBtn) {
      if (unlocked) helpBtn.classList.remove('hidden');
      else helpBtn.classList.add('hidden');
    }
    if (writeBtn) {
      if (unlocked) {
        writeBtn.classList.remove('hidden');
        writeBtn.innerHTML = `<i class="fas ${isOpen ? 'fa-times' : 'fa-pen'}"></i><span>${isOpen ? 'Close' : 'Write'}</span>`;
      } else {
        writeBtn.classList.add('hidden');
      }
    }

    // Body visibility
    if (contentEl) {
      if (unlocked && isOpen) {
        contentEl.classList.remove('hidden');
      } else {
        contentEl.classList.add('hidden');
      }
    }

    // Input content
    if (textareaEl && textareaEl.value !== state.inputs[stage]) {
      textareaEl.value = state.inputs[stage];
    }
  });

  // Proceed buttons
  const proceedRecipe = document.getElementById('btn-proceed-recipe');
  if (proceedRecipe) {
    if (state.completed.logic || state.stageFeedback.logic?.correct) proceedRecipe.classList.remove('hidden');
    else proceedRecipe.classList.add('hidden');
  }

  const proceedIngredients = document.getElementById('btn-proceed-ingredients');
  if (proceedIngredients) {
    if (state.completed.recipe || state.stageFeedback.recipe?.correct) proceedIngredients.classList.remove('hidden');
    else proceedIngredients.classList.add('hidden');
  }

  const proceedSample = document.getElementById('btn-proceed-samplecode');
  if (proceedSample) {
    if (state.completed.ingredients || state.stageFeedback.ingredients?.correct) proceedSample.classList.remove('hidden');
    else proceedSample.classList.add('hidden');
  }

  // Render stage-specific feedback & trackers
  renderLogicFeedback();
  renderRecipeFeedback();
  renderIngredientsFeedback();
  renderSampleCodeFeedback();
}

function renderLogicFeedback() {
  const container = document.getElementById('feedback-logic-container');
  if (!container) return;
  const fb = state.stageFeedback.logic;
  if (!fb) {
    container.classList.add('hidden');
    return;
  }
  container.classList.remove('hidden');

  container.className = `p-4.5 rounded-2xl border transition-all ${
    fb.correct
      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 shadow-lg shadow-emerald-950/20'
      : 'bg-indigo-500/15 border-indigo-500/30 text-slate-100 shadow-lg shadow-indigo-950/20'
  } flex items-start gap-3.5`;

  container.innerHTML = `
    <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-md ${
      fb.correct ? 'bg-emerald-500/30 border border-emerald-400/40 text-emerald-300' : 'bg-indigo-500/30 border border-indigo-400/40 text-indigo-300'
    }">
      <i class="fas ${fb.correct ? 'fa-check-circle' : 'fa-chalkboard-teacher'} text-base"></i>
    </div>
    <div class="flex-1 space-y-2.5">
      <div class="flex items-center gap-2 flex-wrap">
        <h4 class="font-bold text-sm tracking-wide uppercase flex items-center gap-1.5 ${fb.correct ? 'text-emerald-300' : 'text-indigo-300'}">
          <span>${fb.correct ? '🎉 Logic Approved by Coach!' : '🧑‍🏫 Coach Maara (1-on-1 Trainer)'}</span>
        </h4>
      </div>
      <div class="text-xs leading-relaxed text-slate-200 font-sans whitespace-pre-line bg-slate-900/70 p-3.5 rounded-xl border border-white/5 shadow-inner">
        ${fb.feedback}
      </div>
    </div>
  `;
}

function renderRecipeFeedback() {
  const trackerContainer = document.getElementById('recipe-step-tracker-container');
  const fbContainer = document.getElementById('feedback-recipe-container');
  const fb = state.stageFeedback.recipe;

  // Tracker
  if (trackerContainer) {
    if (fb?.recipeStepProgress && fb.recipeStepProgress.some(s => s.completed)) {
      trackerContainer.classList.remove('hidden');
      const completedSteps = fb.recipeStepProgress.filter(s => s.completed);
      trackerContainer.innerHTML = `
        <div class="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2.5 shadow-lg shadow-amber-950/20">
          <div class="flex items-center justify-between text-xs">
            <span class="font-semibold text-amber-300 flex items-center gap-1.5">
              <i class="fas fa-list-ol text-amber-400"></i>
              Algorithm Step Tracker:
            </span>
            <span class="text-[11px] font-medium text-amber-200/90 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              ${completedSteps.length} of ${fb.recipeStepProgress.length} Steps Completed
            </span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 pt-0.5">
            ${completedSteps.map(step => `
              <div class="p-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition-all bg-amber-500/20 border-amber-400/50 text-amber-200 ring-1 ring-amber-400/30 shadow-md shadow-amber-950/30">
                <div class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold bg-amber-500/30 text-amber-200 border border-amber-400/40">
                  <i class="fas fa-check text-[9px] text-amber-300"></i>
                </div>
                <div class="min-w-0 flex-1">
                  <div class="font-medium text-amber-100 truncate">${step.title}</div>
                  <div class="text-[10px] text-amber-300/80 font-medium">✓ Step Completed</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      trackerContainer.classList.add('hidden');
    }
  }

  // Feedback
  if (!fbContainer) return;
  if (!fb) {
    fbContainer.classList.add('hidden');
    return;
  }
  fbContainer.classList.remove('hidden');

  fbContainer.className = `p-4.5 rounded-2xl border transition-all ${
    fb.correct
      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 shadow-lg shadow-emerald-950/20'
      : 'bg-indigo-500/15 border-indigo-500/30 text-slate-100 shadow-lg shadow-indigo-950/20'
  } flex items-start gap-3.5`;

  fbContainer.innerHTML = `
    <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-md ${
      fb.correct ? 'bg-emerald-500/30 border border-emerald-400/40 text-emerald-300' : 'bg-indigo-500/30 border border-indigo-400/40 text-indigo-300'
    }">
      <i class="fas ${fb.correct ? 'fa-check-circle' : 'fa-chalkboard-teacher'} text-base"></i>
    </div>
    <div class="flex-1 space-y-2.5">
      <div class="flex items-center gap-2 flex-wrap">
        <h4 class="font-bold text-sm tracking-wide uppercase flex items-center gap-1.5 ${fb.correct ? 'text-emerald-300' : 'text-indigo-300'}">
          <span>${fb.correct ? '🎉 Recipe Approved by Coach!' : '🧑‍🏫 Coach Maara (1-on-1 Trainer)'}</span>
        </h4>
        ${!fb.correct ? `
          <span class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/25 border border-indigo-400/40 text-indigo-200 uppercase tracking-wider font-semibold">
            AI Human Touch Hint
          </span>
        ` : ''}
      </div>
      <div class="text-xs leading-relaxed text-slate-200 font-sans whitespace-pre-line bg-slate-900/70 p-3.5 rounded-xl border border-white/5 shadow-inner">
        ${fb.feedback}
      </div>
    </div>
  `;
}

function renderIngredientsFeedback() {
  const guideContainer = document.getElementById('ingredients-clue-guide');
  const trackerContainer = document.getElementById('ingredients-step-tracker-container');
  const fbContainer = document.getElementById('feedback-ingredients-container');
  const fb = state.stageFeedback.ingredients;

  // Clue Guide
  if (guideContainer) {
    guideContainer.innerHTML = `
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-300 pt-1">
        <div class="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
          <span class="font-bold text-amber-300 flex items-center gap-1 mb-1">
            <i class="fas fa-tags text-[10px]"></i> 1. Variables:
          </span>
          • <code class="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">n</code> (user input)<br/>
          • State containers (sum, fact, count)<br/>
          • Loop counter <code class="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">i = 1</code>
        </div>
        <div class="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
          <span class="font-bold text-amber-300 flex items-center gap-1 mb-1">
            <i class="fas fa-redo text-[10px]"></i> 2. Loop Construct:
          </span>
          • <code class="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">for loop</code> or <code class="text-indigo-300 bg-indigo-950/60 px-1 py-0.5 rounded">while loop</code><br/>
          <span class="text-slate-400 text-[10px]">Repeats sequence up to boundary condition</span>
        </div>
        <div class="bg-slate-900/60 p-2.5 rounded-xl border border-white/5">
          <span class="font-bold text-amber-300 flex items-center gap-1 mb-1">
            <i class="fas fa-calculator text-[10px]"></i> 3. Operators:
          </span>
          • Arithmetic / Modulo (+, *, %)<br/>
          • Relational (<=, ==, >=)<br/>
          • Assignment (=)
        </div>
      </div>
    `;
  }

  // Tracker
  if (trackerContainer) {
    if (fb?.ingredientsStepProgress && fb.ingredientsStepProgress.length > 0) {
      trackerContainer.classList.remove('hidden');
      const completed = fb.ingredientsStepProgress.filter(s => s.completed);
      trackerContainer.innerHTML = `
        <div class="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2.5 shadow-lg shadow-amber-950/20">
          <div class="flex items-center justify-between text-xs">
            <span class="font-semibold text-amber-300 flex items-center gap-1.5">
              <i class="fas fa-cubes text-amber-400"></i>
              Programming Ingredients Tracker:
            </span>
            <span class="text-[11px] font-medium text-amber-200/90 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              ${completed.length} of ${fb.ingredientsStepProgress.length} Ingredients Identified
            </span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 pt-0.5">
            ${fb.ingredientsStepProgress.map(step => `
              <div class="p-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition-all ${
                step.completed
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-200 ring-1 ring-amber-400/30 shadow-md shadow-amber-950/30'
                  : 'bg-white/[0.02] border-dashed border-white/15 text-slate-400'
              }">
                <div class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                  step.completed ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40' : 'bg-white/5 text-slate-500 border border-white/10'
                }">
                  ${step.completed ? '<i class="fas fa-check text-[9px] text-amber-300"></i>' : `<span class="text-[10px]">${step.stepNumber}</span>`}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="font-medium truncate ${step.completed ? 'text-amber-100' : 'text-slate-300'}">${step.title}</div>
                  <div class="text-[10px] font-medium ${step.completed ? 'text-amber-300/80' : 'text-slate-500'}">
                    ${step.completed ? '✓ Identified' : '⏳ Needed'}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      trackerContainer.classList.add('hidden');
    }
  }

  // Feedback
  if (!fbContainer) return;
  if (!fb) {
    fbContainer.classList.add('hidden');
    return;
  }
  fbContainer.classList.remove('hidden');

  fbContainer.className = `p-4.5 rounded-2xl border transition-all ${
    fb.correct
      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 shadow-lg shadow-emerald-950/20'
      : 'bg-indigo-500/15 border-indigo-500/30 text-slate-100 shadow-lg shadow-indigo-950/20'
  } flex items-start gap-3.5`;

  fbContainer.innerHTML = `
    <div class="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-md ${
      fb.correct ? 'bg-emerald-500/30 border border-emerald-400/40 text-emerald-300' : 'bg-indigo-500/30 border border-indigo-400/40 text-indigo-300'
    }">
      <i class="fas ${fb.correct ? 'fa-check-circle' : 'fa-chalkboard-teacher'} text-base"></i>
    </div>
    <div class="flex-1 space-y-2.5">
      <div class="flex items-center gap-2 flex-wrap">
        <h4 class="font-bold text-sm tracking-wide uppercase flex items-center gap-1.5 ${fb.correct ? 'text-emerald-300' : 'text-indigo-300'}">
          <span>${fb.correct ? '🎉 Ingredients Approved by Coach!' : '🧑‍🏫 Coach Maara (1-on-1 Trainer)'}</span>
        </h4>
        ${!fb.correct ? `
          <span class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/25 border border-indigo-400/40 text-indigo-200 uppercase tracking-wider font-semibold">
            AI Human Touch Hint
          </span>
        ` : ''}
      </div>
      <div class="text-xs leading-relaxed text-slate-200 font-sans whitespace-pre-line bg-slate-900/70 p-3.5 rounded-xl border border-white/5 shadow-inner">
        ${fb.feedback}
      </div>
    </div>
  `;
}

function renderSampleCodeFeedback() {
  const trackerContainer = document.getElementById('samplecode-step-tracker-container');
  const fbContainer = document.getElementById('feedback-samplecode-container');
  const fb = state.stageFeedback.samplecode;

  // Tracker
  if (trackerContainer) {
    if (fb?.sampleCodeStepProgress && fb.sampleCodeStepProgress.length > 0) {
      trackerContainer.classList.remove('hidden');
      const verified = fb.sampleCodeStepProgress.filter(s => s.completed);
      trackerContainer.innerHTML = `
        <div class="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2.5 shadow-lg shadow-amber-950/20">
          <div class="flex items-center justify-between text-xs">
            <span class="font-semibold text-amber-300 flex items-center gap-1.5">
              <i class="fas fa-tasks text-amber-400"></i>
              Sample Code & Prototype Tracker:
            </span>
            <span class="text-[11px] font-medium text-amber-200/90 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              ${verified.length} of ${fb.sampleCodeStepProgress.length} Verified
            </span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 pt-0.5">
            ${fb.sampleCodeStepProgress.map(step => `
              <div class="p-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition-all ${
                step.completed
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-200 ring-1 ring-amber-400/30 shadow-md shadow-amber-950/30'
                  : step.current
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300/90 ring-1 ring-amber-500/20'
                  : 'bg-white/[0.02] border-white/10 text-slate-400'
              }">
                <div class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                  step.completed ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40' : step.current ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/5 text-slate-500 border border-white/10'
                }">
                  ${step.completed ? '<i class="fas fa-check text-[9px] text-amber-300"></i>' : `<span class="text-[10px]">${step.stepNumber}</span>`}
                </div>
                <div class="min-w-0 flex-1">
                  <div class="font-medium truncate ${step.completed ? 'text-amber-100' : 'text-slate-300'}">${step.title}</div>
                  <div class="text-[10px] font-medium ${step.completed ? 'text-amber-300/80' : 'text-slate-500'}">
                    ${step.completed ? '✓ Verified' : '⏳ Needed'}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      trackerContainer.classList.add('hidden');
    }
  }

  // Feedback
  if (!fbContainer) return;
  if (!fb) {
    fbContainer.classList.add('hidden');
    return;
  }
  fbContainer.classList.remove('hidden');

  fbContainer.className = `p-4 rounded-2xl border transition-all ${
    fb.correct
      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200 shadow-lg shadow-emerald-950/20'
      : 'bg-amber-500/10 border-amber-500/30 text-amber-100 shadow-xl shadow-amber-950/20'
  } flex items-start gap-3.5`;

  fbContainer.innerHTML = `
    <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
      fb.correct ? 'bg-emerald-500/30 border border-emerald-400/40 text-emerald-300' : 'bg-amber-500/30 border border-amber-400/40 text-amber-300 shadow-md shadow-amber-500/20'
    }">
      <i class="fas ${fb.correct ? 'fa-check-circle' : 'fa-lightbulb'} text-sm"></i>
    </div>
    <div class="flex-1 space-y-2.5">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h4 class="font-bold text-sm tracking-wide uppercase flex items-center gap-2 ${fb.correct ? 'text-emerald-300' : 'text-amber-300'}">
          <span>${fb.correct ? '✅ Taste the Sample Verified!' : '🧑‍🏫 Coach Maara • AI Human Touch Guidance'}</span>
        </h4>
        <span class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/30 font-semibold flex items-center gap-1">
          <i class="fas fa-sparkles text-[9px] text-amber-300"></i>
          AI Human Touch Hint
        </span>
      </div>

      <div class="text-xs leading-relaxed text-slate-200 font-sans whitespace-pre-line bg-slate-900/70 p-3.5 rounded-xl border border-white/5 shadow-inner">
        ${fb.feedback}
      </div>
    </div>
  `;
}

// User Actions & Handlers
function handleSelectProblem(newProblemId) {
  if (!PROBLEMS[newProblemId]) return;
  if (newProblemId === state.currentProblemId) return;

  saveCurrentProgress(false);
  state.currentProblemId = newProblemId;
  loadProblemData(newProblemId, state.currentUser);

  try {
    const url = new URL(window.location.href);
    url.searchParams.set('problem', newProblemId);
    window.history.replaceState(null, '', url.toString());
  } catch (e) {}

  renderNavbar();
  renderChallengeCard();
  renderSidebar();
  renderAiMentor();
  renderStageCards();
}

function handleSelectUser(newUser) {
  saveCurrentProgress(false);
  state.currentUser = newUser;
  loadProblemData(state.currentProblemId, newUser);
  state.profileDropdownOpen = false;

  const dropdown = document.getElementById('profile-dropdown');
  if (dropdown) dropdown.classList.add('hidden');

  renderNavbar();
  renderAiMentor();
  renderStageCards();
  triggerToast(`Switched persona to ${newUser.name}`, 'info');
}

function handleResetChallenge(targetProblemId = state.currentProblemId) {
  try {
    localStorage.removeItem(`cookdcode_${state.currentUser.id}_${targetProblemId}`);
  } catch (e) {}

  state.inputs = { logic: '', recipe: '', ingredients: '', samplecode: '' };
  state.completed = { logic: false, recipe: false, ingredients: false, samplecode: false };
  state.openSections = { logic: true, recipe: false, ingredients: false, samplecode: false };
  state.stageFeedback = { logic: null, recipe: null, ingredients: null, samplecode: null };

  const initHint = getInitialHintForProblem(targetProblemId);
  state.currentHint = initHint;
  state.currentHintLevel = 1;
  state.activeHintSection = 'logic';
  state.userQuestion = '';
  state.lastStudentThought = '';
  state.deliveredHints = initHint?.hint ? [initHint.hint] : [];
  state.stageHelpCount = { logic: 0, recipe: 0, ingredients: 0, samplecode: 0 };
  state.stageAttemptCounts = { logic: 0, recipe: 0, ingredients: 0, samplecode: 0 };
  state.showResetConfirmModal = false;

  renderNavbar();
  renderAiMentor();
  renderStageCards();
  renderModals();

  triggerToast(`"${PROBLEMS[targetProblemId]?.title || 'Challenge'}" reset to a clean, fresh start!`, 'info');
}

function handleClearStage(stage) {
  state.inputs[stage] = '';
  state.completed[stage] = false;
  state.stageFeedback[stage] = null;
  saveCurrentProgress(false);
  renderNavbar();
  renderStageCards();
  triggerToast(`${stage.toUpperCase()} cleared! You can now re-write fresh.`, 'info');
}

// Request Help from AI Mentor
async function requestHelp(section, customLevel, explicitQuestion, isClarityEscalation = false) {
  if (state.tokens <= 0) {
    triggerToast('No tokens remaining! You can still use Check.', 'warning');
    return;
  }

  state.tokens = Math.max(0, state.tokens - 1);
  state.activeHintSection = section;
  state.feedbackOpen = true;
  state.feedbackLoading = true;

  let level = customLevel;
  if (!level) {
    const priorCount = state.stageHelpCount[section] || 0;
    if (state.activeHintSection === section && priorCount > 0) {
      level = Math.min(4, ((state.currentHintLevel % 4) + 1));
    } else {
      level = 1;
    }
  }
  state.currentHintLevel = level;

  const prob = PROBLEMS[state.currentProblemId] || PROBLEMS['sum-natural-numbers'];
  const worksheetContent = (state.inputs[section] || '').trim();

  let studentQuestion = explicitQuestion || state.userQuestion;
  if (!studentQuestion && isClarityEscalation && state.lastStudentThought) {
    studentQuestion = state.lastStudentThought;
  }
  if (!studentQuestion && worksheetContent) {
    studentQuestion = `Student work in ${section}: "${worksheetContent}". Please evaluate my thought process, check my operands and calculations step by step, and provide a clear, user-friendly hint in simple English to guide my next step.`;
  }
  if (!studentQuestion) {
    studentQuestion = `How do I approach the ${section} stage for ${prob.title}?`;
  }

  state.lastStudentThought = studentQuestion;

  renderNavbar();
  renderAiMentor();

  try {
    const res = await fetch('/api/ai-mentor/hint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: state.currentUser.id,
        programId: prob.id,
        section,
        studentInput: studentQuestion,
        studentWorksheet: worksheetContent,
        studentCode: state.inputs.samplecode,
        hintLevel: level,
        problemTitle: prob.title,
        problemDescription: prob.description.join(' '),
        previousHints: state.deliveredHints,
        forceLlm: true,
        isClarityRequest: isClarityEscalation
      })
    });

    const data = await res.json();
    if (data.success) {
      state.currentHint = data;
      state.currentHintLevel = data.hintLevel;
      state.deliveredHints.push(data.hint);
      state.stageHelpCount[section] = (state.stageHelpCount[section] || 0) + 1;
      state.userQuestion = '';
    } else {
      triggerToast('Could not load hint from AI Mentor.', 'error');
    }
  } catch (err) {
    console.error(err);
    triggerToast('Failed to contact AI Mentor API.', 'error');
  } finally {
    state.feedbackLoading = false;
    renderAiMentor();
  }
}

// Generate Section Hint / Validation via /api/checkInput
async function handleGenerateSectionHint(section, customPrompt) {
  state.isGeneratingSectionHint[section] = true;
  const currentText = (state.inputs[section] || '').trim();
  const nextAttempt = (state.stageAttemptCounts[section] || 0) + 1;
  state.stageAttemptCounts[section] = nextAttempt;

  const prob = PROBLEMS[state.currentProblemId] || PROBLEMS['sum-natural-numbers'];
  const stageLabels = { logic: 'Logic', recipe: 'Recipe', ingredients: 'Ingredients', samplecode: 'Taste Sample' };

  triggerToast(`✨ Coach Maara is generating your AI human touch hint for ${stageLabels[section]}...`, 'info');
  state.activeHintSection = section;

  try {
    const res = await fetch('/api/checkInput', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: prob.category,
        problemID: prob.id,
        problemTitle: prob.title,
        problemDescription: Array.isArray(prob.description) ? prob.description.join(' ') : prob.description,
        concept: prob.concept,
        reveal: prob.reveal,
        section,
        userInput: customPrompt
          ? (currentText ? `${currentText}\n// Student Question: ${customPrompt}` : customPrompt)
          : (currentText || `How do I approach the ${section} stage for ${prob.title}?`),
        attemptCount: nextAttempt,
        isStuck: true
      })
    });

    const data = await res.json();
    state.stageFeedback[section] = {
      correct: Boolean(data.correct),
      feedback: data.feedback,
      proofType: data.proofType || (section === 'logic' ? 'mathematical' : section === 'samplecode' ? 'code' : 'plan'),
      correction: data.correction,
      suggestedInput: data.suggestedInput,
      recipeStepProgress: data.recipeStepProgress,
      ingredientsStepProgress: data.ingredientsStepProgress,
      sampleCodeStepProgress: data.sampleCodeStepProgress,
      operationTestCases: data.operationTestCases
    };

    if (data.feedback) {
      state.currentHint = {
        hint: data.feedback,
        hintLevel: Math.min(4, nextAttempt),
        source: 'llm',
        concept: prob.concept,
        section,
        nextSuggestedAction: data.correction
      };
      state.deliveredHints.push(data.feedback);
    }

    if (data.correct && currentText.length >= 4 && !customPrompt) {
      triggerToast(`🎉 ${stageLabels[section]} Approved! Outstanding work with Coach Maara!`, 'success');
      state.completed[section] = true;
      if (section === 'samplecode' && state.completed.logic && state.completed.recipe && state.completed.ingredients) {
        state.showCompletePopup = true;
      }
    } else {
      triggerToast(`✨ Coach Maara generated a human touch hint for your ${stageLabels[section]}!`, 'info');
    }
  } catch (err) {
    console.error(err);
    triggerToast(`Could not reach Coach Maara AI for ${stageLabels[section]}.`, 'error');
  } finally {
    state.isGeneratingSectionHint[section] = false;
    renderNavbar();
    renderAiMentor();
    renderStageCards();
    renderModals();
    scheduleAutoSave();
  }
}

// Check Input Validation
async function checkInput(section, forceStuck = false) {
  const text = (state.inputs[section] || '').trim();
  if (!text) {
    triggerToast(`Please write your ${section === 'samplecode' ? 'code' : section} before checking!`, 'warning');
    return;
  }

  const currentAttempt = (state.stageAttemptCounts[section] || 0) + 1;
  state.stageAttemptCounts[section] = currentAttempt;
  const prob = PROBLEMS[state.currentProblemId] || PROBLEMS['sum-natural-numbers'];

  if (section === 'samplecode') {
    state.isGeneratingSectionHint.samplecode = true;
    triggerToast('✨ Coach Maara is analyzing your code with AI human touch...', 'info');
    state.activeHintSection = 'samplecode';
    state.feedbackOpen = true;
  } else {
    triggerToast(`Validating ${section}...`, 'info');
  }

  try {
    const res = await fetch('/api/checkInput', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category: prob.category,
        problemID: prob.id,
        problemTitle: prob.title,
        problemDescription: Array.isArray(prob.description) ? prob.description.join(' ') : prob.description,
        concept: prob.concept,
        reveal: prob.reveal,
        section,
        userInput: text,
        attemptCount: currentAttempt,
        isStuck: forceStuck || section === 'samplecode'
      })
    });

    const data = await res.json();
    state.stageFeedback[section] = {
      correct: Boolean(data.correct),
      feedback: data.feedback,
      proofType: data.proofType,
      correction: data.correction,
      suggestedInput: data.suggestedInput,
      recipeStepProgress: data.recipeStepProgress,
      ingredientsStepProgress: data.ingredientsStepProgress,
      sampleCodeStepProgress: data.sampleCodeStepProgress,
      operationTestCases: data.operationTestCases
    };

    if (data.correct) {
      const title = section === 'logic' ? '🎉 Logic Successful!' : section === 'samplecode' ? '🎉 Taste the Sample Verified!' : '✅ Stage Verified!';
      triggerToast(`${title} ${data.feedback}`, 'success');
      state.completed[section] = true;
      if (section === 'samplecode' && state.completed.logic && state.completed.recipe && state.completed.ingredients) {
        state.showCompletePopup = true;
      }

      // Auto open next section
      const nextMap = { logic: 'recipe', recipe: 'ingredients', ingredients: 'samplecode', samplecode: null };
      const next = nextMap[section];
      if (next) {
        state.openSections[next] = true;
        setTimeout(() => {
          document.getElementById(`stage-${next}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    } else {
      if (section === 'samplecode') {
        triggerToast('✨ Coach Maara generated AI Human Touch guidance for your code!', 'info');
        if (data.feedback) {
          state.currentHint = {
            hint: data.feedback,
            hintLevel: Math.min(4, currentAttempt),
            source: 'llm',
            concept: prob.concept,
            section: 'samplecode',
            nextSuggestedAction: data.correction
          };
        }
      } else {
        triggerToast(`❌ Needs adjustment: ${data.feedback}`, 'error');
      }
      state.completed[section] = false;
    }
  } catch (err) {
    console.error(err);
    triggerToast('Validation check error. Please ensure server is running.', 'error');
  } finally {
    state.isGeneratingSectionHint.samplecode = false;
    renderNavbar();
    renderAiMentor();
    renderStageCards();
    renderModals();
    scheduleAutoSave();
  }
}

// Speech Synthesizer
function toggleSpeech() {
  if (!state.currentHint?.hint) return;
  if (state.isSpeaking) {
    window.speechSynthesis.cancel();
    state.isSpeaking = false;
  } else {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(state.currentHint.hint);
    utterance.onend = () => {
      state.isSpeaking = false;
      renderAiMentor();
    };
    window.speechSynthesis.speak(utterance);
    state.isSpeaking = true;
  }
  renderAiMentor();
}

// Student History
async function fetchStudentHistory() {
  try {
    const prob = PROBLEMS[state.currentProblemId] || PROBLEMS['sum-natural-numbers'];
    const res = await fetch(`/api/ai-mentor/history?userId=${state.currentUser.id}&programId=${prob.id}`);
    const data = await res.json();
    if (data.success) {
      state.historyList = data.history || [];
      state.showHistoryModal = true;
      renderModals();
    }
  } catch (e) {
    triggerToast('Error loading hint history', 'error');
  }
}

// Diagnostics Tests
async function runDiagnosticTests() {
  state.runningTests = true;
  const btn = document.getElementById('btn-run-tests');
  const icon = document.getElementById('run-tests-icon');
  const text = document.getElementById('run-tests-text');
  if (icon) icon.className = 'fas fa-spinner fa-spin text-amber-300';
  if (text) text.textContent = 'Testing...';

  try {
    const res = await fetch('/api/ai-mentor/run-tests');
    const data = await res.json();
    state.testResults = data;
    state.showTestModal = true;
  } catch (e) {
    triggerToast('Failed to execute test suite', 'error');
  } finally {
    state.runningTests = false;
    if (icon) icon.className = 'fas fa-flask text-amber-300';
    if (text) text.textContent = 'AI Mentor Tests';
    renderModals();
  }
}

// Render Modals
function renderModals() {
  const prob = PROBLEMS[state.currentProblemId] || PROBLEMS['sum-natural-numbers'];

  // Reveal Modal
  const revealModal = document.getElementById('modal-reveal');
  const revealTitle = document.getElementById('modal-reveal-title');
  const revealText = document.getElementById('modal-reveal-text');
  if (revealModal) {
    if (state.revealSection) {
      revealModal.style.display = 'flex';
      if (revealTitle) revealTitle.textContent = `Reference Solution: ${state.revealSection.toUpperCase()}`;
      if (revealText) revealText.value = prob.reveal[state.revealSection] || 'No reference solution available.';
    } else {
      revealModal.style.display = 'none';
    }
  }

  // History Modal
  const historyModal = document.getElementById('modal-history');
  const historyTitle = document.getElementById('modal-history-title');
  const historyListEl = document.getElementById('modal-history-list');
  if (historyModal) {
    if (state.showHistoryModal) {
      historyModal.style.display = 'flex';
      if (historyTitle) historyTitle.textContent = `Student Hint History: ${state.currentUser.name}`;
      if (historyListEl) {
        if (state.historyList.length === 0) {
          historyListEl.innerHTML = `<div class="text-center py-12 text-slate-400 text-xs">No previous hint interactions recorded for this student on this challenge yet.</div>`;
        } else {
          historyListEl.innerHTML = state.historyList.map(item => `
            <div class="p-3.5 bg-white/[0.04] border border-white/10 rounded-2xl space-y-1 text-xs">
              <div class="flex justify-between items-center">
                <span class="font-bold text-indigo-300 uppercase text-[10px]">
                  Stage: ${item.section} • Level ${item.hintLevel}
                </span>
                <span class="text-[10px] bg-white/10 border border-white/10 px-2 py-0.5 rounded-full text-slate-300 font-mono">
                  ${item.source}
                </span>
              </div>
              ${item.studentInput ? `<p class="text-slate-400 italic">Q: &ldquo;${item.studentInput}&rdquo;</p>` : ''}
              <p class="font-semibold text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-white/5 leading-relaxed">
                ${item.hint}
              </p>
            </div>
          `).join('');
        }
      }
    } else {
      historyModal.style.display = 'none';
    }
  }

  // Diagnostic Test Modal
  const testsModal = document.getElementById('modal-tests');
  const testsListEl = document.getElementById('modal-tests-list');
  if (testsModal) {
    if (state.showTestModal && state.testResults) {
      testsModal.style.display = 'flex';
      if (testsListEl) {
        testsListEl.innerHTML = (state.testResults.results || []).map(res => `
          <div class="p-3.5 bg-white/[0.04] border border-white/10 rounded-2xl text-xs space-y-1">
            <div class="flex justify-between items-center">
              <span class="font-bold text-slate-200">${res.name}</span>
              <span class="px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                res.status === 'PASS' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }">
                ${res.status}
              </span>
            </div>
            <div class="text-slate-400 text-[11px] font-mono bg-slate-950/70 p-2.5 rounded-xl border border-white/5 overflow-x-auto">
              ${JSON.stringify(res.details, null, 2)}
            </div>
          </div>
        `).join('');
      }
    } else {
      testsModal.style.display = 'none';
    }
  }

  // Completion Modal
  const completionModal = document.getElementById('modal-completion');
  if (completionModal) {
    if (state.showCompletePopup) completionModal.style.display = 'flex';
    else completionModal.style.display = 'none';
  }

  // Reset Confirmation Modal
  const resetModal = document.getElementById('modal-reset');
  const resetDesc = document.getElementById('modal-reset-desc');
  if (resetModal) {
    if (state.showResetConfirmModal) {
      resetModal.style.display = 'flex';
      if (resetDesc) {
        resetDesc.innerHTML = `This will clear all 4 stages (Logic, Recipe, Ingredients, Sample Code) and saved progress for <strong class="text-indigo-300">${prob.title}</strong> so you can solve it cleanly from scratch.`;
      }
    } else {
      resetModal.style.display = 'none';
    }
  }
}

// Attach Event Listeners
function initEventListeners() {
  // Brand Logo / Sidebar
  document.getElementById('brand-logo')?.addEventListener('click', () => {
    state.sidebarOpen = true;
    renderSidebar();
  });
  document.getElementById('btn-toggle-sidebar')?.addEventListener('click', () => {
    state.sidebarOpen = !state.sidebarOpen;
    renderSidebar();
  });
  document.getElementById('btn-close-sidebar')?.addEventListener('click', () => {
    state.sidebarOpen = false;
    renderSidebar();
  });
  document.getElementById('sidebar-backdrop')?.addEventListener('click', () => {
    state.sidebarOpen = false;
    renderSidebar();
  });

  // Problem dropdowns
  document.getElementById('nav-problem-select')?.addEventListener('change', (e) => {
    handleSelectProblem(e.target.value);
  });
  document.getElementById('card-problem-select')?.addEventListener('change', (e) => {
    handleSelectProblem(e.target.value);
  });

  // Sidebar problem list delegation
  document.getElementById('sidebar-problems-list')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-problem-id]');
    if (btn) {
      handleSelectProblem(btn.getAttribute('data-problem-id'));
      state.sidebarOpen = false;
      renderSidebar();
    }
  });

  // Start Fresh / Reset
  document.getElementById('btn-start-fresh')?.addEventListener('click', () => {
    state.showResetConfirmModal = true;
    renderModals();
  });
  document.getElementById('card-reset-btn')?.addEventListener('click', () => {
    state.showResetConfirmModal = true;
    renderModals();
  });
  document.getElementById('btn-confirm-reset')?.addEventListener('click', () => {
    handleResetChallenge();
  });
  document.getElementById('btn-cancel-reset')?.addEventListener('click', () => {
    state.showResetConfirmModal = false;
    renderModals();
  });

  // Tests button
  document.getElementById('btn-run-tests')?.addEventListener('click', runDiagnosticTests);
  document.getElementById('btn-sidebar-tests')?.addEventListener('click', () => {
    state.sidebarOpen = false;
    renderSidebar();
    runDiagnosticTests();
  });

  // Save Progress
  document.getElementById('btn-save-progress')?.addEventListener('click', () => {
    saveCurrentProgress(true);
  });

  // Profile toggle & dropdown
  const profToggle = document.getElementById('btn-profile-toggle');
  const profDropdown = document.getElementById('profile-dropdown');
  profToggle?.addEventListener('click', () => {
    state.profileDropdownOpen = !state.profileDropdownOpen;
    if (profDropdown) {
      if (state.profileDropdownOpen) profDropdown.classList.remove('hidden');
      else profDropdown.classList.add('hidden');
    }
  });

  document.getElementById('profile-users-list')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-user-id]');
    if (btn) {
      const found = USERS.find(u => u.id === btn.getAttribute('data-user-id'));
      if (found) handleSelectUser(found);
    }
  });

  document.getElementById('btn-view-history')?.addEventListener('click', () => {
    state.profileDropdownOpen = false;
    if (profDropdown) profDropdown.classList.add('hidden');
    fetchStudentHistory();
  });
  document.getElementById('btn-sidebar-history')?.addEventListener('click', () => {
    state.sidebarOpen = false;
    renderSidebar();
    fetchStudentHistory();
  });

  // AI Mentor Controls
  document.getElementById('btn-toggle-speech')?.addEventListener('click', toggleSpeech);
  document.getElementById('btn-toggle-feedback')?.addEventListener('click', () => {
    state.feedbackOpen = !state.feedbackOpen;
    renderAiMentor();
  });
  document.getElementById('btn-need-more-clarity')?.addEventListener('click', () => {
    const nextLevel = Math.min(state.currentHintLevel + 1, 4);
    state.currentHintLevel = nextLevel;
    requestHelp(state.activeHintSection, nextLevel, undefined, true);
  });
  document.getElementById('btn-write-in-section')?.addEventListener('click', () => {
    state.openSections[state.activeHintSection] = true;
    renderStageCards();
    document.getElementById(`stage-${state.activeHintSection}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Mentor Ask Input
  const mentorInput = document.getElementById('mentor-question-input');
  const askBtn = document.getElementById('btn-ask-mentor');
  const executeAsk = () => {
    const q = mentorInput?.value.trim();
    if (q) {
      state.userQuestion = q;
      requestHelp(state.activeHintSection, state.currentHintLevel, q);
      if (mentorInput) mentorInput.value = '';
    }
  };
  askBtn?.addEventListener('click', executeAsk);
  mentorInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') executeAsk();
  });

  // Pills delegation
  document.getElementById('mentor-question-pills')?.addEventListener('click', (e) => {
    const pill = e.target.closest('[data-question]');
    if (pill) {
      const q = pill.getAttribute('data-question');
      state.userQuestion = q;
      requestHelp(state.activeHintSection, state.currentHintLevel, q);
    }
  });

  // CTC Stages Events: Inputs, Clear, Write toggles, Help, Reveal, Check, Proceed
  const stages = ['logic', 'recipe', 'ingredients', 'samplecode'];
  stages.forEach(stage => {
    const textarea = document.getElementById(`input-${stage}`);
    textarea?.addEventListener('input', (e) => {
      state.inputs[stage] = e.target.value;
      scheduleAutoSave();
    });

    document.getElementById(`btn-write-${stage}`)?.addEventListener('click', () => {
      if (!isUnlocked(stage)) {
        triggerToast('Complete the previous stage first to unlock!', 'warning');
        return;
      }
      state.openSections[stage] = !state.openSections[stage];
      renderStageCards();
    });

    document.getElementById(`btn-help-${stage}`)?.addEventListener('click', () => {
      requestHelp(stage);
    });

    document.getElementById(`btn-reveal-${stage}`)?.addEventListener('click', () => {
      state.revealSection = stage;
      renderModals();
    });

    document.getElementById(`btn-clear-${stage}`)?.addEventListener('click', () => handleClearStage(stage));
    document.getElementById(`btn-clear-${stage}-header`)?.addEventListener('click', () => handleClearStage(stage));

    document.getElementById(`btn-check-${stage}`)?.addEventListener('click', () => checkInput(stage));
  });

  // Proceed buttons
  document.getElementById('btn-proceed-recipe')?.addEventListener('click', () => {
    state.openSections.recipe = true;
    renderStageCards();
    setTimeout(() => {
      document.getElementById('stage-recipe')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    triggerToast('Proceeding to Stage 2: Recipe!', 'success');
  });

  document.getElementById('btn-proceed-ingredients')?.addEventListener('click', () => {
    state.openSections.ingredients = true;
    renderStageCards();
    setTimeout(() => {
      document.getElementById('stage-ingredients')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    triggerToast('Proceeding to Stage 3: Ingredients!', 'success');
  });

  document.getElementById('btn-proceed-samplecode')?.addEventListener('click', () => {
    state.openSections.samplecode = true;
    renderStageCards();
    setTimeout(() => {
      document.getElementById('stage-samplecode')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    triggerToast('Proceeding to Stage 4: Taste Sample!', 'success');
  });

  // Stuck buttons
  document.getElementById('btn-stuck-recipe')?.addEventListener('click', () => checkInput('recipe', true));
  document.getElementById('btn-stuck-ingredients')?.addEventListener('click', () => checkInput('ingredients', true));
  document.getElementById('btn-stuck-samplecode')?.addEventListener('click', () => {
    handleGenerateSectionHint('samplecode', 'I am stuck on this code step');
  });

  // Template loader in Ingredients
  document.getElementById('btn-load-ingredients-template')?.addEventListener('click', () => {
    const template = "Variables:\n• n: input integer\n• sum = 0: accumulator\n• i = 1: loop counter\n\nConstructs:\n• while loop or for loop (1 to n)\n\nOperators:\n• + / += for addition\n• = for assignment\n• <= for boundary";
    state.inputs.ingredients = template;
    renderStageCards();
    scheduleAutoSave();
    triggerToast('Ingredients starter template loaded!', 'info');
  });

  // Modals close buttons
  document.getElementById('btn-close-reveal')?.addEventListener('click', () => {
    state.revealSection = null;
    renderModals();
  });
  document.getElementById('btn-cancel-reveal')?.addEventListener('click', () => {
    state.revealSection = null;
    renderModals();
  });
  document.getElementById('btn-insert-solution')?.addEventListener('click', () => {
    const prob = PROBLEMS[state.currentProblemId] || PROBLEMS['sum-natural-numbers'];
    if (state.revealSection) {
      state.inputs[state.revealSection] = prob.reveal[state.revealSection] || '';
      triggerToast(`Inserted reference into ${state.revealSection}`, 'success');
      state.revealSection = null;
      renderStageCards();
      renderModals();
      scheduleAutoSave();
    }
  });

  document.getElementById('btn-close-history')?.addEventListener('click', () => {
    state.showHistoryModal = false;
    renderModals();
  });
  document.getElementById('btn-cancel-history')?.addEventListener('click', () => {
    state.showHistoryModal = false;
    renderModals();
  });

  document.getElementById('btn-close-tests')?.addEventListener('click', () => {
    state.showTestModal = false;
    renderModals();
  });
  document.getElementById('btn-cancel-tests')?.addEventListener('click', () => {
    state.showTestModal = false;
    renderModals();
  });

  document.getElementById('btn-close-completion')?.addEventListener('click', () => {
    state.showCompletePopup = false;
    renderModals();
  });
  document.getElementById('btn-next-challenge')?.addEventListener('click', () => {
    state.showCompletePopup = false;
    handleSelectProblem('prime-number');
    renderModals();
    triggerToast('Switched to Challenge 2: Prime Number Checker', 'success');
  });

  // Global Keyboard Shortcuts (Ctrl+S) & Window Listeners
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
      e.preventDefault();
      saveCurrentProgress(true);
    }
  });
  window.addEventListener('beforeunload', () => saveCurrentProgress(false));
  document.addEventListener('visibilitychange', () => saveCurrentProgress(false));
}

// Initial Bootstrap
function init() {
  loadProblemData(state.currentProblemId, state.currentUser);
  renderNavbar();
  renderChallengeCard();
  renderSidebar();
  renderAiMentor();
  renderStageCards();
  renderModals();
  initEventListeners();
  console.log('CookDcode initialized with plain HTML, CSS, and Vanilla JavaScript!');
}

document.addEventListener('DOMContentLoaded', init);
