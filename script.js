// Universal Form Auto-Filler Test Suite JavaScript

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeTestSuite();
});

// Test Suite Initialization
function initializeTestSuite() {
    // Initialize results tracking FIRST before anything else
    initializeResultsTracking();
    setupTabNavigation();
    setupEventListeners();
    initializeFormValidation();
    setupTestHelpers();
    initializeRichTextEditors();
    initializeFrameworkTests();
    displayWelcomeMessage();
}

// Tab Navigation System
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Update URL hash
            window.location.hash = targetTab;
            
            // Track tab visits
            trackTabVisit(targetTab);
        });
    });
    
    // Handle initial tab from URL hash
    const initialTab = window.location.hash.substring(1) || 'basic';
    const initialButton = document.querySelector(`[data-tab="${initialTab}"]`);
    if (initialButton) {
        initialButton.click();
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Clear forms button
    const clearButtons = document.querySelectorAll('.clear-form');
    clearButtons.forEach(button => {
        button.addEventListener('click', function() {
            const form = this.closest('form') || this.closest('.test-form');
            clearForm(form);
        });
    });
    
    // Test fill buttons
    const testFillButtons = document.querySelectorAll('.test-fill');
    testFillButtons.forEach(button => {
        button.addEventListener('click', function() {
            const form = this.closest('form') || this.closest('.test-form');
            testFillForm(form);
        });
    });
    
    // Field monitoring for testing
    setupFieldMonitoring();
}

// Form Validation
function initializeFormValidation() {
    // Email validation
    const emailFields = document.querySelectorAll('input[type="email"]');
    emailFields.forEach(field => {
        field.addEventListener('blur', validateEmail);
        field.addEventListener('input', clearValidation);
    });
    
    // Phone validation
    const phoneFields = document.querySelectorAll('input[type="tel"]');
    phoneFields.forEach(field => {
        field.addEventListener('blur', validatePhone);
        field.addEventListener('input', clearValidation);
    });
    
    // URL validation
    const urlFields = document.querySelectorAll('input[type="url"]');
    urlFields.forEach(field => {
        field.addEventListener('blur', validateURL);
        field.addEventListener('input', clearValidation);
    });
    
    // Password strength
    const passwordFields = document.querySelectorAll('input[type="password"]');
    passwordFields.forEach(field => {
        field.addEventListener('input', checkPasswordStrength);
    });
}

// Validation Functions
function validateEmail(event) {
    const field = event.target;
    const email = field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        showValidationMessage(field, 'Please enter a valid email address', 'error');
    } else if (email) {
        showValidationMessage(field, 'Valid email format', 'success');
    }
}

function validatePhone(event) {
    const field = event.target;
    const phone = field.value.trim();
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    
    if (phone && !phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
        showValidationMessage(field, 'Please enter a valid phone number', 'error');
    } else if (phone) {
        showValidationMessage(field, 'Valid phone format', 'success');
    }
}

function validateURL(event) {
    const field = event.target;
    const url = field.value.trim();
    
    try {
        if (url) {
            new URL(url);
            showValidationMessage(field, 'Valid URL format', 'success');
        }
    } catch {
        if (url) {
            showValidationMessage(field, 'Please enter a valid URL', 'error');
        }
    }
}

function checkPasswordStrength(event) {
    const field = event.target;
    const password = field.value;
    const strength = calculatePasswordStrength(password);
    
    showPasswordStrength(field, strength);
}

function calculatePasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score += 25;
    if (password.length >= 12) score += 25;
    if (/[a-z]/.test(password)) score += 12.5;
    if (/[A-Z]/.test(password)) score += 12.5;
    if (/[0-9]/.test(password)) score += 12.5;
    if (/[^A-Za-z0-9]/.test(password)) score += 12.5;
    
    return Math.min(100, score);
}

function showPasswordStrength(field, strength) {
    let message = '';
    let className = '';
    
    if (strength < 30) {
        message = 'Weak password';
        className = 'error';
    } else if (strength < 60) {
        message = 'Fair password';
        className = 'warning';
    } else if (strength < 80) {
        message = 'Good password';
        className = 'success';
    } else {
        message = 'Strong password';
        className = 'success';
    }
    
    showValidationMessage(field, message, className);
}

