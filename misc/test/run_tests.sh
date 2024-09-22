#!/bin/bash

# Enable assertions
zend_assertions=1

# Loop through all PHP files in the specified folder
for file in ./*.php; do
    printf "\r\n" # Echo CRLF
    echo "=============== Running $file ==============="
    output=$(php -d zend.assertions=$zend_assertions -f "$file" 2>&1)
    if [ -z "$output" ]; then
        echo "Success"
    else
        echo "$output"
    fi
done