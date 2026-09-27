# ExpActivator project page

A self-contained static paper website. The existing personal homepage is unchanged.

## Preview

From the parent `website_zfy` directory:

```sh
python3 -m http.server 8087 --bind 127.0.0.1
```

Open http://127.0.0.1:8087/ExpActivator/.

## Files

- `index.html`: paper title, authors, method, abstract, case study, and BibTeX.
- `styles.css`: responsive layout and sans-serif typography.
- `script.js`: Table 1 data, a swipeable three-slide results carousel, and citation copying.
- The paper PDF is not included. Paper controls remain unavailable until the author provides a public link.
- `assets/method.png` and `assets/case-study.png`: rendered from the paper's source figures.

No build step or third-party runtime dependencies are required. Keep this directory at `/ExpActivator/` when publishing through the existing GitHub Pages setup. Citation metadata uses the title and authors in the supplied PDF and its project URL; no venue or arXiv identifier was inferred from the input filename.

Public URL: https://fyzhang1.github.io/ExpActivator/. This directory is published alongside DualTAP and Oblivionis in fyzhang1/fyzhang1.github.io. The Code resource box links to https://github.com/fyzhang1/ExpActivator, supplied by the author.

Typography uses Arial throughout the page, citation block, and phone simulations. Results advance every 6.5 seconds while visible. Hovering pauses motion; manual navigation and keyboard focus stop autoplay until Play is selected. Reduced-motion preferences disable autoplay by default.


## Interactive phone simulations

`simulator.js` and `simulator.css` power a responsive iPhone-style device with two six-step, scripted scenarios: personalized coffee ordering and a proactive morning-weather suggestion. They show typing, app transitions, preference changes, touch indicators, notifications, confirmation, scrolling, and completion. The UI supports pause, replay, previous/next, and direct step selection. Playback stops while the device is offscreen or the tab is hidden and starts paused for reduced-motion users.

These are clearly labeled illustrative simulations. The coffee example is motivated by the paper; the proactive 08:05 weather routine is reported in Figure 5. The app interfaces, preferences, prices, and weather values are fictional demo data. No model runs, orders, payments, or external requests are made by the simulations. The actual paper figures remain in the method and case-study sections.

The opening-versus-following-steps comparison reproduces Table 2. Original screen extracts remain in `assets/screens/`.
