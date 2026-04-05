#!/bin/bash

# Marvel Todo Admin API - GitHub Setup Script
# Run this script from the admin_api directory

echo "🚀 Marvel Todo Admin API - GitHub Setup"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found!"
    echo "Please run this script from the admin_api directory"
    exit 1
fi

echo "✅ Found server.js - we're in the right directory"
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed!"
    echo "Please install Git first"
    exit 1
fi

echo "✅ Git is installed"
echo ""

# Rename README files
echo "📝 Preparing README..."
if [ -f "README.md" ]; then
    mv README.md README_OLD.md
    echo "   Renamed old README to README_OLD.md"
fi
if [ -f "README_GITHUB.md" ]; then
    mv README_GITHUB.md README.md
    echo "   Renamed README_GITHUB.md to README.md"
fi
echo "✅ README prepared"
echo ""

# Initialize git if needed
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already initialized"
fi
echo ""

# Check for sensitive files
echo "🔒 Checking for sensitive files..."
sensitive_files=()
if [ -f "serviceAccountKey.json" ]; then
    sensitive_files+=("serviceAccountKey.json")
fi
if [ -f ".env" ]; then
    sensitive_files+=(".env")
fi

if [ ${#sensitive_files[@]} -gt 0 ]; then
    echo "⚠️  Warning: Found sensitive files:"
    for file in "${sensitive_files[@]}"; do
        echo "   - $file"
    done
    echo "   These files are in .gitignore and won't be committed"
else
    echo "✅ No sensitive files found in directory"
fi
echo ""

# Stage all files
echo "📦 Staging files..."
git add .
echo "✅ Files staged"
echo ""

# Create commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Marvel Todo Admin API

- Express REST API for notifications
- Firebase Admin SDK integration
- Beautiful web dashboard
- API key authentication
- Complete documentation
- Ready for deployment"

if [ $? -eq 0 ]; then
    echo "✅ Initial commit created"
else
    echo "⚠️  Commit may have failed or no changes to commit"
fi
echo ""

# Get GitHub username
echo "📝 GitHub Repository Setup"
echo "========================="
echo ""
read -p "Enter your GitHub username: " username

if [ -z "$username" ]; then
    echo "❌ Username cannot be empty!"
    exit 1
fi

repo_name="marvel-todo-admin-api"
repo_url="https://github.com/$username/$repo_name.git"

echo ""
echo "📋 Repository Details:"
echo "   Username: $username"
echo "   Repo Name: $repo_name"
echo "   URL: $repo_url"
echo ""

# Check if GitHub CLI is installed
if command -v gh &> /dev/null; then
    echo "✅ GitHub CLI detected!"
    echo ""
    read -p "Do you want to create the repository using GitHub CLI? (y/n): " use_gh_cli
    
    if [ "$use_gh_cli" = "y" ] || [ "$use_gh_cli" = "Y" ]; then
        echo ""
        echo "🚀 Creating repository on GitHub..."
        
        read -p "Make repository public or private? (public/private): " visibility
        
        if [ "$visibility" = "private" ]; then
            gh repo create $repo_name --private --source=. --remote=origin --push
        else
            gh repo create $repo_name --public --source=. --remote=origin --push
        fi
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "🎉 Success! Repository created and pushed!"
            echo ""
            echo "📍 Your repository: https://github.com/$username/$repo_name"
            echo ""
            echo "🚀 Next Steps:"
            echo "   1. Deploy to Railway: https://railway.app"
            echo "   2. Add environment variables (ADMIN_API_KEY)"
            echo "   3. Upload serviceAccountKey.json"
            echo "   4. Test your deployed API"
            echo ""
        else
            echo "❌ Failed to create repository"
        fi
        exit 0
    fi
fi

# Manual setup instructions
echo ""
echo "📝 Manual Setup Instructions:"
echo "============================="
echo ""
echo "1. Go to: https://github.com/new"
echo "2. Repository name: $repo_name"
echo "3. Description: Admin API and web dashboard for Marvel Todo app"
echo "4. Choose Public or Private"
echo "5. Don't initialize with README"
echo "6. Click 'Create repository'"
echo ""

read -p "Have you created the repository on GitHub? (y/n): " created

if [ "$created" = "y" ] || [ "$created" = "Y" ]; then
    echo ""
    echo "🔗 Connecting to GitHub..."
    
    # Remove existing remote if any
    git remote remove origin 2>/dev/null
    
    # Add new remote
    git remote add origin $repo_url
    
    # Rename branch to main
    git branch -M main
    
    # Push to GitHub
    echo "📤 Pushing to GitHub..."
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 Success! Code pushed to GitHub!"
        echo ""
        echo "📍 Your repository: https://github.com/$username/$repo_name"
        echo ""
        echo "🚀 Next Steps:"
        echo "   1. Deploy to Railway: https://railway.app"
        echo "   2. Add environment variables (ADMIN_API_KEY)"
        echo "   3. Upload serviceAccountKey.json"
        echo "   4. Test your deployed API"
        echo ""
    else
        echo ""
        echo "❌ Failed to push to GitHub"
        echo ""
        echo "Try these commands manually:"
        echo "   git remote add origin $repo_url"
        echo "   git branch -M main"
        echo "   git push -u origin main"
        echo ""
    fi
else
    echo ""
    echo "📋 Run these commands after creating the repository:"
    echo ""
    echo "   git remote add origin $repo_url"
    echo "   git branch -M main"
    echo "   git push -u origin main"
    echo ""
fi

echo "✨ Setup complete!"
echo ""
