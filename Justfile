set positional-arguments

clean:
    rm -rf ./.nx
    pnpm nx run-many -t clean

build-all:
    pnpm nx run-many -t build

rebuild-all:
    just clean
    just build-all

build *args='':
    npx nx build "@ts-retype/${@}" --verbose

rebuild *args='':
    npx nx build "@ts-retype/${@}" --verbose --skipNxCache

dev *args='':
    npx nx dev "@ts-retype/${@}"

bin *args='':
    npx nx bin "@ts-retype/${@}"

install:
    pnpm install

test *args='':
    npx nx test "@ts-retype/${@}" --verbose

test-all:
    pnpm nx run-many -t test

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
