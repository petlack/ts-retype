#!/bin/bash

RETYPE_BIN="$(pwd)/retype/dist/ts-retype.cjs"

cd retype && npm i --omit=dev
cd -

# git clone https://github.com/apollographql/apollo-server.git --depth=1
# cd apollo-server && $RETYPE_BIN . && cd -
# mv apollo-server/retype-report.html ./output/react-apollo-server.html

git clone https://github.com/petlack/ts-retype.git --depth=1
cd ts-retype && $RETYPE_BIN . && cd -
mv ts-retype/retype-report.html ./output/react-ts-retype.html

git clone https://github.com/apollographql/apollo-client.git --depth=1
cd apollo-client && $RETYPE_BIN . && cd -
mv apollo-client/retype-report.html ./output/react-apollo-client.html