function showValidationMessage(field, message, type) {
    let messageEl = field.parentNode.querySelector('.validation-message');
    if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.className = 'validation-message';
        field.parentNode.appendChild(messageEl);
    }
    
    messageEl.textContent = message;
    messageEl.className = `validation-message ${type}`;
}

function clearValidation(event) {
    const field = event.target;
    const messageEl = field.parentNode.querySelector('.validation-message');
    if (messageEl) {
        messageEl.textContent = '';
        messageEl.className = 'validation-message';
    }
}

// Rich Text Editor Initialization
function initializeRichTextEditors() {
    // TinyMCE initialization (if available)
    if (typeof tinymce !== 'undefined') {
        tinymce.init({
            selector: '.wp-editor-area, .tinymce-editor',
            height: 250,
            menubar: false,
            plugins: 'lists link autolink',
            toolbar: 'undo redo | bold italic | bullist numlist | link',
            
            // Content styling
            content_style: 'body { font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif; font-size: 14px }',
            
            // Auto-fill support
            setup: function(editor) {
                // Initialize event
                editor.on('init', function() {
                    console.log('✅ TinyMCE initialized:', editor.id);
                    
                    // Add to global editor registry for extension access
                    if (!window.tinyMCEEditors) {
                        window.tinyMCEEditors = {};
                    }
                    window.tinyMCEEditors[editor.id] = editor;
                });
                
                // Content change tracking
                editor.on('change input', function() {
                    console.log('📝 TinyMCE content changed:', editor.id);
                    
                    // Trigger custom event for extension detection
                    const customEvent = new CustomEvent('tinymce-content-changed', {
                        detail: {
                            editorId: editor.id,
                            content: editor.getContent(),
                            textContent: editor.getContent({format: 'text'})
                        }
                    });
                    document.dispatchEvent(customEvent);
                });
                
                // Focus/blur tracking
                editor.on('focus', function() {
                    console.log('🎯 TinyMCE focused:', editor.id);
                    editor.getContainer().classList.add('tinymce-focused');
                });
                
                editor.on('blur', function() {
                    console.log('👋 TinyMCE blurred:', editor.id);
                    editor.getContainer().classList.remove('tinymce-focused');
                });
            },
            
            // Extension-friendly settings
            init_instance_callback: function(editor) {
                // Make editor accessible for form auto-fill
                editor.getElement().setAttribute('data-tinymce-id', editor.id);
                
                // Add visual indicator for testing
                editor.getContainer().setAttribute('data-test-ready', 'true');
            }
        });
    } else {
        console.warn('⚠️ TinyMCE not loaded. Rich text editing will use contenteditable fallback.');
    }
    
    // Simple contenteditable setup
    const editableFields = document.querySelectorAll('.contenteditable-field');
    editableFields.forEach(field => {
        field.addEventListener('focus', function() {
            if (this.textContent === this.dataset.placeholder) {
                this.textContent = '';
                this.style.color = '#333';
            }
        });
        
        field.addEventListener('blur', function() {
            if (this.textContent.trim() === '') {
                this.textContent = this.dataset.placeholder;
                this.style.color = '#999';
            }
        });
    });
}

// Framework Tests Initialization
function initializeFrameworkTests() {
    // React-like component simulation
    setupReactTest();
    
    // Vue-like component simulation
    setupVueTest();
    
    // Angular-like component simulation
    setupAngularTest();
    
    // jQuery integration
    setupJQueryTest();
}

function setupReactTest() {
    const reactContainer = document.getElementById('react-form');
    if (reactContainer) {
        // Simulate React component behavior
        const inputs = reactContainer.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('change', function() {
                // Simulate React state update
                this.setAttribute('data-react-value', this.value);
                console.log('React simulation: State updated for', this.name);
            });
        });
    }
}

function setupVueTest() {
    const vueContainer = document.getElementById('vue-form');
    if (vueContainer) {
        // Simulate Vue.js v-model behavior
        const inputs = vueContainer.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                // Simulate Vue reactive data
                this.setAttribute('data-vue-model', this.value);
                console.log('Vue simulation: Model updated for', this.name);
            });
        });
    }
}

