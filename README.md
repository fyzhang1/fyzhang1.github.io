# Personal Homepage

This site is a static personal homepage that closely follows the layout style of `https://www.sainingxie.com/`, but uses local Markdown files as the content source.

## Edit Content

All displayed information lives in Markdown:

- `content/profile.md`
- `content/about.md`
- `content/group.md`
- `content/publications.md`

## Preview Locally

```bash
cd /Users/fyzhang/Documents/website_zfy
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy To GitHub Pages

1. Push the repository to GitHub.
2. Open repository `Settings -> Pages`.
3. Select `Deploy from a branch`.
4. Choose `main` and `/ (root)`.
5. Save.

`.nojekyll` is already included.
