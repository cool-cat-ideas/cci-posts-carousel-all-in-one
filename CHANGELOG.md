# Changelog

## 2.2.1 - 2026-10-28

- Tested with WordPress 7.1.4.

- Keep category and tag searches available when integrations preserve numeric term keys. Return structured REST errors for missing taxonomies and failed term queries, with clear session/access messages and an explicit retry action in the editor.
- Limit taxonomy suggestions to 50 results and let users refine the search. Preserve the search phrase `0`.
- Cancel outdated manual-post searches so slower responses cannot replace newer results or restore results after clearing the field.
- Preserve selected ordering labels after saving and reopening carousels by translating native query keys back to editor option values. Keep native manual-order keys intact during repeated normalization instead of falling back to ID sorting.
- Keep empty manual selections empty and apply exclusions before resolving manually selected posts. Excluding every selected post no longer falls back to automatic content.
- Exclude password-protected posts from automatic and manual carousel output, including full-content descriptions. Keep non-public post types out of public slides.
