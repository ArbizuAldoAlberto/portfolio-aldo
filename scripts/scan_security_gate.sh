#!/bin/bash
# Delegator for UNIX-based CI/CD environments (Vercel, GitHub Actions)
node "$(dirname "$0")/scan_security_gate.js"
