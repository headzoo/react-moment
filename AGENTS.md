## Changelog

`CHANGELOG.md` is kept up to date automatically by the `post-commit` hook in
`.githooks/post-commit` (activated by `npm install` via the `prepare` script,
which sets `core.hooksPath` to `.githooks`).

How it works:

- After each commit, the hook prepends `- <commit subject>. (\`<short sha>\`)` to the
  `## Unreleased` section and amends the change into the same commit.
- The hook stays out of the way when:
  - `CHANGELOG.md` is already part of the commit (you wrote your own entry).
  - The commit is a merge, revert, fixup, squash, or `chore(changelog)` /
    `chore(release)` commit.
  - The commit subject is a bare version number like `1.2.3` or `v1.2.3`.
  - A rebase, cherry-pick, revert, or merge is in progress.
  - The commit's short SHA is already present in `## Unreleased`.

What this means for you:

- Write a clear, single-line commit subject; it becomes the changelog entry.
- If you want a more detailed entry than the subject line, edit `## Unreleased`
  yourself and stage `CHANGELOG.md` as part of the commit. The hook will detect
  it and leave your entry alone.
- Don't add version numbers or dates manually. The release workflow
  (`.github/workflows/release.yml`) bumps `package.json` and renames
  `## Unreleased` to `## <new version> - <YYYY-MM-DD>` when a maintainer
  triggers a release.
- Don't run version-bump commands locally (`npm version`); use the release
  workflow instead so the changelog and tags stay in sync.

## Publishing

Two release workflows publish to npm with different dist-tags so 1.x and 2.x
pre-releases can coexist.

### 1.x (now)

- Branch: `master`
- Trigger: `npm run release:patch` (or `:minor`, `:major`)
- Workflow: [`.github/workflows/release.yml`](.github/workflows/release.yml)
- npm dist-tag: `latest` (default)

### 2.x beta

- Branch: `2.0.0-beta`
- Trigger: `npm run release:beta`
- Workflow: [`.github/workflows/release-beta.yml`](.github/workflows/release-beta.yml)
- npm dist-tag: `beta` — consumers install with `react-moment@beta`
- First run bumps to `2.0.0-beta.1`; subsequent runs increment the prerelease
  segment (`2.0.0-beta.2`, etc.)

### After 2.0.0 stable

1. Cut a long-lived `1.x` branch from `v1.2.3` for maintenance fixes.
2. Merge `2.0.0-beta` into `master` and release `2.0.0` via the Release
   workflow (`latest`).
3. Future 1.x patches: Release workflow with `branch=1.x` and `dist_tag=v1`
   so `latest` stays on 2.x.

Each branch owns its own `## Unreleased` section in `CHANGELOG.md`. Backport
fixes to both lines when needed.
