# GitHub CLI Deployment Guide

## Prerequisites
1. Install GitHub CLI: `brew install gh` (macOS) or see https://cli.github.com/
2. Authenticate: `gh auth login`

## Managing Secrets
```bash
# Set secrets (will prompt for value)
gh secret set VITE_WEATHER_API_KEY
gh secret set VITE_DEEPSEEK_API_KEY

# Alternative: Set secrets directly
gh secret set VITE_WEATHER_API_KEY --body "your_api_key_here"
gh secret set VITE_DEEPSEEK_API_KEY --body "your_api_key_here"

# List secrets
gh secret list
```

## Deployment Commands
```bash
# Trigger manual deployment
gh workflow run deploy.yml

# Check deployment status
gh run list --workflow=deploy.yml

# View logs for specific run
gh run view <run-id> --log
```

## Troubleshooting
- Ensure secrets are set before deployment
- Check workflow runs for errors: `gh run list`
- View detailed logs: `gh run view --log <run-id>`