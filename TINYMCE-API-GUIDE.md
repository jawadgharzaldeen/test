# TinyMCE API Guide for Extension Testing

## 🔍 **What is TinyMCE?**

TinyMCE is the world's most popular JavaScript rich text editor (WYSIWYG). It's used by millions of websites including:
- **WordPress** (default editor)
- **Drupal**, **Joomla** 
- **Microsoft Office 365**
- **Salesforce**
- **Atlassian** products

## 📚 **Core TinyMCE API**

### **1. Initialization**
```javascript
tinymce.init({
    selector: 'textarea',           // Target elements
    height: 300,                    // Editor height
    menubar: false,                 // Hide menu bar
    plugins: ['lists', 'link'],     // Enable plugins
    toolbar: 'bold italic | link', // Custom toolbar
    setup: function(editor) {       // Setup callback
        editor.on('init', function() {
            console.log('Editor ready!');
        });
    }
});
```

### **2. Content Management**
```javascript
// Get editor instance
const editor = tinymce.get('my-editor');

// Set content
editor.setContent('<p>Hello <strong>World</strong>!</p>');

// Get content (HTML)
const html = editor.getContent();

// Get content (plain text)
const text = editor.getContent({format: 'text'});

// Insert at cursor position
editor.insertContent('<em>Inserted text</em>');

// Append content
editor.setContent(editor.getContent() + '<p>New paragraph</p>');
```

### **3. Editor Control**
```javascript
// Focus editor
editor.focus();

// Save content (triggers save events)
editor.save();

// Show/hide editor
editor.show();
editor.hide();

// Enable/disable editor
editor.setMode('readonly');
editor.setMode('design');

// Destroy editor
editor.destroy();
```

### **4. Events**
```javascript
editor.on('change', function(e) {
    console.log('Content changed:', e);
});

editor.on('keyup', function(e) {
    console.log('Key pressed:', e.key);
});

editor.on('focus', function(e) {
    console.log('Editor focused');
});

editor.on('blur', function(e) {
    console.log('Editor lost focus');
});
```

## 🔧 **Current Implementation in Your Test Suite**

Your `script.js` currently includes:

```javascript
// TinyMCE initialization (if available)
if (typeof tinymce !== 'undefined') {
    tinymce.init({
        selector: '.wp-editor-area',
        height: 200,
        menubar: false,
        plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | formatselect | bold italic backcolor | \
                 alignleft aligncenter alignright alignjustify | \
                 bullist numlist outdent indent | removeformat | help',
        setup: function(editor) {
            editor.on('init', function() {
                console.log('TinyMCE editor initialized for testing');
            });
        }
    });
}
```

## 🚀 **Enhanced Implementation for Extension Testing**

Here's an improved version that better supports form auto-filling:

```javascript
function initializeTinyMCE() {
    if (typeof tinymce !== 'undefined') {
        tinymce.init({
            selector: '.wp-editor-area, .tinymce-editor',
            height: 250,
            menubar: false,
            plugins: [
                'advlist autolink lists link image charmap anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste help wordcount'
            ],
            toolbar: 'undo redo | formatselect | bold italic underline | \
                     alignleft aligncenter alignright alignjustify | \
                     bullist numlist | link image | code fullscreen',
            
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
}
```

## 🎯 **Extension Integration Methods**

### **Method 1: Direct Content Setting**
```javascript
// For your extension to fill TinyMCE editors
function fillTinyMCEEditor(editorId, content) {
    const editor = tinymce.get(editorId);
    if (editor) {
        editor.setContent(content);
        editor.save(); // Sync with textarea
        
        // Visual feedback
        const container = editor.getContainer();
        container.classList.add('field-filled');
        setTimeout(() => {
            container.classList.remove('field-filled');
        }, 2000);
        
        return true;
    }
    return false;
}
```

### **Method 2: Global Registry Access**
```javascript
// Access all TinyMCE editors
if (window.tinyMCEEditors) {
    Object.keys(window.tinyMCEEditors).forEach(editorId => {
        const editor = window.tinyMCEEditors[editorId];
        editor.setContent('<p>Auto-filled content!</p>');
    });
}
```

### **Method 3: Event-Based Filling**
```javascript
// Listen for extension fill events
document.addEventListener('extension-fill-request', function(e) {
    const { selector, content } = e.detail;
    
    // Find matching TinyMCE editor
    const textarea = document.querySelector(selector);
    if (textarea && textarea.dataset.tinymceId) {
        const editor = tinymce.get(textarea.dataset.tinymceId);
        if (editor) {
            editor.setContent(content);
        }
    }
});
```

## 🔌 **Including TinyMCE in Your Test Suite**

Add this to your `index.html` in the `<head>` section:

```html
<!-- TinyMCE CDN -->
<script src="https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>

<!-- Or use your own API key for full features -->
<script src="https://cdn.tiny.cloud/1/YOUR-API-KEY/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>
```

## 📱 **Mobile & Responsive Support**

```javascript
tinymce.init({
    selector: '.wp-editor-area',
    // Mobile-friendly settings
    mobile: {
        theme: 'mobile',
        plugins: ['autosave', 'lists', 'autolink'],
        toolbar: ['undo', 'bold', 'italic', 'styleselect']
    },
    // Responsive toolbar
    toolbar_mode: 'sliding'
});
```

## 🧪 **Testing TinyMCE with Your Extension**

### **Test Cases:**
1. **Content Setting**: Can extension set rich HTML content?
2. **Plain Text**: Can extension set plain text that gets formatted?
3. **Event Triggering**: Do change events fire after auto-fill?
4. **Visual Feedback**: Does the green glow effect work?
5. **Multiple Editors**: Can extension fill multiple TinyMCE instances?

### **Debug Commands:**
```javascript
// Test in browser console
tinymce.get('editor-id').setContent('<h1>Test Content</h1>');
tinymce.get('editor-id').getContent();
tinymce.activeEditor.focus();

// List all editors
console.table(Object.keys(tinymce.editors));
```

## 📋 **Common Integration Issues & Solutions**

| Issue | Cause | Solution |
|-------|-------|----------|
| Editor not found | TinyMCE not loaded | Check CDN script tag |
| Content not setting | Wrong selector | Use `tinymce.get(id)` |
| Events not firing | Editor not ready | Wait for `init` event |
| Multiple editors | ID conflicts | Use unique IDs |
| Mobile issues | Desktop config | Add mobile settings |

## 🎨 **Visual Indicators for Testing**

Add CSS for better testing experience:
```css
/* TinyMCE focused state */
.tinymce-focused {
    box-shadow: 0 0 10px #667eea !important;
}

/* Field filled effect */
.mce-container.field-filled {
    box-shadow: 0 0 15px #4caf50 !important;
    animation: greenGlow 2s ease-out;
}

/* Test ready indicator */
[data-test-ready="true"]::before {
    content: "✅ TinyMCE Ready";
    position: absolute;
    top: -20px;
    left: 0;
    font-size: 12px;
    color: #4caf50;
}
```

This comprehensive TinyMCE integration will make your test suite much more effective for testing rich text editor compatibility with your form auto-filler extension!