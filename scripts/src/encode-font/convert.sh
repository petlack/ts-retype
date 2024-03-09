#!/bin/bash

if [ $# -ne 1 ]; then
  echo "Usage: $0 path_to_font"
  exit 1
fi

input_font="$1"

if [ ! -f "$input_font" ]; then
  echo "Error: Input font file '$input_font' does not exist."
  exit 1
fi

gzip -c $input_font | base64 -w 0 > font.b64
cat font.b64