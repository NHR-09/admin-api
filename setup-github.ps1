# Marvel Todo Admin API - GitHub Setup Script
# Run this script from the admin_api directory

Write-Host "🚀 Marvel Todo Admin API - GitHub Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "server.js")) {
    Write-Host "❌ Error: server.js not found!" -ForegroundColor Red
    Write-Host "Please run this script from the admin_api directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Found server.js - we're in the right directory" -ForegroundColor Green
Write-Host ""

# Check if git is installed
try {
    git --version | Out-Null
    Write-Host "✅ Git is installed" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Rename README files
Write-Host "📝 Preparing README..." -ForegroundColor Cyan
if (Test-Path "README.md") {
    Move-Item "README.md" "README_OLD.md" -Force
    Write-Host "   Renamed old README to README_OLD.md" -ForegroundColor Gray
}
if (Test-Path "README_GITHUB.md") {
    Move-Item "README_GITHUB.md" "README.md" -Force
    Write-Host "   Renamed README_GITHUB.md to README.md" -ForegroundColor Gray
}
Write-Host "✅ README prepared" -ForegroundColor Green
Write-Host ""

# Initialize git if needed
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Cyan
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✅ Git repository already initialized" -ForegroundColor Green
}
Write-Host ""

# Check for sensitive files
Write-Host "🔒 Checking for sensitive files..." -ForegroundColor Cyan
$sensitiveFiles = @()
if (Test-Path "serviceAccountKey.json") {
    $sensitiveFiles += "serviceAccountKey.json"
}
if (Test-Path ".env") {
    $sensitiveFiles += ".env"
}

if ($sensitiveFiles.Count -gt 0) {
    Write-Host "⚠️  Warning: Found sensitive files:" -ForegroundColor Yellow
    foreach ($file in $sensitiveFiles) {
        Write-Host "   - $file" -ForegroundColor Yellow
    }
    Write-Host "   These files are in .gitignore and won't be committed" -ForegroundColor Gray
} else {
    Write-Host "✅ No sensitive files found in directory" -ForegroundColor Green
}
Write-Host ""

# Stage all files
Write-Host "📦 Staging files..." -ForegroundColor Cyan
git add .
Write-Host "✅ Files staged" -ForegroundColor Green
Write-Host ""

# Create commit
Write-Host "💾 Creating initial commit..." -ForegroundColor Cyan
git commit -m "Initial commit: Marvel Todo Admin API

- Express REST API for notifications
- Firebase Admin SDK integration
- Beautiful web dashboard
- API key authentication
- Complete documentation
- Ready for deployment"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Initial commit created" -ForegroundColor Green
} else {
    Write-Host "⚠️  Commit may have failed or no changes to commit" -ForegroundColor Yellow
}
Write-Host ""

# Get GitHub username
Write-Host "📝 GitHub Repository Setup" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""
$username = Read-Host "Enter your GitHub username"

if ([string]::IsNullOrWhiteSpace($username)) {
    Write-Host "❌ Username cannot be empty!" -ForegroundColor Red
    exit 1
}

$repoName = "marvel-todo-admin-api"
$repoUrl = "https://github.com/$username/$repoName.git"

Write-Host ""
Write-Host "📋 Repository Details:" -ForegroundColor Cyan
Write-Host "   Username: $username" -ForegroundColor Gray
Write-Host "   Repo Name: $repoName" -ForegroundColor Gray
Write-Host "   URL: $repoUrl" -ForegroundColor Gray
Write-Host ""

# Check if GitHub CLI is installed
$hasGhCli = $false
try {
    gh --version | Out-Null
    $hasGhCli = $true
} catch {
    $hasGhCli = $false
}

if ($hasGhCli) {
    Write-Host "✅ GitHub CLI detected!" -ForegroundColor Green
    Write-Host ""
    $useGhCli = Read-Host "Do you want to create the repository using GitHub CLI? (y/n)"
    
    if ($useGhCli -eq "y" -or $useGhCli -eq "Y") {
        Write-Host ""
        Write-Host "🚀 Creating repository on GitHub..." -ForegroundColor Cyan
        
        $visibility = Read-Host "Make repository public or private? (public/private)"
        
        if ($visibility -eq "private") {
            gh repo create $repoName --private --source=. --remote=origin --push
        } else {
            gh repo create $repoName --public --source=. --remote=origin --push
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "🎉 Success! Repository created and pushed!" -ForegroundColor Green
            Write-Host ""
            Write-Host "📍 Your repository: https://github.com/$username/$repoName" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
            Write-Host "   1. Deploy to Railway: https://railway.app" -ForegroundColor Gray
            Write-Host "   2. Add environment variables (ADMIN_API_KEY)" -ForegroundColor Gray
            Write-Host "   3. Upload serviceAccountKey.json" -ForegroundColor Gray
            Write-Host "   4. Test your deployed API" -ForegroundColor Gray
            Write-Host ""
        } else {
            Write-Host "❌ Failed to create repository" -ForegroundColor Red
        }
        exit 0
    }
}

# Manual setup instructions
Write-Host ""
Write-Host "📝 Manual Setup Instructions:" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Go to: https://github.com/new" -ForegroundColor Yellow
Write-Host "2. Repository name: $repoName" -ForegroundColor Yellow
Write-Host "3. Description: Admin API and web dashboard for Marvel Todo app" -ForegroundColor Yellow
Write-Host "4. Choose Public or Private" -ForegroundColor Yellow
Write-Host "5. Don't initialize with README" -ForegroundColor Yellow
Write-Host "6. Click 'Create repository'" -ForegroundColor Yellow
Write-Host ""

$created = Read-Host "Have you created the repository on GitHub? (y/n)"

if ($created -eq "y" -or $created -eq "Y") {
    Write-Host ""
    Write-Host "🔗 Connecting to GitHub..." -ForegroundColor Cyan
    
    # Remove existing remote if any
    git remote remove origin 2>$null
    
    # Add new remote
    git remote add origin $repoUrl
    
    # Rename branch to main
    git branch -M main
    
    # Push to GitHub
    Write-Host "📤 Pushing to GitHub..." -ForegroundColor Cyan
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎉 Success! Code pushed to GitHub!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📍 Your repository: https://github.com/$username/$repoName" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "🚀 Next Steps:" -ForegroundColor Cyan
        Write-Host "   1. Deploy to Railway: https://railway.app" -ForegroundColor Gray
        Write-Host "   2. Add environment variables (ADMIN_API_KEY)" -ForegroundColor Gray
        Write-Host "   3. Upload serviceAccountKey.json" -ForegroundColor Gray
        Write-Host "   4. Test your deployed API" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "❌ Failed to push to GitHub" -ForegroundColor Red
        Write-Host ""
        Write-Host "Try these commands manually:" -ForegroundColor Yellow
        Write-Host "   git remote add origin $repoUrl" -ForegroundColor Gray
        Write-Host "   git branch -M main" -ForegroundColor Gray
        Write-Host "   git push -u origin main" -ForegroundColor Gray
        Write-Host ""
    }
} else {
    Write-Host ""
    Write-Host "📋 Run these commands after creating the repository:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   git remote add origin $repoUrl" -ForegroundColor Gray
    Write-Host "   git branch -M main" -ForegroundColor Gray
    Write-Host "   git push -u origin main" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "✨ Setup complete!" -ForegroundColor Green
Write-Host ""
