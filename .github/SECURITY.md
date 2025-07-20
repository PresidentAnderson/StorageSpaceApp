# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within StorageSpace, please send an email to security@storagespace.app. All security vulnerabilities will be promptly addressed.

Please do not report security vulnerabilities through public GitHub issues.

### What to Include in Your Report

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

### What to Expect

- We will acknowledge receipt of your vulnerability report within 48 hours
- We will send a more detailed response within 7 days indicating the next steps in handling your report
- We will keep you informed about the progress towards a fix and full announcement
- We may ask for additional information or guidance

## Security Measures

This application implements several security measures:

1. **Dependency Scanning**: Automated dependency updates via Dependabot
2. **Code Scanning**: CodeQL analysis for security vulnerabilities
3. **Secret Scanning**: TruffleHog scans for exposed secrets
4. **Regular Audits**: Daily npm audit checks
5. **Secure Development**: TypeScript for type safety
6. **Input Validation**: All user inputs are validated and sanitized
7. **Authentication**: Secure authentication mechanisms (to be implemented)
8. **Data Encryption**: Sensitive data encrypted at rest and in transit

## Best Practices for Contributors

- Never commit sensitive information (API keys, passwords, tokens)
- Always validate and sanitize user input
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Keep dependencies up to date
- Follow the principle of least privilege
- Use HTTPS for all external communications
- Implement rate limiting for API endpoints
- Log security events appropriately (without exposing sensitive data)