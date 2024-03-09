FROM alpine:latest

RUN apk update && \
    apk add git nodejs npm

RUN npm add -g typescript

WORKDIR /app

COPY . .

RUN cd retype && npm i --omit=dev

CMD ["sh", "/app/scripts/src/generate-report/generate.sh"]
# ENTRYPOINT ["/bin/sh"]