function setupAngularTest() {
    const angularContainer = document.getElementById('angular-form');
    if (angularContainer) {
        // Simulate Angular form validation and binding
        const inputs = angularContainer.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                // Simulate Angular model binding
                this.setAttribute('data-ng-model', this.value);
                
                // Simulate Angular validation
                const isValid = this.checkValidity();
                const validationEl = this.parentNode.querySelector('.ng-validation');
                if (validationEl) {
                    validationEl.textContent = isValid ? 'Valid' : 'Invalid input';
                    validationEl.className = `ng-validation ${isValid ? 'success' : 'error'}`;
                }
                
                console.log('Angular simulation: Model and validation updated for', this.name);
            });
        });
    }
}

function setupJQueryTest() {
    // jQuery simulation (if jQuery is available)
    if (typeof $ !== 'undefined') {
        $('#jquery-form input, #jquery-form select, #jquery-form textarea').on('change', function() {
            console.log('jQuery: Field changed', this.name, this.value);
            $(this).attr('data-jquery-value', this.value);
        });
    }
}

// Test Helper Functions
function setupTestHelpers() {
    // Add test data generator
    window.generateTestData = generateTestData;
    window.clearForm = clearForm;
    window.testFillForm = testFillForm;
    window.runFieldDetectionTest = runFieldDetectionTest;
    window.trackFillingAccuracy = trackFillingAccuracy;
}

function generateTestData() {
    return {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-123-4567',
        address: '123 Main Street',
        city: 'Anytown',
        state: 'CA',
        zipCode: '12345',
        country: 'United States',
        website: 'https://johndoe.com',
        company: 'Test Company Inc.',
        jobTitle: 'Software Developer',
        birthDate: '1990-01-15',
        age: '33',
        bio: 'This is a test biography for form filling validation.',
        interests: ['technology', 'sports', 'reading'],
        gender: 'male',
        newsletter: true,
        terms: true
    };
}

function clearForm(form) {
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = false;
        } else if (input.type === 'file') {
            input.value = '';
        } else {
            input.value = '';
        }
        
        // Clear validation messages
        const validationEl = input.parentNode.querySelector('.validation-message, .ng-validation');
        if (validationEl) {
            validationEl.textContent = '';
            validationEl.className = validationEl.className.replace(/error|success|warning/g, '');
        }
        
        // Remove field-filled class
        input.classList.remove('field-filled');
    });
    
    // Clear rich text editors
    const editableFields = form.querySelectorAll('.contenteditable-field');
    editableFields.forEach(field => {
        field.textContent = field.dataset.placeholder || '';
        field.style.color = '#999';
    });
    
    console.log('Form cleared for testing');
}

function testFillForm(form) {
    if (!form) return;
    
    const testData = generateTestData();
    let filledCount = 0;
    let totalFields = 0;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        totalFields++;
        
        const fieldName = input.name || input.id || input.getAttribute('data-field');
        let value = null;
        
        // Map field names to test data
        if (fieldName) {
            value = findTestDataValue(fieldName, testData);
        }
        
        if (value !== null) {
            fillTestField(input, value);
            filledCount++;
        }
    });
    
    // Update results
    trackFillingAccuracy(filledCount, totalFields, form.id || 'unknown');
    
    console.log(`Test fill completed: ${filledCount}/${totalFields} fields filled`);
}

