# GitHub Push Authentication Guide

## 🔐 Authentication Failed - How to Fix

The push failed because GitHub requires authentication. Here are two methods:

## Method 1: Personal Access Token (Recommended)

### Step 1: Create Personal Access Token
1. Go to **GitHub.com** → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
2. Click **"Generate new token (classic)"**
3. Give it a name: `Extension Test Suite Token`
4. Select scopes: ✅ **repo** (full control of private repositories)
5. Click **"Generate token"**
6. **COPY THE TOKEN** (you won't see it again!)

### Step 2: Use Token for Authentication
Run these commands in PowerShell:

```powershell
# Navigate to your project
cd "c:\Users\jawad\Desktop\1\wp-test-page"

# Push with token (replace YOUR_TOKEN with actual token)
git push https://YOUR_TOKEN@github.com/jawadgharzaldeen/test.git master
```

## Method 2: GitHub CLI (Alternative)

### Install GitHub CLI:
```powershell
# Install GitHub CLI
winget install --id GitHub.cli

# Authenticate
gh auth login

# Push using GitHub CLI
gh repo create jawadgharzaldeen/test --public --source=. --remote=origin --push
```

## Method 3: Use Git Credential Manager

### One-time setup:
```powershell
# Configure credential manager
git config --global credential.helper manager-core

# Try push again (will prompt for credentials)
git push -u origin master
```

---

## 🚀 After Successful Push

Your test suite will be available at:
- **Repository**: https://github.com/jawadgharzaldeen/test
- **GitHub Pages**: https://jawadgharzaldeen.github.io/test

## 📝 Enable GitHub Pages

1. Go to repository **Settings**
2. Scroll to **Pages** section
3. Select **Deploy from a branch**
4. Choose **main/master** branch
5. Click **Save**

Your test suite will be live at: `https://jawadgharzaldeen.github.io/test`

## 🔧 Update TinyMCE API Key

Once deployed, remember to:
1. Edit `index.html`
2. Replace `YOUR-API-KEY` with your actual TinyMCE API key
3. Commit and push the change

---

**Choose Method 1 (Personal Access Token) for the quickest setup!**