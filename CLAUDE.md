# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Gahlee House is a personal photo album and recipe website built with Eleventy (11ty) static site generator. It displays family photos and recipes from historical data files.

## Architecture notes

- Photo data comes from **historical exports**: `src/_data/albums.js` processes `tblPhoto.json` and `tblPhotoAlbum.json` into album collections, and *additionally* scans `images/albums/v1/` for legacy photos that aren't in those tables. Both paths have to keep working.
- `snake_case` is a custom Eleventy filter (defined in `eleventy.config.js`) used for URL slugs — reuse it rather than adding another slugifier.

## Code Style

Uses `eslint-config-reverentgeek` with Node ESM configuration. This enforces spaces inside parentheses, braces, and brackets.
