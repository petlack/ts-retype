FROM alpine:latest

RUN apk update && \
    apk add --no-cache woff2 && \
    rm -rf /var/cache/apk/*

WORKDIR /app

COPY convert.sh .
RUN chmod +x convert.sh
RUN ls -ahl

CMD ["sh", "/app/convert.sh", "/app/font"]