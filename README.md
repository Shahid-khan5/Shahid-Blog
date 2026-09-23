# shahidkhan.dev

My personal site and blog. Built with [Astro](https://astro.build) and hosted on Vercel.

The site follows my clock in Pakistan. From 6 pm to 6 am the lamp is on (dark). In the day it is paper (light). Visitors can flip the lamp from the header or with <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd>.

## Run it

```sh
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # type check, then build to dist/
```

## Where things live

| Path | What |
| --- | --- |
| `src/content/posts/` | Blog posts. Set `slug` to control the URL. |
| `src/content/pages/` | Standalone pages: `/cv/`, `/contact/`, `/cpp-ide/` and its privacy pages. |
| `src/content/subjects/` | One file per university subject. |
| `src/content/classes/<subject>/` | One file per class, with video, audio, image and file links. |
| `src/data/timetable.ts` | Weekly class schedule. |
| `src/pages/index.astro` | Home page, including the "Now" section. |
| `src/styles/global.css` | Colours for both lamp modes, type and motion. |

## License

Writing is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
