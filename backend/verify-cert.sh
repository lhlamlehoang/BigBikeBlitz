#!/bin/bash

echo "=== Certificate Verification Script ==="

# Check if certificate file exists
if [ -f "/usr/local/share/ca-certificates/tma.crt" ]; then
    echo "✓ Certificate file found at /usr/local/share/ca-certificates/tma.crt"
else
    echo "✗ Certificate file not found"
    exit 1
fi

# Check certificate content
echo "Certificate content (first few lines):"
head -5 /usr/local/share/ca-certificates/tma.crt

# Update CA certificates
echo "Updating CA certificates..."
if update-ca-certificates --fresh; then
    echo "✓ CA certificates updated successfully"
else
    echo "✗ Failed to update CA certificates"
    exit 1
fi

# List installed certificates
echo "Installed certificates containing 'tma':"
ls -la /etc/ssl/certs/ | grep -i tma || echo "No certificates found with 'tma' in name"

# Check system trust store
echo "System trust store location:"
ls -la /etc/ssl/certs/ca-certificates.crt

echo "=== Certificate verification completed ===" 