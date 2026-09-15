# pd-prototype-starter

Empty Handlebars/Assemble prototype scaffold (same structure and build pipeline as
the PD prototype baseline, with no project content).

## Requirements

**Node 18 or newer.** The `less` 4.x compiler uses modern JavaScript syntax
(optional chaining), so older runtimes abort the build:

```
Loading "less.js" tasks...ERROR
>> SyntaxError: Unexpected token '?'
Warning: Task "less:local" failed.
```

If you see that, you are on an unsupported Node version — switch with
`nvm use 18` (or newer) and re-run. On Apple Silicon, prefer Node 16+ as those
are native `arm64` builds.

## Install

```bash
npm install
```

## Run

```bash
npm start            # grunt serve -> builds ./target and serves on :3000
npm start -- --port=4000
npm start -- --ssl
npm run build        # builds ./target then copies to ./build
npx grunt --env=prod # minified css/js build
```

### `zsh: command not found: grunt`

Grunt is installed **locally** in `node_modules/.bin`, not globally, so a bare
`grunt <task>` fails. Prefix any task with `npx`:

```bash
npx grunt serve
npx grunt less:local
```

Optionally install the CLI once so `grunt` works from anywhere:

```bash
npm install -g grunt-cli
```

### Refreshing the Less

```bash
npx grunt less:local   # one-off compile -> target/static/portal.css
npx grunt chokidar     # watch and recompile on save (prints "Waiting...")
npx grunt serve        # build + watch + browser live reload (recommended)
```

These are foreground processes — they stop on `Ctrl+C` or when you close the
terminal, so start one at the beginning of each work session and leave it
running in its own tab. `npx grunt chokidar` only reacts to file changes; it
does not compile on startup, so run `npx grunt less:local` first if you need
immediate output.

## Structure

```
Gruntfile.js          build pipeline (less, assemble, copy, uglify, cssmin, browserSync, chokidar)
gruntConfig.json      project name + build output dir
helpers/              custom Handlebars helpers
ui/layouts/           page shells (default.hbs, blank.hbs)
ui/pages/             one .hbs per page, YAML front-matter sets layout/title/bodyClass
ui/partials/          reusable partials (header, footer, page-hero)
static/js.json        file list concatenated into static/js/all.js for prod
static/js/            scripts
static/lang/          language.json, available to every template as template data
static/less/          Less sources -> target/static/portal.css
static/img/           images
target/               generated output (gitignored)
```

## Build pipeline

`grunt serve` runs the default task, then starts the server and the watchers:

| Step | Task | What it does |
| --- | --- | --- |
| 1 | `copy:local` | copies `static/**` plus jQuery into `target/` |
| 2 | `less:local` | compiles `static/less/portal/portal.less` -> `target/static/portal.css` (inline source maps) |
| 3 | `assemble:local` | renders `ui/pages/**/*.hbs` -> `target/*.html` |
| 4 | `browserSync` | serves `target/` on port 3000 and live-reloads |
| 5 | `chokidar` | re-runs the relevant task when Less, JS, images, templates or `language.json` change |

`grunt build` runs the same steps then copies `target/` to `build/`.
`grunt --env=prod` additionally runs `uglify` (-> `target/static/js/all.js`) and
`cssmin` (-> `target/static/all.css`).

`target/` and `build/` are generated output — never edit them by hand, and never
commit them.

## Where to write what

| I want to... | Edit this |
| --- | --- |
| Add a page | `ui/pages/<name>.hbs` -> outputs `target/<name>.html` |
| Change the page shell | `ui/layouts/default.hbs` or `ui/layouts/blank.hbs` |
| Make a reusable chunk of markup | `ui/partials/<name>.hbs`, used as `{{> name}}` |
| Style a component | `static/less/portal/components/<name>.less` |
| Style page scaffolding, `.container`, grid | `static/less/portal/layout/<name>.less` |
| Set colors, fonts, spacing | `static/less/portal/variables/<name>.less` |
| Style one specific page | `static/less/pages/<page>.less` |
| Style tied to a single partial | a `.less` file next to it in `ui/partials/` |
| Add a script | `static/js/<name>.js` |
| Add text, labels, navigation | `static/lang/language.json` |
| Add images | `static/img/` |
| Add a Handlebars helper | `helpers/handlebar.helpers.js` |
| Rename the project or output dir | `gruntConfig.json` |

## Adding a page

Create `ui/pages/my-page.hbs`:

```hbs
---
title: My Page
layout: default.hbs
bodyClass: my-page
hideHero: true
---

<div class="container-fluid">...</div>
```

It is output as `target/my-page.html`.

Front-matter keys understood by `default.hbs`:

| Key | Purpose |
| --- | --- |
| `title` | page heading |
| `subtitle` | optional `h2` under the hero; HTML is not escaped |
| `layout` | `default.hbs` (header + hero + footer) or `blank.hbs` |
| `bodyClass` | class on `<body>`, the hook for page-specific Less |
| `hideHero` | `true` renders the compact `page-meta` bar, `false` renders the `page-hero` partial |
| `mainContentClass` | optional extra class on `.main-content` |

## Adding a partial

Create `ui/partials/my-widget.hbs` and include it with `{{> my-widget}}`.
Partials are registered from `ui/partials/**/*.hbs`, so no configuration is
needed. You may colocate a `my-widget.less` in the same folder — it is imported
automatically.

## Adding styles

`static/less/portal/portal.less` is the single entry point. It glob-imports
every project folder:

```less
@import "variables/**/*.less";
@import "components/**/*.less";
@import "layout/**/*.less";
@import "../pages/**/*.less";
@import "../../../ui/partials/**/*.less";
```

Because these are globs, **any new `.less` file in those folders is picked up
automatically — do not add an `@import` for it.** The `variables`, `components`,
`layout` and `pages` folders ship empty on purpose.

Import order is variables first, so variables are available to every later file.

## Template data (`static/lang/language.json`)

This file is loaded by Assemble as global template data, so its keys are
available in every layout, page and partial:

```hbs
<title>{{site.name}}</title>

{{#each nav}}
  <a href="{{url}}">{{label}}</a>
{{/each}}
```

Keep user-facing strings here rather than hard-coding them in templates. Editing
it retriggers `assemble:local`.

## Production build

`grunt --env=prod` concatenates and minifies the scripts listed in
`static/js.json` into `target/static/js/all.js`:

```json
[
  "node_modules/jquery/dist/jquery.js",
  "static/js/app.js"
]
```

The array is **order-sensitive** — dependencies must come before the code that
uses them. A new script is only in the production bundle once it is listed here,
so add it whenever you create a file in `static/js/`.
# handlebars-booking-site
