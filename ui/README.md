# Schroders Dashboard — UI

The browser-based dashboard layer for the AI React Orchestrator. Built with React 19, TypeScript, and Vite.

_Note: orchestrator integration is a planned next step_

---

## Setup

### Install dependencies

```bash
npm install
```

### Run the application

```bash
npm run dev
```

Opens at `http://localhost:5173`.

### Run unit and component tests

```bash
npm test          # single run
npm run test:watch  # watch mode
```

Unit tests use **Vitest** with **@testing-library/react** and run in a jsdom environment. Story files are also exercised as smoke tests via the `@storybook/addon-vitest` browser plugin — all stories render in headless Chromium as part of the same `npm test` run.

### Run end-to-end tests

The dev server must be running before executing Playwright tests.

```bash
# terminal 1
npm run dev

# terminal 2
npm run test:e2e
```

E2E tests use **Playwright** against `http://localhost:5173` with a headless Chromium browser.

### Launch Storybook

```bash
npm run storybook
```

Opens the component explorer at `http://localhost:6006`.

---

## Project structure

```
ui/
├── e2e/                          # Playwright end-to-end tests
│   └── FundHoldings.spec.ts
│
├── .storybook/                   # Storybook configuration
│   ├── main.ts
│   └── preview.tsx
│
└── src/
    ├── App.tsx                   # Root component — mounts FundHoldings
    ├── App.css                   # Page-level dark background and layout
    ├── index.css                 # Global resets and typography
    ├── main.tsx                  # React entry point
    ├── test-setup.ts             # Vitest global setup (@testing-library/jest-dom)
    │
    └── FundHoldings/             # Self-contained feature module
        ├── index.tsx             # Orchestrator: wires hooks → components
        ├── index.stories.tsx     # Full-component Storybook story
        ├── FundHoldings.module.css
        │
        ├── types/
        │   └── FundHolding.ts   # Shared interface + sort type aliases
        │
        ├── fixtures/
        │   └── holdings.ts      # Hardcoded data — single source of truth
        │
        ├── hooks/
        │   ├── useSort.ts
        │   ├── useSearch.ts
        │   └── tests/
        │       ├── useSort.test.ts
        │       └── useSearch.test.ts
        │
        └── components/
            ├── Table.tsx
            ├── Table.stories.tsx
            ├── Search.tsx
            ├── Search.stories.tsx
            ├── Search.module.css
            ├── RangeSlider.tsx
            ├── RangeSlider.stories.tsx
            └── RangeSlider.module.css
```

### Rationale

**Feature module (`FundHoldings/`)**
Everything belonging to the fund holdings feature lives together in one folder. Moving, deleting, or duplicating the feature requires touching only this directory.

**`fixtures/`**
The holdings data is defined once and imported everywhere it is needed — unit tests, Storybook stories, and the component itself at runtime. There is no duplication between test data and production data. Bounds for sliders and search defaults are derived from the fixture with `Math.min/max`, so they always stay in sync with the data.

**`hooks/`**
Business logic is extracted into plain TypeScript hooks with no JSX or DOM dependencies. This makes them independently testable with `renderHook` and a lightweight jsdom environment, with no need to render a full component tree.

**`hooks/tests/`**
Unit tests live alongside the hooks they test rather than in a separate top-level `__tests__` folder. The colocation makes the relationship explicit and keeps navigation short.

**`components/`**
Purely presentational components that accept all data and callbacks as props. They hold no state of their own, which makes them straightforward to document in Storybook (every story is just a set of props) and keeps the component functions shallow and easy to read.

**CSS modules (`*.module.css`)**
Each component that needs styles owns its own `.module.css` file. Class names are locally scoped by the Vite build, so there are no naming conflicts between components and no global stylesheet to manage. The table styles live in `FundHoldings.module.css` at the module root because `Table.tsx` references them with a relative import.

