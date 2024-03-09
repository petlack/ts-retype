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

compile *args='':
    npx nx compile "@ts-retype/${@}" --verbose

rebuild *args='':
    npx nx build "@ts-retype/${@}" --verbose --skipNxCache

dev *args='':
    npx nx dev "@ts-retype/${@}"

bin *args='':
    npx nx bin "@ts-retype/${@}"

install:
    pnpm install

stats-build-all *args='*':
    pnpm nx run-many -t stats

stats-build *args='*':
    npx nx stats "@ts-retype/${@}" --verbose --skipNxCache

stats-open *args='*':
    find . -wholename "*/${@}/dist/stats*.html" | fzf | xargs open

test *args='':
    npx nx test "@ts-retype/${@}" --verbose

test-all:
    pnpm nx run-many -t test

update:
    pnpm -r update

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

watch-test *args='':
    npx nx test:watch "@ts-retype/${@}" --verbose
