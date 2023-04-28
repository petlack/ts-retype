#!/bin/bash

if [ $# -ne 1 ]; then
  echo "Usage: $0 path_to_ttf_font"
  exit 1
fi

# Get the input TTF font file path
input_ttf="$1"

# Check if the input TTF font file exists
if [ ! -f "$input_ttf" ]; then
  echo "Error: Input TTF font file '$input_ttf' does not exist."
  exit 1
fi

cat $input_ttf | base64 -w 0 > font.b64
cat font.b64