function findTestDataValue(fieldName, testData) {
    const field = fieldName.toLowerCase();
    
    // Direct matches
    if (testData[field]) return testData[field];
    
    // Pattern matching
    if (field.includes('first') || field.includes('fname')) return testData.firstName;
    if (field.includes('last') || field.includes('lname')) return testData.lastName;
    if (field.includes('email') || field.includes('mail')) return testData.email;
    if (field.includes('phone') || field.includes('tel')) return testData.phone;
    if (field.includes('address')) return testData.address;
    if (field.includes('city')) return testData.city;
    if (field.includes('state') || field.includes('region')) return testData.state;
    if (field.includes('zip') || field.includes('postal')) return testData.zipCode;
    if (field.includes('country')) return testData.country;
    if (field.includes('website') || field.includes('url')) return testData.website;
    if (field.includes('company') || field.includes('organization')) return testData.company;
    if (field.includes('job') || field.includes('position') || field.includes('title')) return testData.jobTitle;
    if (field.includes('birth') || field.includes('dob')) return testData.birthDate;
    if (field.includes('age')) return testData.age;
    if (field.includes('bio') || field.includes('about') || field.includes('description')) return testData.bio;
    if (field.includes('gender')) return testData.gender;
    if (field.includes('newsletter') || field.includes('subscribe')) return testData.newsletter;
    if (field.includes('terms') || field.includes('agree')) return testData.terms;
    
    return null;
}

function fillTestField(input, value) {
    if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = Boolean(value);
    } else if (input.type === 'file') {
        // Can't programmatically set file inputs
        return;
    } else {
        input.value = value;
    }
    
    // Add visual feedback
    input.classList.add('field-filled');
    
    // Trigger events
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    
    // Remove visual feedback after delay
    setTimeout(() => {
        input.classList.remove('field-filled');
    }, 3000);
}

// Field Monitoring for Extension Testing
function setupFieldMonitoring() {
    let fillEvents = [];
    
    // Monitor all form inputs
    document.addEventListener('input', function(e) {
        if (e.target.matches('input, select, textarea')) {
            trackFieldFill(e.target);
        }
    });
    
    function trackFieldFill(field) {
        const fieldInfo = {
            timestamp: Date.now(),
            fieldName: field.name || field.id || 'unnamed',
            fieldType: field.type || field.tagName.toLowerCase(),
            value: field.value,
            filled: field.value.length > 0,
            selectors: generateFieldSelectors(field)
        };
        
        fillEvents.push(fieldInfo);
        
        // Keep only recent events
        if (fillEvents.length > 100) {
            fillEvents = fillEvents.slice(-100);
        }
        
        updateFieldStats(fieldInfo);
    }
    
    // Make fill events available globally for inspection
    window.getFieldEvents = () => fillEvents;
}

function generateFieldSelectors(field) {
    const selectors = [];
    
    if (field.id) selectors.push(`#${field.id}`);
    if (field.name) selectors.push(`[name="${field.name}"]`);
    if (field.className) selectors.push(`.${field.className.split(' ').join('.')}`);
    
    // Add attribute selectors
    ['data-field', 'data-name', 'placeholder'].forEach(attr => {
        const value = field.getAttribute(attr);
        if (value) selectors.push(`[${attr}="${value}"]`);
    });
    
    return selectors;
}

// Results Tracking
function initializeResultsTracking() {
    window.testResults = {
        tabVisits: {},
        fieldsFilled: 0,
        totalFields: 0,
        accuracy: 0,
        formTests: {},
        startTime: Date.now()
    };
}

function trackTabVisit(tabId) {
    if (!window.testResults.tabVisits[tabId]) {
        window.testResults.tabVisits[tabId] = 0;
    }
    window.testResults.tabVisits[tabId]++;
    updateResultsDisplay();
}

function trackFillingAccuracy(filled, total, formId) {
    window.testResults.fieldsFilled += filled;
    window.testResults.totalFields += total;
    window.testResults.accuracy = (window.testResults.fieldsFilled / window.testResults.totalFields) * 100;
    
    if (!window.testResults.formTests[formId]) {
        window.testResults.formTests[formId] = [];
    }
    
    window.testResults.formTests[formId].push({
        filled,
        total,
        accuracy: (filled / total) * 100,
        timestamp: Date.now()
    });
    
    updateResultsDisplay();
}

function updateFieldStats(fieldInfo) {
    // Update real-time stats in results tab
    const resultsTab = document.getElementById('results');
    if (resultsTab) {
        updateResultsDisplay();
    }
}

function updateResultsDisplay() {
    const results = window.testResults;
    
    // Update metrics in results tab
    updateElement('total-tabs-visited', Object.keys(results.tabVisits).length);
    updateElement('total-fields-filled', results.fieldsFilled);
    updateElement('total-fields-tested', results.totalFields);
    updateElement('overall-accuracy', `${results.accuracy.toFixed(1)}%`);
    updateElement('test-duration', formatDuration(Date.now() - results.startTime));
    
    // Update form-specific results
    updateFormResults();
    
    // Update score summary
    updateScoreSummary();
}

function updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

function updateFormResults() {
    const formResultsContainer = document.getElementById('form-test-results');
    if (!formResultsContainer) return;
    
    const results = window.testResults.formTests;
    let html = '<h4>Form Test Results</h4>';
    
    for (const [formId, tests] of Object.entries(results)) {
        const latestTest = tests[tests.length - 1];
        html += `
            <div class="form-result">
                <strong>${formId}:</strong> 
                ${latestTest.filled}/${latestTest.total} fields 
                (${latestTest.accuracy.toFixed(1)}% accuracy)
            </div>
        `;
    }
    
    formResultsContainer.innerHTML = html;
}

function updateScoreSummary() {
    const scoreBar = document.querySelector('.score-fill');
    const scoreMessage = document.querySelector('.score-message');
    
    if (scoreBar && scoreMessage) {
        const accuracy = window.testResults.accuracy;
        scoreBar.style.width = `${accuracy}%`;
        
        let message = '';
        if (accuracy >= 90) {
            message = 'Excellent! The extension is working perfectly.';
        } else if (accuracy >= 75) {
            message = 'Good performance. Some minor improvements possible.';
        } else if (accuracy >= 50) {
            message = 'Fair performance. Consider reviewing field mappings.';
        } else {
            message = 'Poor performance. Field detection needs improvement.';
        }
        
        scoreMessage.textContent = message;
    }
}

function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60));
    
    if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

// Field Detection Test
function runFieldDetectionTest() {
    console.log('Running comprehensive field detection test...');
    
    const allFields = document.querySelectorAll('input, select, textarea');
    const detectionResults = [];
    
    allFields.forEach(field => {
        const fieldAnalysis = analyzeField(field);
        detectionResults.push(fieldAnalysis);
    });
    
    // Log results
    console.table(detectionResults);
    
    // Update results display
    displayDetectionResults(detectionResults);
    
    return detectionResults;
}

function analyzeField(field) {
    const analysis = {
        element: field.tagName.toLowerCase(),
        type: field.type || 'text',
        id: field.id || '',
        name: field.name || '',
        className: field.className || '',
        placeholder: field.placeholder || '',
        label: findFieldLabel(field),
        selectors: generateFieldSelectors(field),
        score: calculateFieldScore(field),
        detectedPurpose: detectFieldPurpose(field)
    };
    
    return analysis;
}

function findFieldLabel(field) {
    // Find associated label
    if (field.id) {
        const label = document.querySelector(`label[for="${field.id}"]`);
        if (label) return label.textContent.trim();
    }
    
    // Find parent label
    const parentLabel = field.closest('label');
    if (parentLabel) return parentLabel.textContent.trim();
    
    // Find previous sibling label
    let sibling = field.previousElementSibling;
    while (sibling) {
        if (sibling.tagName === 'LABEL') {
            return sibling.textContent.trim();
        }
        sibling = sibling.previousElementSibling;
    }
    
    return '';
}

function calculateFieldScore(field) {
    let score = 0;
    
    // ID bonus
    if (field.id) score += 20;
    
    // Name attribute bonus
    if (field.name) score += 15;
    
    // Type specificity bonus
    if (field.type && field.type !== 'text') score += 10;
    
    // Label bonus
    const label = findFieldLabel(field);
    if (label) score += 15;
    
    // Placeholder bonus
    if (field.placeholder) score += 10;
    
    // Class bonus
    if (field.className) score += 5;
    
    // Visibility bonus
    if (isFieldVisible(field)) score += 10;
    
    // Semantic HTML bonus
    if (field.autocomplete) score += 15;
    
    return score;
}

function isFieldVisible(field) {
    const style = window.getComputedStyle(field);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           field.offsetWidth > 0 && 
           field.offsetHeight > 0;
}

