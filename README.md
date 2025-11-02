# Strava API Integration Guide

A comprehensive guide for integrating Strava API into your application, from initial setup to production deployment.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Initial Setup with Postman](#initial-setup-with-postman)
- [Local Development Setup](#local-development-setup)
- [Production Deployment](#production-deployment)
- [Environment Variables](#environment-variables)
- [Security Best Practices](#security-best-practices)

## Prerequisites

Before you begin, make sure you have:

- A Strava account
- [Postman](https://www.postman.com/downloads/) installed (optional for initial testing)
- Basic understanding of OAuth 2.0 flow
- A code editor and development environment

## Initial Setup with Postman

Follow this detailed guide to understand the Strava API OAuth flow using Postman:

👉 **[Holding Your Hand Through Strava's API](https://jessicasalbert.medium.com/holding-your-hand-through-stravas-api-e642d15695f2)** by Jessica Salbert

This guide will walk you through:
- Creating a Strava API application
- Understanding OAuth 2.0 authorization flow
- Making your first API requests
- Obtaining access tokens and refresh tokens

## Local Development Setup

### 1. Create Strava API Application

1. Go to [Strava API Settings](https://www.strava.com/settings/api)
2. Create a new application
3. Fill in the required information:
   - **Application Name**: Your app name
   - **Category**: Choose appropriate category
   - **Club**: Optional
   - **Website**: Your local development URL
   - **Authorization Callback Domain**: `localhost` (for local development)

### 2. Configure Environment Variables

Create a `.env` file in your project root:

```env
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
STRAVA_ACCESS_TOKEN=your_access_token
STRAVA_REFRESH_TOKEN=your_refresh_token
STRAVA_REDIRECT_URI=http://localhost:3000/auth/callback
```

> ⚠️ **Important**: Make sure the `STRAVA_REDIRECT_URI` matches the callback URL in your application code.

### 3. Local Development Notes

- Set **Authorization Callback Domain** to `localhost` in your Strava API settings
- Use `https://localhost:PORT/auth/callback` as your redirect URI (for example: `https://localhost:4321/auth/callback`)
- Never commit your `.env` file to version control (add it to `.gitignore`)

## Production Deployment

### 1. Update Strava API Settings

Before deploying to production:

1. Go to your [Strava API Settings](https://www.strava.com/settings/api)
2. Update **Authorization Callback Domain** to your production domain:
   - ✅ `yourdomain.com`
   - ✅ `www.yourdomain.com`
   - ❌ ~~`http://yourdomain.com`~~ (no protocol)
   - ❌ ~~`yourdomain.com/callback`~~ (no path)

### 2. Update Environment Variables

Update your production environment variables:

```env
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
STRAVA_ACCESS_TOKEN=your_access_token
STRAVA_REFRESH_TOKEN=your_refresh_token
STRAVA_REDIRECT_URI=https://yourdomain.com/auth/callback
```

> ⚠️ **Critical**: Ensure the redirect URI uses `https://` in production and matches your domain exactly.

### 3. Implement Secure Token Storage

For production, **do not** store sensitive tokens in environment variables alone. Use a secure storage solution:

#### Recommended Storage Options:

- Key-Value Stores ([Cloudflare Workers KV](https://developers.cloudflare.com/kv), etc.)
- Databases (Supabase, PostgreSQL, etc.)
- Secret Management Services (AWS Secrets Manager, Google Cloud Secret Manager, etc.)

#### What to Store Securely:

```javascript
// Example data structure for secure storage
{
  client_id: "unique_user_identifier",
  client_secret: "your_client_secret",
  access_token: "user_access_token",
  refresh_token: "user_refresh_token",
  expires_at: 1234567890,
  token_type: "Bearer",
  athlete_id: "athlete_id_from_strava"
}
```

## Environment Variables

### Required Variables

| Variable | Description | Example (Local) | Example (Production) |
|----------|-------------|-----------------|---------------------|
| `STRAVA_CLIENT_ID` | Your Strava application ID | `12345` | `12345` |
| `STRAVA_CLIENT_SECRET` | Your Strava application secret | `abc123...` | `abc123...` |
| `STRAVA_REDIRECT_URI` | OAuth callback URL | `http://localhost:3000/auth/callback` | `https://yourdomain.com/auth/callback` |

## Token Refresh Flow

Strava access tokens expire after 6 hours. Implement automatic token refresh:

```javascript
// Pseudocode for token refresh
async function refreshAccessToken(refreshToken) {
  const response = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    })
  });
  
  const data = await response.json();
  
  // Store new tokens securely
  await storeTokens({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at
  });
  
  return data.access_token;
}
```

## Troubleshooting

### Common Issues

**"Redirect URI mismatch"**
- Ensure your `STRAVA_REDIRECT_URI` exactly matches the callback URL in your code
- Check that the Authorization Callback Domain in Strava settings matches your domain

**"Invalid client_secret"**
- Verify your environment variables are loaded correctly
- Check for extra spaces or quotes in your `.env` file

**"Token expired"**
- Implement token refresh logic
- Check token expiration before making API calls

## Resources

- [Strava API Documentation](https://developers.strava.com/docs/)
- [OAuth 2.0 Specification](https://oauth.net/2/)
- [Strava API Agreement](https://www.strava.com/legal/api)