/* Retrieve data from questions.js */
const DATA = questionBank;
let currentCategory = 'practice';

const navButtons = document.querySelectorAll('.nav-btn');
const catTitle = document.getElementById('category-title');
const catDesc = document.getElementById('category-desc');
const container = document.getElementById('questions-container');
const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');

const categoryDetails = {
  practice: { title: "Practice Mode", desc: "A comprehensive mix of all theory questions to test your knowledge." },
  tca: { title: "TCA Exam (Mixed Mode)", desc: "A comprehensive mix of TCA assessment questions." }
};

// Track progress globally
const progressTracker = {
  total: 0,
  completed: 0
};

function init() {
  progressTracker.total = Object.values(DATA).reduce((acc, curr) => acc + curr.length, 0);
  
  navButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      navButtons.forEach(b => b.classList.remove('active'));
      const target = e.target;
      target.classList.add('active');
      const cat = target.getAttribute('data-category');
      loadCategory(cat);
    });
  });
  
  loadCategory('mcq');
}

function updateProgress() {
  const percent = (progressTracker.completed / progressTracker.total) * 100;
  progressFill.style.width = `${percent}%`;
  progressText.textContent = `${progressTracker.completed} / ${progressTracker.total} Concepts Reviewed`;
}

// Helper to shuffle an array for the match dropdowns
function shuffleArray(arr) {
  let array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function loadCategory(catKey) {
  currentCategory = catKey;
  catTitle.textContent = categoryDetails[catKey].title;
  catDesc.textContent = categoryDetails[catKey].desc;
  
  container.innerHTML = '';
  const items = DATA[catKey];
  
  items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'q-card';
    
    // Watermark number
    const numMarker = document.createElement('div');
    numMarker.className = 'q-number';
    numMarker.textContent = (index + 1 < 10 ? '0' : '') + (index + 1);
    card.appendChild(numMarker);
    
    // Q text
    const qText = document.createElement('div');
    qText.className = 'q-text';
    qText.innerHTML = item.q;
    card.appendChild(qText);
    
    // Input Logic Setup
    let userInputs = [];
    
    let itemType = item.type || catKey;
    
    if (itemType === 'mcq' || itemType === 'trueFalse') {
      const g = document.createElement('div');
      g.className = 'options-grid';
      const optionsArray = itemType === 'mcq' ? item.options : ['True', 'False'];
      
      optionsArray.forEach(opt => {
        const o = document.createElement('div');
        o.className = 'option';
        o.textContent = opt;
        
        // Selection Interaction
        o.addEventListener('click', () => {
           if (!btn.disabled) {
              const allOpts = g.querySelectorAll('.option');
              allOpts.forEach(el => el.classList.remove('selected'));
              o.classList.add('selected');
           }
        });
        
        g.appendChild(o);
      });
      card.appendChild(g);
    } 
    else if (itemType === 'fillInTheBlank' || itemType === 'longAnswer') {
      const input = document.createElement(itemType === 'longAnswer' ? 'textarea' : 'input');
      input.className = 'input-answer';
      if (itemType === 'fillInTheBlank') input.type = 'text';
      if (itemType === 'longAnswer') input.rows = 4;
      input.placeholder = "Type your answer here...";
      userInputs.push(input);
      card.insertBefore(input, null); // Append safely
    }
    else if (itemType === 'matchFollowing') {
      const matchGrid = document.createElement('div');
      matchGrid.className = 'match-grid';
      
      // Get all right-side answers to shuffle
      const rightOptions = shuffleArray(item.pairs.map(p => p.right));
      
      item.pairs.forEach(pair => {
         const row = document.createElement('div');
         row.className = 'match-row';
         
         const dropdown = document.createElement('select');
         dropdown.className = 'match-select match-item';
         const defOpt = document.createElement('option');
         defOpt.value = ""; defOpt.textContent = "Select Match...";
         dropdown.appendChild(defOpt);
         
         rightOptions.forEach(ro => {
            const opt = document.createElement('option');
            opt.value = ro; opt.textContent = ro;
            dropdown.appendChild(opt);
         });
         
         userInputs.push(dropdown);
         
         row.innerHTML = `<div class="match-item">${pair.left}</div> <div class="match-arrow">↔</div>`;
         row.appendChild(dropdown);
         matchGrid.appendChild(row);
      });
      card.appendChild(matchGrid);
    }

    // Actions
    const actionDiv = document.createElement('div');
    actionDiv.className = 'actions';
    const btn = document.createElement('button');
    btn.className = 'btn-show';
    btn.textContent = "Check Answer";
    actionDiv.appendChild(btn);
    card.appendChild(actionDiv);
    
    // Solution Block
    const solBox = document.createElement('div');
    solBox.className = 'solution-box';
    card.appendChild(solBox);
    
    // Check Answer Execution
    btn.addEventListener('click', () => {
       // Validate Selection for MCQ/TF
       if (itemType === 'mcq' || itemType === 'trueFalse') {
          const selected = card.querySelector('.option.selected');
          if (!selected) {
             alert('Please select an option to check your answer!');
             return;
          }
       }
       
       if (btn.disabled) return;
       progressTracker.completed++;
       updateProgress();
       btn.disabled = true;
       btn.textContent = "Reviewed";
       btn.style.opacity = '0.7';
       
       let isCorrect = false;
       let feedbackSnippet = "";

       // Grading
       if (itemType === 'mcq' || itemType === 'trueFalse') {
          const opts = card.querySelectorAll('.option');
          const selected = card.querySelector('.option.selected');
          
          if (selected.textContent === item.answer) {
             isCorrect = true;
             selected.classList.add('correct');
          } else {
             selected.classList.add('wrong');
             opts.forEach(o => {
                if (o.textContent === item.answer) {
                   o.classList.add('correct');
                }
             });
          }
       } 
       else if (itemType === 'fillInTheBlank') {
          const val = userInputs[0].value.trim().toLowerCase();
          if (item.answer.toLowerCase().includes(val) && val.length > 2) {
             isCorrect = true; userInputs[0].style.borderColor = 'var(--success-color)';
          } else {
             userInputs[0].style.borderColor = '#f85149';
          }
       }
       else if (itemType === 'longAnswer') {
          // Can't autograde complex text reliably, give neutral feedback
          isCorrect = "neutral";
       }
       else if (itemType === 'matchFollowing') {
          let score = 0;
          item.pairs.forEach((p, i) => {
             const dropdown = userInputs[i];
             if (dropdown.value === p.right) {
                dropdown.style.borderColor = 'var(--success-color)';
                dropdown.style.color = 'var(--success-color)';
                score++;
             } else {
                dropdown.style.borderColor = '#f85149';
             }
             dropdown.disabled = true;
          });
          if (score === item.pairs.length) isCorrect = true;
          else if (score > 0) isCorrect = "partial";
       }

       // Construct Box
       if (isCorrect === true) {
          feedbackSnippet = `<div class="feedback-banner correct">✔ Correct!</div>`;
       } else if (isCorrect === false) {
          feedbackSnippet = `<div class="feedback-banner wrong">✖ Incorrect!</div>`;
       } else if (isCorrect === "partial") {
          feedbackSnippet = `<div class="feedback-banner neutral">⚠ Partially Correct</div>`;
       } else {
          feedbackSnippet = `<div class="feedback-banner neutral">Review Your Answer</div>`;
       }

       if (itemType === 'matchFollowing') {
          let solvedPairs = item.pairs.map(p => `• <b>${p.left}</b> corresponds strictly to <b>${p.right}</b>`).join("<br>");
          solBox.innerHTML = `
           ${feedbackSnippet}
           <span class="answer-label">Correct Mapping:</span>
           <div class="answer-text">${solvedPairs}</div>
           <div class="explanation"><b>Why?</b> ${item.explanation}</div>
          `;
       } else {
          solBox.innerHTML = `
           ${feedbackSnippet}
           <span class="answer-label">Expected Answer:</span>
           <div class="answer-text">${item.answer}</div>
           <div class="explanation"><b>Why?</b> ${item.explanation}</div>
          `;
       }
       
       solBox.classList.add('visible');
    });

    container.appendChild(card);
  });
  
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', init);
