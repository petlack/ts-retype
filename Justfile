set positional-arguments

clean:
    rm -rf ./.nx
    npx nx clean @ts-retype/bin
    npx nx clean @ts-retype/doc
    npx nx clean @ts-retype/vis
    npx nx clean @ts-retype/search
    npx nx clean @ts-retype/uikit

build-all:
    npx nx build @ts-retype/bin

build *args='':
    npx nx build "@ts-retype/${@}"

dev *args='':
    npx nx dev "@ts-retype/${@}"

install:
    pnpm install

watch-build *args='':
    npx nx build:watch "@ts-retype/${@}"

watch-build-bin:
    npx nx watch \
        --projects=@ts-retype/bin \
        --includeDependentProjects \
        --verbose -- \
        nx build @ts-retype/bin

watch-build-all *args='':
    pnpm nx watch --all --verbose -- nx run \$NX_PROJECT_NAME:build
