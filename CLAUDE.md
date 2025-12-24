# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gahlee House is a personal photo album and recipe website built with Eleventy (11ty) static site generator. It displays family photos and recipes from historical data files.

## Commands

```bash
# Development server with hot reload
npm start

# Build static site to _site/
npm run build

# Lint JavaScript files
npm run lint

# Clean build output
npm run clean
```

## Architecture

**Static Site Generator**: Eleventy 3.x with Nunjucks templating

**Directory Structure**:
- `src/` - Source files (input directory)
  - `_layouts/` - Base page layouts (base.njk)
  - `_data/` - Data files processed by Eleventy
  - `_includes/` - Reusable template partials
  - `*.njk` - Page templates
- `images/` - Static images copied to output root
- `_site/` - Generated output (gitignored)

**Data Flow**:
- `src/_data/albums.js` - Processes `tblPhoto.json` and `tblPhotoAlbum.json` to generate album collections with photos. Also scans `images/albums/v1/` for legacy photos.
- `src/_data/recipes.json` - Recipe data with title, ingredients, directions, and category fields

**Page Generation**:
- `album.njk` - Uses Eleventy pagination to generate `/photos/{slug}/` pages from albums data
- `recipe.njk` - Uses Eleventy pagination to generate `/recipes/{slug}/` pages from recipes data
- `photos.njk` - Album listing page at `/photos/`
- `recipes.njk` - Recipe listing with client-side search/filter

**Custom Filters**:
- `snake_case` - Converts strings to URL-friendly format (defined in eleventy.config.js)

## Code Style

Uses `eslint-config-reverentgeek` with Node ESM configuration. This enforces spaces inside parentheses, braces, and brackets.
