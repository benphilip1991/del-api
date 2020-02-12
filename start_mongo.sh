#!/bin/sh

# Check if mongo is running - send grep output to /dev/null
ps aux | grep mongod | grep -v grep > /dev/null 2>&1

if [ $? -ne 0 ]; then
    echo [INFO] Starting MongoDB
    mongod --config /usr/local/etc/mongod.conf --fork
else
    echo [INFO] MongoDB running
fi