**Storybook stories (`*.stories.tsx`)**
Story files sit next to the component file they document. Opening a component immediately shows its story alongside it in the editor, and moving a component automatically moves its story. Controlled components (`Search`, `RangeSlider`) use a small `Interactive` wrapper with `useState` inside the `render` function so the Storybook canvas is fully interactive without needing the parent hook. Each story sources its data from `fixtures/holdings.ts`.

**Playwright (`e2e/`)**
End-to-end tests live in a top-level `e2e/` folder, isolated from unit tests and source code. They import fixture data directly (`../src/FundHoldings/fixtures/holdings`) to assert against real values without hardcoding. The Playwright config targets `http://localhost:5173` and runs Chromium only.

---

## What was built

### FundHoldings module

A fund holdings dashboard that displays a table of financial instrument data with interactive search filtering and column sorting.

**Data model** (`FundHolding`):

| Field    | Type     | Description                                         |
| -------- | -------- | --------------------------------------------------- |
| `ticker` | `string` | Instrument ticker symbol (e.g. `AAPL`)              |
| `name`   | `string` | Full instrument name                                |
| `weight` | `number` | Portfolio weight as a decimal (e.g. `0.072` = 7.2%) |
| `value`  | `number` | Position value in USD                               |

---

### Sort

Implemented in `hooks/useSort.ts`. The hook receives the current array of holdings (already filtered) and returns a sorted copy alongside the sort state.

**Behaviour:**

- Clicking a column header for the first time sorts ascending.
- Clicking the same header again toggles to descending; every subsequent click toggles direction.
- Clicking a different column resets direction to ascending and applies the new sort key. The previous column's sort icon clears immediately because the icon is only rendered when `sortKey === col.key`.
- The ✕ button beside the sort icon clears `sortKey` entirely, returning the table to the order in which the data was received (filtered order, or original fixture order if no filter is active).

The sort is applied on top of the filtered results — `useSort` takes `filtered` from `useSearch` as its input, so the displayed order always reflects both active operations at once.

**Comparison:** All four fields (`ticker`, `name`, `weight`, `value`) use the same `<` / `>` comparison, which works correctly for both strings (lexicographic) and numbers (numeric), keeping the hook generic across all `keyof FundHolding`.

---

### Search

Implemented in `hooks/useSearch.ts`. The hook separates _form state_ (`criteria`) from _active filter state_ (`activeCriteria`) — the table does not update until Apply is clicked. This prevents the table from jumping while the user is still adjusting sliders.

**Fields and matching strategy:**

| Field    | UI control              | Match logic                                         |
| -------- | ----------------------- | --------------------------------------------------- |
| `ticker` | Text input              | Case-insensitive substring (`includes`)             |
| `name`   | Text input              | Case-insensitive substring (`includes`)             |
| `weight` | Dual-thumb range slider | Inclusive range: `weightMin ≤ h.weight ≤ weightMax` |
| `value`  | Dual-thumb range slider | Inclusive range: `valueMin ≤ h.value ≤ valueMax`    |

**Apply / Reset:**

- **Apply** commits the current form state to `activeCriteria`, triggering a recompute of `filtered` via `useMemo`.
- **Reset** restores both `criteria` (form state) and `activeCriteria` (active filter) to the original defaults derived from the fixture, so the table immediately shows all records.

**Slider bounds:** The min and max bounds of both range sliders are derived in `index.tsx` from the fixture data using `Math.min/max`. These bounds are passed down as props to `Search` and then to `RangeSlider`, keeping `index.tsx` as the single place that knows about the data shape. The sliders cross-constrain each other — the min thumb's upper limit is `valueMax` and vice versa — preventing an inverted range.

**Dual-thumb range slider (`RangeSlider.tsx`):** Built without any external library using two overlapping `<input type="range">` elements on a shared visual track. The browser's default track is made transparent; a custom `rail` div provides the background track and a `fill` div highlights the selected range. `pointer-events: none` on the inputs with `pointer-events: all` on the `::webkit-slider-thumb` / `::moz-range-thumb` pseudo-elements ensures each thumb is independently draggable. A dynamic `z-index` prevents the min thumb from becoming unreachable when it approaches the far-right end of the track.
