DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
echo "DIR: $DIR"
docker build -t encode-font -f ${DIR}/Dockerfile ${DIR}