#!/bin/bash

RETYPE_BIN="$(pwd)/retype/dist/ts-retype.cjs"

cd retype && npm i --omit=dev
cd -

git clone https://github.com/petlack/ts-retype.git --depth=1
cd ts-retype && $RETYPE_BIN . && cd -
mv ts-retype/retype-report.html ./output/report-ts-retype.html

# git clone https://github.com/apollographql/apollo-server.git --depth=1
# cd apollo-server && $RETYPE_BIN . && cd -
# mv apollo-server/retype-report.html ./output/report-apollo-server.html

# git clone https://github.com/microsoft/TypeScript.git --depth=1
# cd TypeScript && $RETYPE_BIN . && cd -
# mv TypeScript/retype-report.html ./output/report-TypeScript.html

# git clone https://github.com/apollographql/apollo-client.git --depth=1
# cd apollo-client && $RETYPE_BIN . && cd -
# mv apollo-client/retype-report.html ./output/report-apollo-client.html

# git clone https://github.com/vitejs/vite.git --depth=1
# cd vite && $RETYPE_BIN . && cd -
# mv vite/retype-report.html ./output/report-vite.html

# git clone https://github.com/remix-run/remix.git --depth=1
# cd remix && $RETYPE_BIN . && cd -
# mv remix/retype-report.html ./output/report-remix.html

# git clone https://github.com/microsoft/vscode.git --depth=1
# cd vscode && $RETYPE_BIN . && cd -
# mv vscode/retype-report.html ./output/report-vscode.html

# git clone https://github.com/denoland/deno.git --depth=1
# cd deno && $RETYPE_BIN . && cd -
# mv deno/retype-report.html ./output/report-deno.html

# git clone https://github.com/mui/material-ui.git --depth=1
# cd material-ui && $RETYPE_BIN . && cd -
# mv material-ui/retype-report.html ./output/report-material-ui.html

# git clone https://github.com/typescript-eslint/typescript-eslint.git --depth=1
# cd typescript-eslint && $RETYPE_BIN . && cd -
# mv typescript-eslint/retype-report.html ./output/report-typescript-eslint.html

# git clone https://github.com/angular/angular.git --depth=1
# cd angular && $RETYPE_BIN . && cd -
# mv angular/retype-report.html ./output/report-angular.html

# git clone https://github.com/prettier/prettier.git --depth=1
# cd prettier && $RETYPE_BIN . && cd -
# mv prettier/retype-report.html ./output/report-prettier.html

# git clone https://github.com/DefinitelyTyped/DefinitelyTyped.git --depth=1
# cd DefinitelyTyped && $RETYPE_BIN . && cd -
# mv DefinitelyTyped/retype-report.html ./output/report-DefinitelyTyped.html

# git clone https://github.com/lerna/lerna.git --depth=1
# cd lerna && $RETYPE_BIN . && cd -
# mv lerna/retype-report.html ./output/report-lerna.html

# git clone https://github.com/react-hook-form/react-hook-form --depth=1
# cd react-hook-form && $RETYPE_BIN . && cd -
# mv react-hook-form/retype-report.html ./output/report-react-hook-form.html
