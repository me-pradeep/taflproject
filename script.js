document.addEventListener('DOMContentLoaded', () => {
    const tape = document.getElementById('tape');
    const head = document.getElementById('head');
    const rulesInput = document.getElementById('rules');
    const inputStringInput = document.getElementById('input-string');
    const initializeBtn = document.getElementById('initialize-btn');
    const stepBtn = document.getElementById('step-btn');
    const runBtn = document.getElementById('run-btn');
    const resetBtn = document.getElementById('reset-btn');
    const currentStateSpan = document.getElementById('current-state');
    const stepCountSpan = document.getElementById('step-count');
    const mermaidContainer = document.getElementById('diagram-view');

    mermaid.initialize({
        startOnLoad: true,
        theme: 'base',
        themeVariables: {
            background: '#ffffff',
            primaryColor: '#e2e8f0',
            primaryTextColor: '#0f172a',
            lineColor: '#64748b',
            textColor: '#334155',
            fontFamily: 'Inter, sans-serif'
        }
    });

    let machineState = {
        tape: [],
        headPosition: 0,
        currentState: 'q0',
        rules: {},
        stepCount: 0,
        halted: false,
        runTimer: null
    };

    const BLANK_SYMBOL = 'B';

    function parseRules() {
        machineState.rules = {};
        const rulesText = rulesInput.value.split('\n');

        for (const ruleText of rulesText) {
            const trimmedRule = ruleText.trim();
            if (trimmedRule === '' || trimmedRule.startsWith('//')) {
                continue;
            }

            const parts = trimmedRule.split(',').map((part) => part.trim());
            if (parts.length !== 5) {
                alert(`Invalid rule format: ${ruleText}`);
                continue;
            }

            const [currentState, readSymbol, nextState, writeSymbol, move] = parts;
            if (!machineState.rules[currentState]) {
                machineState.rules[currentState] = {};
            }

            machineState.rules[currentState][readSymbol] = {
                nextState,
                writeSymbol,
                move
            };
        }
    }

    function updateDiagram() {
        let diagram = 'graph TD;';

        for (const state in machineState.rules) {
            for (const symbol in machineState.rules[state]) {
                const rule = machineState.rules[state][symbol];
                diagram += `\n${state} -- ${symbol}/${rule.writeSymbol},${rule.move} --> ${rule.nextState};`;
            }
        }

        diagram += `\nstyle ${machineState.currentState} fill:#2563eb,stroke:#1d4ed8,stroke-width:4px,color:#f8fafc`;
        mermaidContainer.textContent = diagram;
        mermaidContainer.removeAttribute('data-processed');
        mermaid.init(undefined, mermaidContainer);
    }

    function renderTape() {
        tape.innerHTML = '';

        machineState.tape.forEach((symbol, index) => {
            const cell = document.createElement('div');
            cell.className = 'tape-cell';

            if (index === machineState.headPosition) {
                cell.classList.add('active');
            }

            cell.textContent = symbol;
            tape.appendChild(cell);
        });

        const activeCell = tape.children[machineState.headPosition];
        if (activeCell) {
            const headPixelPosition =
                activeCell.offsetLeft + activeCell.offsetWidth / 2 - head.offsetWidth / 2;
            head.style.left = `${headPixelPosition}px`;
        }
    }

    function renderStatus() {
        currentStateSpan.textContent = machineState.currentState;
        stepCountSpan.textContent = machineState.stepCount;

        if (machineState.halted) {
            currentStateSpan.classList.add('halted');
            currentStateSpan.textContent += ' (Halted)';
        } else {
            currentStateSpan.classList.remove('halted');
        }
    }

    function render() {
        renderTape();
        renderStatus();
        updateDiagram();
    }

    function initialize() {
        const inputString = inputStringInput.value || '';
        machineState.tape = [...inputString];

        if (machineState.tape.length === 0) {
            machineState.tape.push(BLANK_SYMBOL);
        }

        machineState.headPosition = 0;
        machineState.currentState = 'q0';
        machineState.stepCount = 0;
        machineState.halted = false;

        if (machineState.runTimer) {
            clearInterval(machineState.runTimer);
            machineState.runTimer = null;
        }

        runBtn.disabled = false;
        runBtn.textContent = 'Run';

        parseRules();
        render();
    }

    function step() {
        if (machineState.halted) {
            return;
        }

        const currentSymbol = machineState.tape[machineState.headPosition] || BLANK_SYMBOL;
        const rule = machineState.rules[machineState.currentState]?.[currentSymbol];

        if (!rule) {
            machineState.halted = true;
            render();
            return;
        }

        machineState.tape[machineState.headPosition] = rule.writeSymbol;

        if (rule.move === 'R') {
            machineState.headPosition += 1;
            if (machineState.headPosition === machineState.tape.length) {
                machineState.tape.push(BLANK_SYMBOL);
            }
        } else if (rule.move === 'S') {
            // Stay on current cell.
        } else if (rule.move === 'L') {
             machineState.headPosition -= 1;
             if (machineState.headPosition < 0) {
                 machineState.tape.unshift(BLANK_SYMBOL);
                 machineState.headPosition = 0;
             }
         }

         machineState.currentState = rule.nextState;
         machineState.stepCount += 1;
         render();
     }

     function run() {
         if (machineState.halted || machineState.runTimer) {
             return;
         }

         runBtn.disabled = true;
         runBtn.textContent = 'Running...';

         machineState.runTimer = setInterval(() => {
             step();
             if (machineState.halted) {
                 clearInterval(machineState.runTimer);
                 machineState.runTimer = null;
                 runBtn.disabled = false;
                 runBtn.textContent = 'Run';
             }
         }, 200);
     }

     function reset() {
         if (machineState.runTimer) {
             clearInterval(machineState.runTimer);
         }

         machineState = {
             tape: [BLANK_SYMBOL],
             headPosition: 0,
             currentState: 'q0',
             rules: {},
             stepCount: 0,
             halted: false,
             runTimer: null
         };

         rulesInput.value = '';
         inputStringInput.value = '';
         runBtn.disabled = false;
         runBtn.textContent = 'Run';
         render();
     }

     initializeBtn.addEventListener('click', initialize);
     stepBtn.addEventListener('click', step);
     runBtn.addEventListener('click', run);
     resetBtn.addEventListener('click', reset);

     reset();
});