function detectFieldPurpose(field) {
    const indicators = [
        field.id?.toLowerCase() || '',
        field.name?.toLowerCase() || '',
        field.className?.toLowerCase() || '',
        field.placeholder?.toLowerCase() || '',
        findFieldLabel(field).toLowerCase() || ''
    ].join(' ');
    
    // Common field patterns
    if (/first.*name|fname/i.test(indicators)) return 'firstName';
    if (/last.*name|lname/i.test(indicators)) return 'lastName';
    if (/email|mail/i.test(indicators)) return 'email';
    if (/phone|tel/i.test(indicators)) return 'phone';
    if (/address|street/i.test(indicators)) return 'address';
    if (/city/i.test(indicators)) return 'city';
    if (/state|region/i.test(indicators)) return 'state';
    if (/zip|postal/i.test(indicators)) return 'zipCode';
    if (/country/i.test(indicators)) return 'country';
    if (/password|pwd/i.test(indicators)) return 'password';
    if (/birth|dob/i.test(indicators)) return 'birthDate';
    if (/company|organization/i.test(indicators)) return 'company';
    if (/website|url/i.test(indicators)) return 'website';
    
    return 'unknown';
}

function displayDetectionResults(results) {
    const resultsContainer = document.getElementById('detection-results');
    if (!resultsContainer) return;
    
    let html = '<h4>Field Detection Analysis</h4>';
    html += '<div class="detection-summary">';
    html += `<p>Total fields analyzed: ${results.length}</p>`;
    
    const averageScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    html += `<p>Average detection score: ${averageScore.toFixed(1)}/100</p>`;
    
    const purposeDetected = results.filter(r => r.detectedPurpose !== 'unknown').length;
    html += `<p>Purpose detected: ${purposeDetected}/${results.length} (${(purposeDetected/results.length*100).toFixed(1)}%)</p>`;
    
    html += '</div>';
    
    // Top performing fields
    const topFields = results.sort((a, b) => b.score - a.score).slice(0, 5);
    html += '<h5>Top Scoring Fields</h5><ul>';
    topFields.forEach(field => {
        html += `<li>${field.element}${field.type ? `[${field.type}]` : ''} - Score: ${field.score} - Purpose: ${field.detectedPurpose}</li>`;
    });
    html += '</ul>';
    
    resultsContainer.innerHTML = html;
}

// Welcome Message
function displayWelcomeMessage() {
    console.log(`
    ╔══════════════════════════════════════╗
    ║   Universal Form Auto-Filler Test    ║
    ║              Suite v2.0              ║
    ╚══════════════════════════════════════╝
    
    🧪 Test Suite Ready!
    📊 Results tracking initialized
    🎯 Field detection active
    
    Available test functions:
    - generateTestData()
    - clearForm(form)
    - testFillForm(form)
    - runFieldDetectionTest()
    - getFieldEvents()
    
    Happy testing! 🚀
    `);
}

