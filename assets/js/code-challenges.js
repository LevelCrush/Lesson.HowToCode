// Code Challenge System for Interactive Learning
class CodeChallengeSystem {
    constructor() {
        this.challenges = new Map();
        this.currentChallenge = null;
    }

    // Register a new challenge
    registerChallenge(id, config) {
        this.challenges.set(id, {
            id,
            title: config.title,
            description: config.description,
            initialCode: config.initialCode || '',
            solution: config.solution,
            hints: config.hints || [],
            validator: config.validator,
            type: config.type || 'html' // html, css, javascript
        });
    }

    // Create challenge UI
    createChallengeUI(containerId, challengeId) {
        const container = document.getElementById(containerId);
        const challenge = this.challenges.get(challengeId);
        
        if (!challenge) {
            console.error(`Challenge ${challengeId} not found`);
            return;
        }

        this.currentChallenge = challenge;

        container.innerHTML = `
            <div class="code-challenge-container">
                <div class="challenge-header">
                    <h4>${challenge.title}</h4>
                    <p>${challenge.description}</p>
                </div>
                
                <div class="code-editor-section">
                    <div class="editor-toolbar">
                        <span class="language-label">${challenge.type.toUpperCase()}</span>
                        <button class="btn btn-sm btn-outline-info" onclick="codeChallenge.showHint()">
                            💡 Hint
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="codeChallenge.resetCode()">
                            ↺ Reset
                        </button>
                    </div>
                    
                    <textarea id="code-editor-${challengeId}" class="code-editor" rows="10">${challenge.initialCode}</textarea>
                    
                    <div class="editor-actions">
                        <button class="btn btn-primary" onclick="codeChallenge.runCode('${challengeId}')">
                            ▶ Run Code
                        </button>
                        <button class="btn btn-success" onclick="codeChallenge.checkSolution('${challengeId}')">
                            ✓ Check Solution
                        </button>
                    </div>
                </div>
                
                <div id="output-section-${challengeId}" class="output-section">
                    <div class="output-header">
                        <span>Output</span>
                        <button class="btn btn-sm btn-link" onclick="codeChallenge.clearOutput('${challengeId}')">
                            Clear
                        </button>
                    </div>
                    <div id="code-output-${challengeId}" class="code-output"></div>
                </div>
                
                <div id="feedback-${challengeId}" class="feedback-section"></div>
            </div>
        `;

        // Add syntax highlighting
        this.addSyntaxHighlighting(challengeId);
    }

    // Add basic syntax highlighting
    addSyntaxHighlighting(challengeId) {
        const editor = document.getElementById(`code-editor-${challengeId}`);
        editor.addEventListener('input', (e) => {
            // Store cursor position
            const cursorPos = e.target.selectionStart;
            
            // Add tab support
            if (e.inputType === 'insertText' && e.data === null) {
                return;
            }
        });

        // Add tab key support
        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = editor.selectionStart;
                const end = editor.selectionEnd;
                editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
                editor.selectionStart = editor.selectionEnd = start + 4;
            }
        });
    }

    // Run the code (display in output)
    runCode(challengeId) {
        const challenge = this.challenges.get(challengeId);
        const code = document.getElementById(`code-editor-${challengeId}`).value;
        const output = document.getElementById(`code-output-${challengeId}`);
        
        output.innerHTML = '';

        try {
            if (challenge.type === 'html') {
                // For HTML, render it in an iframe
                const iframe = document.createElement('iframe');
                iframe.className = 'output-iframe';
                iframe.srcdoc = code;
                output.appendChild(iframe);
            } else if (challenge.type === 'css') {
                // For CSS, apply it to a demo HTML structure
                const demoHTML = challenge.demoHTML || '<div class="demo">Demo Content</div>';
                const iframe = document.createElement('iframe');
                iframe.className = 'output-iframe';
                iframe.srcdoc = `
                    <html>
                    <head><style>${code}</style></head>
                    <body>${demoHTML}</body>
                    </html>
                `;
                output.appendChild(iframe);
            } else if (challenge.type === 'javascript') {
                // For JavaScript, execute in a sandboxed environment
                const result = this.executeJavaScript(code);
                output.innerHTML = `<pre>${result}</pre>`;
            }
        } catch (error) {
            output.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        }
    }

    // Execute JavaScript in a safe way
    executeJavaScript(code) {
        // Create a console capture
        const logs = [];
        const customConsole = {
            log: (...args) => logs.push(args.join(' ')),
            error: (...args) => logs.push('Error: ' + args.join(' ')),
            warn: (...args) => logs.push('Warning: ' + args.join(' '))
        };

        try {
            // Create a function with the code and custom console
            const func = new Function('console', code);
            func(customConsole);
            return logs.join('\\n') || 'Code executed successfully (no output)';
        } catch (error) {
            return `Error: ${error.message}`;
        }
    }

    // Check if the solution is correct
    checkSolution(challengeId) {
        const challenge = this.challenges.get(challengeId);
        const code = document.getElementById(`code-editor-${challengeId}`).value;
        const feedback = document.getElementById(`feedback-${challengeId}`);
        
        // Run the validator
        const result = challenge.validator(code);
        
        if (result.success) {
            feedback.innerHTML = `
                <div class="alert alert-success">
                    <strong>🎉 Great job!</strong> ${result.message || 'Your solution is correct!'}
                </div>
            `;
            
            // Store progress
            this.storeProgress(challengeId, true);
        } else {
            feedback.innerHTML = `
                <div class="alert alert-warning">
                    <strong>Not quite right.</strong> ${result.message || 'Try again!'}
                    ${result.hint ? `<br><small>Hint: ${result.hint}</small>` : ''}
                </div>
            `;
        }
    }

    // Show hint
    showHint() {
        if (!this.currentChallenge || !this.currentChallenge.hints.length) return;
        
        const hintIndex = (this.currentHintIndex || 0) % this.currentChallenge.hints.length;
        const hint = this.currentChallenge.hints[hintIndex];
        
        const feedback = document.getElementById(`feedback-${this.currentChallenge.id}`);
        feedback.innerHTML = `
            <div class="alert alert-info">
                <strong>💡 Hint ${hintIndex + 1}:</strong> ${hint}
            </div>
        `;
        
        this.currentHintIndex = hintIndex + 1;
    }

    // Reset code to initial state
    resetCode() {
        if (!this.currentChallenge) return;
        
        const editor = document.getElementById(`code-editor-${this.currentChallenge.id}`);
        editor.value = this.currentChallenge.initialCode;
        this.clearOutput(this.currentChallenge.id);
        document.getElementById(`feedback-${this.currentChallenge.id}`).innerHTML = '';
    }

    // Clear output
    clearOutput(challengeId) {
        document.getElementById(`code-output-${challengeId}`).innerHTML = '';
    }

    // Store progress in localStorage
    storeProgress(challengeId, completed) {
        const progress = JSON.parse(localStorage.getItem('codeProgress') || '{}');
        progress[challengeId] = {
            completed,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('codeProgress', JSON.stringify(progress));
    }

    // Get progress
    getProgress() {
        return JSON.parse(localStorage.getItem('codeProgress') || '{}');
    }
}

