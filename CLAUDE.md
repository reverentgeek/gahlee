# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gahlee House is a personal photo album and recipe website built with the [SiteSquatch](https://github.com/reverentgeek/sitesquatch) (`ssqch`) static site generator. It displays family photos and recipes from historical data files.

## Rules

- **Always run `pnpm lint` after any code change** and fix anything it reports before considering the work done. (It runs `eslint --fix`, so review the auto-fixes too.)

## Gotchas

- **The site generator is ssqch**, configured in `ssqch.config.js`. `pnpm build` runs `ssqch build`; `pnpm dev` runs `ssqch serve` (http://localhost:8080). `pnpm ssqch docs <topic>` prints its docs.
- **Templates are Nunjucks (`.njk`), rendered by ssqch's minijinja engine**, not the JavaScript Nunjucks library. Prefer Jinja-style filters (`{{ items | length }}`) over JavaScript methods.
- **`src/_data/albums.js` uses ssqch's data helpers** from `import { ... } from "ssqch"`: `readData()` for the table exports (it skips their UTF-8 byte-order mark), `files()` for the `images/albums/v1/` scan (a photo gets a date only when `dateFrom` is `"name"`, never the copy's modification time), and `slugger()` for unique album slugs. These need ssqch 0.6.4 or later.
- `ssqch diff <old _site> <new _site>` compares two builds — handy for confirming a refactor changed nothing. The footer year comes from `page.date` (the file's modification time), so expect "only dates changed" lines after a fresh checkout.

## Architecture notes

- Photo data comes from **historical exports**: `src/_data/albums.js` processes `tblPhoto.json` and `tblPhotoAlbum.json` into album collections, and *additionally* scans `images/albums/v1/` for legacy photos that aren't in those tables. Both paths have to keep working.
- Images come from two folders that both publish to `/images/`: `src/images/` (site icons) and the root `images/` folder (the photo archive). Both are `passthrough` entries in `ssqch.config.js`.
- `snake_case` is a filter (defined under `filters` in `ssqch.config.js`) used for recipe URL slugs — reuse it rather than adding another slugifier. It's ssqch's `slugify` with `{ separator: "_", apostrophes: "separate" }`; plain `slugify( title, "_" )` drops apostrophes, so `/recipes/drew_s_brownies/` would become `/recipes/drews_brownies/` and break existing links.

## Code Style

Uses `eslint-config-reverentgeek` with Node ESM configuration. This enforces spaces inside parentheses, braces, and brackets.
