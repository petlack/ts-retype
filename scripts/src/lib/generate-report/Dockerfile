FROM alpine:latest

RUN apk update && \
    apk add git nodejs npm

RUN npm add -g typescript

WORKDIR /app

COPY . .

CMD ["sh", "/app/scripts/src/lib/generate-report/generate.sh"]
# ENTRYPOINT ["/bin/sh"]