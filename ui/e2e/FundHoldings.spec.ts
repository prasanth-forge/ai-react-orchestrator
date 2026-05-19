import { test, expect, type Locator } from "@playwright/test";
import { holdings } from "../src/FundHoldings/fixtures/holdings";
import { EMPTY_HOLDINGS_MESSAGE } from "../src/constants";

// Range inputs don't respond to fill() — set value via the native prototype setter
// so React's synthetic onChange fires correctly.
async function setSliderValue(locator: Locator, value: number) {
  await locator.evaluate((input: HTMLInputElement, val: number) => {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value",
    )?.set;
    setter?.call(input, String(val));
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, value);
}

test.describe("FundHoldings", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  // ─── Data loading ────────────────────────────────────────────────────────────

  test("all holdings are loaded into the table", async ({ page }) => {
    const rows = page.locator("tbody tr");
    await expect(rows).toHaveCount(holdings.length);
    for (const h of holdings) {
      await expect(
        page.getByRole("cell", { name: h.ticker, exact: true }),
      ).toBeVisible();
    }
  });

  // ─── Search filters ───────────────────────────────────────────────────────────

  test("filters by ticker substring (case-insensitive) on Apply", async ({
    page,
  }) => {
    await page.getByTestId("search-ticker").fill("aapl");
    await page.getByTestId("search-apply").click();

    await expect(page.locator("tbody tr")).toHaveCount(1);
    await expect(
      page.getByRole("cell", { name: "AAPL", exact: true }),
    ).toBeVisible();
  });

  test("filters by name substring (case-insensitive) on Apply", async ({
    page,
  }) => {
    await page.getByTestId("search-name").fill("corp");
    await page.getByTestId("search-apply").click();

    await expect(page.locator("tbody tr")).toHaveCount(2);
    await expect(
      page.getByRole("cell", { name: "MSFT", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "NVDA", exact: true }),
    ).toBeVisible();
  });

  test("filters by min weight on Apply", async ({ page }) => {
    // weight >= 0.06 → AAPL (0.072), MSFT (0.065)
    await setSliderValue(page.getByTestId("weight-min"), 0.06);
    await page.getByTestId("search-apply").click();

    await expect(page.locator("tbody tr")).toHaveCount(2);
    await expect(
      page.getByRole("cell", { name: "AAPL", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "MSFT", exact: true }),
    ).toBeVisible();
  });

  test("filters by max weight on Apply", async ({ page }) => {
    // weight <= 0.06 → NVDA (0.058), AMZN (0.041), GOOGL (0.038)
    await setSliderValue(page.getByTestId("weight-max"), 0.06);
    await page.getByTestId("search-apply").click();

    await expect(page.locator("tbody tr")).toHaveCount(3);
    await expect(
      page.getByRole("cell", { name: "NVDA", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "AMZN", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "GOOGL", exact: true }),
    ).toBeVisible();
  });

  test("filters by min value on Apply", async ({ page }) => {
    // value >= 170000 → AAPL (215340), MSFT (194880), NVDA (174120)
    await setSliderValue(page.getByTestId("value-min"), 170000);
    await page.getByTestId("search-apply").click();

    await expect(page.locator("tbody tr")).toHaveCount(3);
    await expect(
      page.getByRole("cell", { name: "AAPL", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "MSFT", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "NVDA", exact: true }),
    ).toBeVisible();
  });

  test("filters by max value on Apply", async ({ page }) => {
    // value <= 180000 → NVDA (174120), AMZN (123060), GOOGL (114040)
    await setSliderValue(page.getByTestId("value-max"), 180000);
    await page.getByTestId("search-apply").click();

    await expect(page.locator("tbody tr")).toHaveCount(3);
    await expect(
      page.getByRole("cell", { name: "NVDA", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "AMZN", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("cell", { name: "GOOGL", exact: true }),
    ).toBeVisible();
  });

  test("display an empty state message when there is no matching holding for given search criteria on Apply", async ({
    page,
  }) => {
    await page.getByTestId("search-ticker").fill("not available");
    await page.getByTestId("search-apply").click();

    await expect(page.locator("tbody tr")).toHaveCount(1);
    await expect(page.getByText(EMPTY_HOLDINGS_MESSAGE)).toBeVisible();
  });

  // ─── Reset ───────────────────────────────────────────────────────────────────

  test("Reset clears all filters and shows all holdings", async ({ page }) => {
    await page.getByTestId("search-ticker").fill("AAPL");
    await page.getByTestId("search-apply").click();
    await expect(page.locator("tbody tr")).toHaveCount(1);

    await page.getByTestId("search-reset").click();

    await expect(page.locator("tbody tr")).toHaveCount(holdings.length);
    for (const h of holdings) {
      await expect(
        page.getByRole("cell", { name: h.ticker, exact: true }),
      ).toBeVisible();
    }
  });

  // ─── Sorting ─────────────────────────────────────────────────────────────────

  test("clicking a column header sorts the table ascending", async ({
    page,
  }) => {
    await page.getByRole("columnheader", { name: /Ticker/ }).click();

    // Ascending: AAPL, AMZN, GOOGL, MSFT, NVDA
    const firstTicker = page.locator("tbody tr").first().locator("td").first();
    await expect(firstTicker).toHaveText("AAPL");
    const lastTicker = page.locator("tbody tr").last().locator("td").first();
    await expect(lastTicker).toHaveText("NVDA");
  });

  test("clicking the same column header again sorts descending", async ({
    page,
  }) => {
    const header = page.getByRole("columnheader", { name: /Ticker/ });
    await header.click();
    await header.click();

    // Descending: NVDA, MSFT, GOOGL, AMZN, AAPL
    const firstTicker = page.locator("tbody tr").first().locator("td").first();
    await expect(firstTicker).toHaveText("NVDA");
    const lastTicker = page.locator("tbody tr").last().locator("td").first();
    await expect(lastTicker).toHaveText("AAPL");
  });

  test("clicking a different column clears sort icons from the previous column", async ({
    page,
  }) => {
    const tickerHeader = page.getByRole("columnheader", { name: /Ticker/ });
    await tickerHeader.click();
    await expect(tickerHeader.getByText("↑")).toBeVisible();

    await page.getByRole("columnheader", { name: /Name/ }).click();

    // Ticker header loses its sort icons
    await expect(tickerHeader.getByText("↑")).not.toBeVisible();
    await expect(tickerHeader.getByText("↓")).not.toBeVisible();
    await expect(tickerHeader.getByTitle("Clear sort")).not.toBeVisible();
    // Name header gains its ascending icon
    const nameHeader = page.getByRole("columnheader", { name: /Name/ });
    await expect(nameHeader.getByText("↑")).toBeVisible();
  });

  test("clicking the ✕ icon clears the sort and restores original order", async ({
    page,
  }) => {
    const tickerHeader = page.getByRole("columnheader", { name: /Ticker/ });
    await tickerHeader.click();
    await expect(
      page.locator("tbody tr").first().locator("td").first(),
    ).toHaveText("AAPL");

    await page.getByTitle("Clear sort").click();

    // Original fixture order: AAPL, MSFT, NVDA, AMZN, GOOGL
    const tickers = await page
      .locator("tbody tr td:first-child")
      .allTextContents();
    expect(tickers).toEqual(holdings.map((h) => h.ticker));

    // Sort icon and clear button gone from Ticker header
    await expect(tickerHeader.getByText("↑")).not.toBeVisible();
    await expect(tickerHeader.getByTitle("Clear sort")).not.toBeVisible();
  });
});
