# GitHub Actions Auto-Deployment Setup

## 🚀 Automatic Deployment Configuration

This setup will automatically deploy your app to Vercel every time you push code to the main branch.

## ⚙️ Required GitHub Secrets

You need to add these secrets to your GitHub repository:

### 1. VERCEL_TOKEN
- Go to: https://vercel.com/account/tokens
- Click "Create Token"
- Name it "GitHub Actions"
- Copy the token value

### 2. VERCEL_ORG_ID
Your organization ID: `franks-projects-343502d1`

### 3. VERCEL_PROJECT_ID  
Your project ID: `prj_MSBTbaj2p2lhUarPdF49DzNGv2td`

## 📝 How to Add Secrets to GitHub

1. Go to your GitHub repository: https://github.com/fcarrales/excuses-excuses-app
2. Click on "Settings" tab
3. Click on "Secrets and variables" → "Actions"
4. Click "New repository secret" for each:

   **Secret Name**: `VERCEL_TOKEN`
   **Secret Value**: [Your token from step 1 above]
   
   **Secret Name**: `VERCEL_ORG_ID`  
   **Secret Value**: `franks-projects-343502d1`
   
   **Secret Name**: `VERCEL_PROJECT_ID`
   **Secret Value**: `prj_MSBTbaj2p2lhUarPdF49DzNGv2td`

## 🎯 What Happens Next

Once you:
1. Add the secrets to GitHub
2. Push this code to your repository

GitHub Actions will:
- ✅ Run on every push to main branch
- ✅ Install dependencies
- ✅ Build the application
- ✅ Run tests (if any)
- ✅ Deploy to Vercel automatically
- ✅ Update your production URL

## 📊 Monitoring Deployments

- View deployment status: GitHub repository → "Actions" tab
- Each deployment will show build logs and success/failure status
- Failed deployments will show error details

## 🔥 Benefits

- **Zero manual work** - Just push code and it deploys
- **Fast deployments** - Usually complete in 2-3 minutes
- **Build verification** - Catches errors before deployment
- **Deployment history** - Track all deployments and rollback if needed
- **Instant updates** - Your live site updates automatically

No more manual `npx vercel --prod` commands needed! 🎉