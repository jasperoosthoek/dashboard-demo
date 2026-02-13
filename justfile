# Default command to list all available commands.
default:
    @just --list

# dev: Start dev server with mock API.
dev:
    @echo "Starting dev server..."
    @npm run dev

# dev-local: Start dev server with local @jasperoosthoek modules.
dev-local:
    @echo "Starting dev server with local modules..."
    @DEVELOP_REACT_TOOLBOX=true DEVELOP_ZUSTAND_CRUD_REGISTRY=true npm run dev

# dev-no-mocks: Start dev server without mock API.
dev-no-mocks:
    @echo "Starting dev server without mocks..."
    @npm run dev:no-mocks

# build: Build for production (with mocks).
build:
    @echo "Building for production..."
    @npm run build

# build-no-mocks: Build for production (without mocks).
build-no-mocks:
    @echo "Building for production without mocks..."
    @npm run build:no-mocks

# preview: Preview production build.
preview:
    @echo "Starting preview server..."
    @npm run preview

# lint: Run ESLint.
lint:
    @npm run lint

# install: Install dependencies.
install:
    @npm install
