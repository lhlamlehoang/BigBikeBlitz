#!/bin/bash

echo "=== Certificate Verification Script ==="

# Update CA certificates
echo "Updating CA certificates..."
if update-ca-certificates --fresh; then
    echo "✓ CA certificates updated successfully"
else
    echo "✗ Failed to update CA certificates"
    exit 1
fi

# Check system trust store
echo "System trust store location:"
ls -la /etc/ssl/certs/ca-certificates.crt

echo "=== Certificate verification completed ===" 