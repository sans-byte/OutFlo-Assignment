// This is a local-only script for scraping LinkedIn profiles
// It would be run separately from the main application

/*
To use this script:
1. Install Playwright: npm install playwright
2. Run this script: npx ts-node scraper.ts
3. It will scrape LinkedIn profiles and save them to MongoDB

Note: This is a simplified example. In a real implementation, you would need to:
- Handle LinkedIn authentication
- Add proper error handling and rate limiting
- Implement more robust selectors for profile data
*/

import { chromium } from "playwright";
import { MongoClient } from "mongodb";

async function scrapeLinkedInProfiles() {
  // MongoDB connection
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/outflo";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection("leads");

    // Launch browser
    const browser = await chromium.launch({
      channel: "chrome", // 👈 this line tells it to use system-installed Chrome
      headless: false, // Optional: show the browser window
    });
    const context = await browser.newContext();

    // Login to LinkedIn (you would need to implement this)
    const page = await context.newPage();
    // await loginToLinkedIn(page);

    // Navigate to search results
    await page.goto(
      "https://www.linkedin.com/search/results/people/?geoUrn=%5B%22103644278%22%5D&industry=%5B%221594%22%2C%221862%22%2C%2280%22%5D&keywords=%22lead%20generation%20agency%22&origin=GLOBAL_SEARCH_HEADER&sid=z%40k&titleFreeText=Founder"
    );

    // Wait for search results to load
    await page.waitForSelector(".reusable-search__result-container");

    // Get profile URLs
    const profileUrls = await page.$$eval(
      ".reusable-search__result-container .app-aware-link",
      (links) =>
        links
          .map((link) => link.getAttribute("href"))
          .filter((href) => href && href.includes("/in/"))
          .filter((href, index, self) => self.indexOf(href) === index)
    );

    // Limit to 20 profiles
    const limitedUrls = profileUrls.slice(0, 20);

    // Scrape each profile
    for (const url of limitedUrls) {
      if (!url) continue;

      await page.goto(url);
      await page.waitForLoadState("networkidle");

      // Extract profile data
      const profileData = await page.evaluate(() => {
        const nameElement = document.querySelector(".text-heading-xlarge");
        const titleElement = document.querySelector(".text-body-medium");
        const locationElement = document.querySelector(
          ".text-body-small.inline.t-black--light.break-words"
        );

        return {
          name: nameElement ? nameElement.textContent?.trim() : "",
          jobTitle: titleElement
            ? titleElement.textContent?.trim().split(" at ")[0]
            : "",
          company: titleElement
            ? titleElement.textContent?.trim().split(" at ")[1]
            : "",
          location: locationElement ? locationElement.textContent?.trim() : "",
          profileUrl: window.location.href,
        };
      });

      // Save to MongoDB
      await collection.insertOne({
        ...profileData,
        createdAt: new Date(),
      });

      console.log(`Scraped: ${profileData.name}`);

      // Wait to avoid rate limiting
      await page.waitForTimeout(2000);
    }

    await browser.close();
    console.log("Scraping completed successfully");
  } catch (error) {
    console.error("Error during scraping:", error);
  } finally {
    await client.close();
  }
}

// Run the scraper
scrapeLinkedInProfiles();
