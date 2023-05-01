#!/bin/sh

mkdir -p ./reports
docker run -it --rm -v "$(realpath docs-static/public):/app/output" generate-report