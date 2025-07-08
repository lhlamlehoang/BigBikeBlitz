#!/bin/bash
set -e

# Create the models directory if it doesn't exist
mkdir -p ./ai_agent/models

# Download the Dropbox folder as a zip with retries and fail on error
echo "Downloading models.zip from Dropbox..."
curl -L --fail --retry 5 --retry-delay 10 "https://www.dropbox.com/scl/fo/0msir37uq5rhb7a5z8wto/ANjT8TG3e7RHY1yBi17fJI4?rlkey=shleqyrj3uh7nmsuuw1khejrg&st=iwk5ipmm&dl=1" -o ./ai_agent/models/models.zip

# Check file size (should be at least 1.2GB = 1200000000 bytes)
FILESIZE=$(stat -c%s "./ai_agent/models/models.zip")
if [ "$FILESIZE" -lt 1200000000 ]; then
  echo "Download failed or incomplete: models.zip is only $FILESIZE bytes"
  exit 1
fi

echo "Download complete. Unzipping..."
unzip -o ./ai_agent/models/models.zip -d ./ai_agent/models || true

# Clean up
rm ./ai_agent/models/models.zip
echo "Done."