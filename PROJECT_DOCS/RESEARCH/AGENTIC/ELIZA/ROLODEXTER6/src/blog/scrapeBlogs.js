import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Handle __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Input and output file paths
const inputFilePath = path.join(__dirname, 'blogList.txt');
const outputFilePath = path.join(__dirname, 'articles.jsonl');

// Common header/footer phrases to filter out
const filterPhrases = [
    'Pmarchive', 'Fictive Kin', 'Get the ebook', 'Marc Andreessen’s blog'
];

// Function to read URLs from file
async function loadUrlsFromFile() {
    try {
        const data = await fs.readFile(inputFilePath, 'utf8');
        return data.split('\n').filter(url => url.trim() !== '');
    } catch (error) {
        console.error(`Error reading ${inputFilePath}:`, error.message);
        return [];
    }
}

// Function to fetch and parse article content
async function fetchArticleText(url) {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Target the main content container, if known
        let articleText = $('article').text() || $('#main-content').text() || $('body').text();
        
        // Filter out unwanted phrases
        articleText = articleText
            .split('\n')
            .map(line => line.trim())
            .filter(line => {
                return line.length > 20 && // Avoid very short lines that may be part of headers/footers
                       !filterPhrases.some(phrase => line.includes(phrase));
            })
            .join(' ');

        return articleText.trim();
    } catch (error) {
        console.error(`Error fetching ${url}:`, error.message);
        return null;
    }
}

// Function to write JSONL entries
async function appendToJsonlFile(text) {
    const jsonlEntry = JSON.stringify({ text }) + '\n';
    await fs.appendFile(outputFilePath, jsonlEntry, 'utf8');
}

// Main function to process each URL
async function processArticles() {
    // Clear existing file if it exists
    try {
        await fs.unlink(outputFilePath);
    } catch (error) {
        // Ignore error if file does not exist
    }

    const urls = await loadUrlsFromFile();
    if (urls.length === 0) {
        console.log("No URLs found in the input file.");
        return;
    }

    for (const url of urls) {
        console.log(`Processing ${url}`);
        const articleText = await fetchArticleText(url);

        if (articleText) {
            await appendToJsonlFile(articleText);
            console.log(`Successfully saved article from ${url}`);
        } else {
            console.warn(`Skipped ${url} due to fetch error.`);
        }
    }

    console.log(`\nArticles successfully saved to ${outputFilePath}`);
}

// Run the script
processArticles();
