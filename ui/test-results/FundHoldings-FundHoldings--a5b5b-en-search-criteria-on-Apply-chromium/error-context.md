# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: FundHoldings.spec.ts >> FundHoldings >> display an empty state message when there is no matching holding for given search criteria on Apply
- Location: e2e/FundHoldings.spec.ts:128:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/No holdings matching the specifieds search criteria/)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/No holdings matching the specifieds search criteria/)

```

```yaml
- banner:
  - heading "Schroders Dashboard" [level=1]
- main:
  - text: Ticker
  - textbox "Ticker":
    - /placeholder: e.g. AAPL
    - text: not available
  - text: Name
  - textbox "Name":
    - /placeholder: e.g. Apple
  - text: Weight 3.8% – 7.2%
  - slider: "0.038"
  - slider: "0.072"
  - text: Value 114,040 – 215,340
  - slider: "114040"
  - slider: "215040"
  - button "Apply"
  - button "Reset"
  - table:
    - rowgroup:
      - row "Ticker Name Weight Value (USD)":
        - columnheader "Ticker"
        - columnheader "Name"
        - columnheader "Weight"
        - columnheader "Value (USD)"
    - rowgroup:
      - row "No holdings matching the specified search criteria":
        - cell "No holdings matching the specified search criteria"
```

# Test source

```ts
  37  |     page,
  38  |   }) => {
  39  |     await page.getByTestId("search-ticker").fill("aapl");
  40  |     await page.getByTestId("search-apply").click();
  41  | 
  42  |     await expect(page.locator("tbody tr")).toHaveCount(1);
  43  |     await expect(
  44  |       page.getByRole("cell", { name: "AAPL", exact: true }),
  45  |     ).toBeVisible();
  46  |   });
  47  | 
  48  |   test("filters by name substring (case-insensitive) on Apply", async ({
  49  |     page,
  50  |   }) => {
  51  |     await page.getByTestId("search-name").fill("corp");
  52  |     await page.getByTestId("search-apply").click();
  53  | 
  54  |     await expect(page.locator("tbody tr")).toHaveCount(2);
  55  |     await expect(
  56  |       page.getByRole("cell", { name: "MSFT", exact: true }),
  57  |     ).toBeVisible();
  58  |     await expect(
  59  |       page.getByRole("cell", { name: "NVDA", exact: true }),
  60  |     ).toBeVisible();
  61  |   });
  62  | 
  63  |   test("filters by min weight on Apply", async ({ page }) => {
  64  |     // weight >= 0.06 → AAPL (0.072), MSFT (0.065)
  65  |     await setSliderValue(page.getByTestId("weight-min"), 0.06);
  66  |     await page.getByTestId("search-apply").click();
  67  | 
  68  |     await expect(page.locator("tbody tr")).toHaveCount(2);
  69  |     await expect(
  70  |       page.getByRole("cell", { name: "AAPL", exact: true }),
  71  |     ).toBeVisible();
  72  |     await expect(
  73  |       page.getByRole("cell", { name: "MSFT", exact: true }),
  74  |     ).toBeVisible();
  75  |   });
  76  | 
  77  |   test("filters by max weight on Apply", async ({ page }) => {
  78  |     // weight <= 0.06 → NVDA (0.058), AMZN (0.041), GOOGL (0.038)
  79  |     await setSliderValue(page.getByTestId("weight-max"), 0.06);
  80  |     await page.getByTestId("search-apply").click();
  81  | 
  82  |     await expect(page.locator("tbody tr")).toHaveCount(3);
  83  |     await expect(
  84  |       page.getByRole("cell", { name: "NVDA", exact: true }),
  85  |     ).toBeVisible();
  86  |     await expect(
  87  |       page.getByRole("cell", { name: "AMZN", exact: true }),
  88  |     ).toBeVisible();
  89  |     await expect(
  90  |       page.getByRole("cell", { name: "GOOGL", exact: true }),
  91  |     ).toBeVisible();
  92  |   });
  93  | 
  94  |   test("filters by min value on Apply", async ({ page }) => {
  95  |     // value >= 170000 → AAPL (215340), MSFT (194880), NVDA (174120)
  96  |     await setSliderValue(page.getByTestId("value-min"), 170000);
  97  |     await page.getByTestId("search-apply").click();
  98  | 
  99  |     await expect(page.locator("tbody tr")).toHaveCount(3);
  100 |     await expect(
  101 |       page.getByRole("cell", { name: "AAPL", exact: true }),
  102 |     ).toBeVisible();
  103 |     await expect(
  104 |       page.getByRole("cell", { name: "MSFT", exact: true }),
  105 |     ).toBeVisible();
  106 |     await expect(
  107 |       page.getByRole("cell", { name: "NVDA", exact: true }),
  108 |     ).toBeVisible();
  109 |   });
  110 | 
  111 |   test("filters by max value on Apply", async ({ page }) => {
  112 |     // value <= 180000 → NVDA (174120), AMZN (123060), GOOGL (114040)
  113 |     await setSliderValue(page.getByTestId("value-max"), 180000);
  114 |     await page.getByTestId("search-apply").click();
  115 | 
  116 |     await expect(page.locator("tbody tr")).toHaveCount(3);
  117 |     await expect(
  118 |       page.getByRole("cell", { name: "NVDA", exact: true }),
  119 |     ).toBeVisible();
  120 |     await expect(
  121 |       page.getByRole("cell", { name: "AMZN", exact: true }),
  122 |     ).toBeVisible();
  123 |     await expect(
  124 |       page.getByRole("cell", { name: "GOOGL", exact: true }),
  125 |     ).toBeVisible();
  126 |   });
  127 | 
  128 |   test("display an empty state message when there is no matching holding for given search criteria on Apply", async ({
  129 |     page,
  130 |   }) => {
  131 |     await page.getByTestId("search-ticker").fill("not available");
  132 |     await page.getByTestId("search-apply").click();
  133 | 
  134 |     await expect(page.locator("tbody tr")).toHaveCount(1);
  135 |     await expect(
  136 |       page.getByText(/No holdings matching the specifieds search criteria/),
> 137 |     ).toBeVisible();
      |       ^ Error: expect(locator).toBeVisible() failed
  138 |   });
  139 | 
  140 |   // ─── Reset ───────────────────────────────────────────────────────────────────
  141 | 
  142 |   test("Reset clears all filters and shows all holdings", async ({ page }) => {
  143 |     await page.getByTestId("search-ticker").fill("AAPL");
  144 |     await page.getByTestId("search-apply").click();
  145 |     await expect(page.locator("tbody tr")).toHaveCount(1);
  146 | 
  147 |     await page.getByTestId("search-reset").click();
  148 | 
  149 |     await expect(page.locator("tbody tr")).toHaveCount(holdings.length);
  150 |     for (const h of holdings) {
  151 |       await expect(
  152 |         page.getByRole("cell", { name: h.ticker, exact: true }),
  153 |       ).toBeVisible();
  154 |     }
  155 |   });
  156 | 
  157 |   // ─── Sorting ─────────────────────────────────────────────────────────────────
  158 | 
  159 |   test("clicking a column header sorts the table ascending", async ({
  160 |     page,
  161 |   }) => {
  162 |     await page.getByRole("columnheader", { name: /Ticker/ }).click();
  163 | 
  164 |     // Ascending: AAPL, AMZN, GOOGL, MSFT, NVDA
  165 |     const firstTicker = page.locator("tbody tr").first().locator("td").first();
  166 |     await expect(firstTicker).toHaveText("AAPL");
  167 |     const lastTicker = page.locator("tbody tr").last().locator("td").first();
  168 |     await expect(lastTicker).toHaveText("NVDA");
  169 |   });
  170 | 
  171 |   test("clicking the same column header again sorts descending", async ({
  172 |     page,
  173 |   }) => {
  174 |     const header = page.getByRole("columnheader", { name: /Ticker/ });
  175 |     await header.click();
  176 |     await header.click();
  177 | 
  178 |     // Descending: NVDA, MSFT, GOOGL, AMZN, AAPL
  179 |     const firstTicker = page.locator("tbody tr").first().locator("td").first();
  180 |     await expect(firstTicker).toHaveText("NVDA");
  181 |     const lastTicker = page.locator("tbody tr").last().locator("td").first();
  182 |     await expect(lastTicker).toHaveText("AAPL");
  183 |   });
  184 | 
  185 |   test("clicking a different column clears sort icons from the previous column", async ({
  186 |     page,
  187 |   }) => {
  188 |     const tickerHeader = page.getByRole("columnheader", { name: /Ticker/ });
  189 |     await tickerHeader.click();
  190 |     await expect(tickerHeader.getByText("↑")).toBeVisible();
  191 | 
  192 |     await page.getByRole("columnheader", { name: /Name/ }).click();
  193 | 
  194 |     // Ticker header loses its sort icons
  195 |     await expect(tickerHeader.getByText("↑")).not.toBeVisible();
  196 |     await expect(tickerHeader.getByText("↓")).not.toBeVisible();
  197 |     await expect(tickerHeader.getByTitle("Clear sort")).not.toBeVisible();
  198 |     // Name header gains its ascending icon
  199 |     const nameHeader = page.getByRole("columnheader", { name: /Name/ });
  200 |     await expect(nameHeader.getByText("↑")).toBeVisible();
  201 |   });
  202 | 
  203 |   test("clicking the ✕ icon clears the sort and restores original order", async ({
  204 |     page,
  205 |   }) => {
  206 |     const tickerHeader = page.getByRole("columnheader", { name: /Ticker/ });
  207 |     await tickerHeader.click();
  208 |     await expect(
  209 |       page.locator("tbody tr").first().locator("td").first(),
  210 |     ).toHaveText("AAPL");
  211 | 
  212 |     await page.getByTitle("Clear sort").click();
  213 | 
  214 |     // Original fixture order: AAPL, MSFT, NVDA, AMZN, GOOGL
  215 |     const tickers = await page
  216 |       .locator("tbody tr td:first-child")
  217 |       .allTextContents();
  218 |     expect(tickers).toEqual(holdings.map((h) => h.ticker));
  219 | 
  220 |     // Sort icon and clear button gone from Ticker header
  221 |     await expect(tickerHeader.getByText("↑")).not.toBeVisible();
  222 |     await expect(tickerHeader.getByTitle("Clear sort")).not.toBeVisible();
  223 |   });
  224 | });
  225 | 
```