# express-for-testing-app — practice Dockerfile
#
# Fill in every TODO, then build:
#   docker build -t express-for-testing-app .
#
# Facts from this repo (look them up; do not treat this list as the answer):
# - CI installs Node 26 and runs `npm run build` (`tsc`). See .github/workflows/robot.yml.
# - package.json "start" is `node dist/index.js`.
#   tsconfig outDir is dist/ and the process entry is src/server.ts.
#   Decide which file the container should actually execute.
# - src/config/env.ts exits unless PORT, JWT_SECRET, JWT_ISSUER,
#   JWT_AUDIENCE, and NODE_ENV are set.
# - src/db.ts also requires DATABASE_URL. Do not bake secrets into the image.
#   Pass them at `docker run -e` (or a compose env file that is not copied in).
# - Health route: GET /api/v1/users/health (no auth).
# - src/db.ts imports @prisma/orm-postgres, and package.json lists that
#   package under devDependencies. `npm ci --omit=dev` will omit it.
#   Decide how the final image still has a working database driver.
# - Password hashing imports bcryptjs (pure JavaScript), so the runtime
#   image does not need a C compiler for that import.
# - src/prisma/contract.json is imported at startup. It has to be present
#   next to the compiled output, or you regenerate it during the build.

# =============================================================================
# Stage 1 — build
# Compile TypeScript here. This stage may be large. Only its output is
# copied into the runtime stage below.
# =============================================================================

# TODO(1) Build-stage base image.
#         Use a Node image, pin a major version (avoid `latest`), and name
#         this stage so later COPY --from= can refer to it.
#         Smaller families: alpine, slim.
FROM

# TODO(2) Working directory for the build.
WORKDIR

# TODO(3) Copy dependency manifests BEFORE the rest of the source so Docker
#         can reuse the install layer when only application code changes.
#         This repo has package.json and package-lock.json.
COPY

# TODO(4) Install dependencies, including the ones needed to compile
#         (typescript, prisma). Clean the npm cache in the same RUN.
RUN

# TODO(5) Copy only what the compiler and Prisma need
#         (source, tsconfig, prisma config, prisma schema).
COPY

# TODO(6) Produce the runnable app.
#         CI generates the Prisma contract, then runs the TypeScript build.
#         prisma.config.ts reads DATABASE_URL when the config file loads.
#         Check whether `prisma contract emit` opens a real database or only
#         needs the variable to be set.
RUN

# =============================================================================
# Stage 2 — runtime
# A second FROM starts a new image. Packages and source from stage 1 are
# gone unless you COPY --from= them.
# =============================================================================

# TODO(7) Runtime base image. Same Node major as the build stage. This image
#         is what gets pushed and run, so keep it small.
FROM

# TODO(8) Defaults that are safe to store in the image.
#         NODE_ENV and PORT belong here. Leave JWT_* and DATABASE_URL unset.
ENV
ENV

# TODO(9) Working directory, then a non-root user who will own the app files.
#         Create the user before COPY, and give that user the workdir.
#         Alpine: addgroup -S / adduser -S. Debian slim: groupadd / useradd.
WORKDIR
RUN

# TODO(10) Production dependencies.
#          Copy the lockfile from the build stage and install without
#          devDependencies — then resolve the @prisma/orm-postgres issue
#          noted at the top. One RUN, and drop the npm cache in that RUN.
COPY
RUN

# TODO(11) Compiled output, plus anything Node still reads at runtime
#          (the generated contract JSON lives under src/prisma/ and tsc does
#          not emit .json). Fix ownership if the COPY arrives as root.
COPY

# TODO(12) Switch to the user from TODO(9). Instructions after USER run as
#          that user. Do not switch back to root.
USER

# TODO(13) Listen port. EXPOSE documents it; it does not publish the port.
EXPOSE

# TODO(14) Health check against GET /api/v1/users/health.
#          Alpine often has wget and does not have curl. A `node -e` fetch
#          also works on the Node image. Use the PORT variable. Set
#          --interval, --timeout, --start-period, and --retries.
HEALTHCHECK

# TODO(15) Start the server. Use the exec form (JSON array) so Node is PID 1
#          and receives SIGTERM on `docker stop`.
#          ENTRYPOINT is the executable. CMD is the default arguments.
ENTRYPOINT
CMD