// TinyMCE Helper Functions for Extension Testing
window.tinyMCEHelpers = {
    // Fill TinyMCE editor with content
    fillEditor: function(editorId, content) {
        const editor = tinymce.get(editorId);
        if (editor) {
            editor.setContent(content);
            editor.save(); // Sync with textarea
            
            // Visual feedback
            const container = editor.getContainer();
            container.classList.add('field-filled');
            setTimeout(() => {
                container.classList.remove('field-filled');
            }, 3000);
            
            console.log('📝 TinyMCE filled:', editorId);
            return true;
        }
        console.warn('⚠️ TinyMCE editor not found:', editorId);
        return false;
    },
    
    // Fill all TinyMCE editors with test content
    fillAllEditors: function(content = '<p>This is test content for the <strong>TinyMCE</strong> editor. The extension should be able to detect and fill rich text editors automatically.</p><p>Testing <em>italic text</em> and <u>underlined text</u>.</p>') {
        if (window.tinyMCEEditors) {
            let filledCount = 0;
            Object.keys(window.tinyMCEEditors).forEach(editorId => {
                if (this.fillEditor(editorId, content)) {
                    filledCount++;
                }
            });
            console.log(`📊 Filled ${filledCount} TinyMCE editors`);
            return filledCount;
        }
        return 0;
    },
    
    // Get all editor contents
    getAllContents: function() {
        const contents = {};
        if (window.tinyMCEEditors) {
            Object.keys(window.tinyMCEEditors).forEach(editorId => {
                const editor = window.tinyMCEEditors[editorId];
                contents[editorId] = {
                    html: editor.getContent(),
                    text: editor.getContent({format: 'text'})
                };
            });
        }
        return contents;
    },
    
    // Clear all editors
    clearAllEditors: function() {
        if (window.tinyMCEEditors) {
            let clearedCount = 0;
            Object.keys(window.tinyMCEEditors).forEach(editorId => {
                const editor = window.tinyMCEEditors[editorId];
                editor.setContent('');
                clearedCount++;
            });
            console.log(`🧹 Cleared ${clearedCount} TinyMCE editors`);
            return clearedCount;
        }
        return 0;
    },
    
    // List all available editors
    listEditors: function() {
        if (window.tinyMCEEditors) {
            const editorInfo = Object.keys(window.tinyMCEEditors).map(editorId => {
                const editor = window.tinyMCEEditors[editorId];
                return {
                    id: editorId,
                    element: editor.getElement().tagName,
                    hasContent: editor.getContent().length > 0,
                    wordCount: editor.plugins.wordcount ? editor.plugins.wordcount.getCount() : 'N/A'
                };
            });
            console.table(editorInfo);
            return editorInfo;
        }
        return [];
    }
};

// Extension Detection Helper
window.extensionHelper = {
    // Enable detection mode for extension scanning
    enableDetectionMode: function() {
        document.body.classList.add('extension-detection-mode');
        console.log('🔍 Extension detection mode enabled - all fields are now visible for scanning');
        
        // Auto-disable after 5 seconds
        setTimeout(() => {
            this.disableDetectionMode();
        }, 5000);
    },
    
    // Disable detection mode
    disableDetectionMode: function() {
        document.body.classList.remove('extension-detection-mode');
        console.log('👁️ Extension detection mode disabled - normal tab visibility restored');
    },
    
    // Get all form fields across all tabs
    getAllFields: function() {
        // Temporarily enable detection mode
        this.enableDetectionMode();
        
        setTimeout(() => {
            const allFields = document.querySelectorAll('input, select, textarea');
            const fieldsByTab = {};
            
            allFields.forEach(field => {
                const tabContent = field.closest('.tab-content');
                const tabId = tabContent ? tabContent.id : 'unknown';
                
                if (!fieldsByTab[tabId]) {
                    fieldsByTab[tabId] = [];
                }
                
                fieldsByTab[tabId].push({
                    element: field.tagName.toLowerCase(),
                    type: field.type || 'text',
                    id: field.id || '',
                    name: field.name || '',
                    placeholder: field.placeholder || '',
                    visible: field.offsetWidth > 0 && field.offsetHeight > 0
                });
            });
            
            console.log('📊 All fields by tab:', fieldsByTab);
            console.log(`📈 Total fields found: ${allFields.length}`);
            
            this.disableDetectionMode();
        }, 100);
    }
};

// Listen for extension messages to enable detection mode
document.addEventListener('extension-scan-request', function() {
    console.log('📡 Extension scan request received - enabling detection mode');
    window.extensionHelper.enableDetectionMode();
});

// Automatically enable detection mode when extension popup is likely to be opened
let lastActivityTime = Date.now();
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        const timeSinceLastActivity = Date.now() - lastActivityTime;
        if (timeSinceLastActivity > 2000) { // If page was hidden for more than 2 seconds
            console.log('📄 Page became visible after being away - enabling detection mode for potential extension scan');
            window.extensionHelper.enableDetectionMode();
        }
    }
    lastActivityTime = Date.now();
});

// Export functions for external use
window.testSuite = {
    generateTestData,
    clearForm,
    testFillForm,
    runFieldDetectionTest,
    trackFillingAccuracy,
    getResults: () => window.testResults,
    getFieldEvents: () => window.getFieldEvents?.() || [],
    
    // TinyMCE integration
    tinyMCE: window.tinyMCEHelpers,
    
    // Extension detection helper
    extension: window.extensionHelper
};