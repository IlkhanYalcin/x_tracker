const puppeteer = require('puppeteer');
const fs = require('fs');
const credentials = require('./credentials.json');

const LOGIN_URL = 'https://twitter.com/login';
const FOLLOWERS_URL = 'https://x.com/recon_settler/followers';
const FOLLOWING_URL = 'https://x.com/recon_settler/following';

// Credentials
const USERNAME = 'ilkhankokdemir@hotmail.com';
const PASSWORD = "29052002x'D";

// Helper to save data
const saveData = (data, filename) => {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
};

// Scrape followers or following
const scrapeList = async (page, url) => {
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Wait for list to load
  await page.waitForSelector('div[role="list"]');

  const users = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('div[role="listitem"] div span span'))
      .map(el => el.textContent);
  });

  return users;
};

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // Set to false for debugging
  const page = await browser.newPage();

  // Log in to X
  await page.goto(LOGIN_URL, { waitUntil: 'networkidle2' });
  await page.type('input[name="text"]', USERNAME);
  await page.click('div[data-testid="LoginForm_Login_Button"]');
  await page.waitForTimeout(1000); // Adjust timing as needed
  await page.type('input[name="password"]', PASSWORD);
  await page.click('div[data-testid="LoginForm_Login_Button"]');
  await page.waitForNavigation();

  // Scrape followers and following
  const followers = await scrapeList(page, FOLLOWERS_URL);
  const following = await scrapeList(page, FOLLOWING_URL);

  // Load previous data
  let prevFollowers = [];
  let prevFollowing = [];
  try {
    prevFollowers = JSON.parse(fs.readFileSync('followers.json', 'utf8'));
    prevFollowing = JSON.parse(fs.readFileSync('following.json', 'utf8'));
  } catch (err) {
    console.log('No previous data found.');
  }

  // Detect changes
  const newFollowers = followers.filter(f => !prevFollowers.includes(f));
  const unfollowers = prevFollowers.filter(f => !followers.includes(f));
  const newFollowing = following.filter(f => !prevFollowing.includes(f));
  const unfollowed = prevFollowing.filter(f => !following.includes(f));

  // Log changes
  console.log('New Followers:', newFollowers);
  console.log('Unfollowers:', unfollowers);
  console.log('New Following:', newFollowing);
  console.log('Unfollowed:', unfollowed);

  // Save current state
  saveData(followers, 'followers.json');
  saveData(following, 'following.json');

  await browser.close();
})();