// Create global instance
const codeChallenge = new CodeChallengeSystem();

// HTML Validators
const htmlValidators = {
    containsTag: (tagName) => (code) => {
        const regex = new RegExp(`<${tagName}[^>]*>.*<\/${tagName}>`, 'i');
        return {
            success: regex.test(code),
            message: regex.test(code) 
                ? `Perfect! You've correctly used the <${tagName}> tag.`
                : `Make sure to include a <${tagName}> tag with closing </${tagName}> tag.`
        };
    },
    
    containsTags: (tags) => (code) => {
        const missing = tags.filter(tag => {
            const regex = new RegExp(`<${tag}[^>]*>.*<\/${tag}>`, 'i');
            return !regex.test(code);
        });
        
        return {
            success: missing.length === 0,
            message: missing.length === 0
                ? 'Excellent! All required tags are present.'
                : `Missing tags: ${missing.map(t => `<${t}>`).join(', ')}`,
            hint: missing.length > 0 ? `Remember to include both opening and closing tags` : null
        };
    },
    
    hasAttribute: (tagName, attrName) => (code) => {
        const regex = new RegExp(`<${tagName}[^>]*${attrName}=["'][^"']*["'][^>]*>`, 'i');
        return {
            success: regex.test(code),
            message: regex.test(code)
                ? `Great! Your <${tagName}> has the ${attrName} attribute.`
                : `Add a ${attrName} attribute to your <${tagName}> tag.`,
            hint: `Example: <${tagName} ${attrName}="value">content</${tagName}>`
        };
    }
};

// CSS Validators  
const cssValidators = {
    hasProperty: (selector, property) => (code) => {
        // Simple check for property existence
        const hasSelector = code.includes(selector);
        const hasProperty = code.includes(property);
        
        return {
            success: hasSelector && hasProperty,
            message: hasSelector && hasProperty
                ? `Perfect! You've styled ${selector} with ${property}.`
                : `Make sure to add ${property} to your ${selector} rule.`,
            hint: !hasSelector ? `First create a ${selector} { } rule` : `Add ${property}: value; inside the rule`
        };
    }
};

// JavaScript Validators
const jsValidators = {
    declaresVariable: (varName) => (code) => {
        const patterns = [
            new RegExp(`(let|const|var)\\s+${varName}\\s*=`),
            new RegExp(`${varName}\\s*=`)
        ];
        
        const found = patterns.some(pattern => pattern.test(code));
        
        return {
            success: found,
            message: found
                ? `Good! You've declared the variable ${varName}.`
                : `Declare a variable named ${varName}.`,
            hint: `Use let ${varName} = value; or const ${varName} = value;`
        };
    },
    
    callsFunction: (funcName) => (code) => {
        const regex = new RegExp(`${funcName}\\s*\\(`);
        return {
            success: regex.test(code),
            message: regex.test(code)
                ? `Excellent! You're calling ${funcName}().`
                : `Make sure to call the ${funcName}() function.`
        };
    }
};

// Export for use in lessons
window.htmlValidators = htmlValidators;
window.cssValidators = cssValidators;
window.jsValidators = jsValidators;