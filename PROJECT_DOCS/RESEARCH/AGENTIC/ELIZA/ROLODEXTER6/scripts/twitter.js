import inquirer from 'inquirer';

// ...existing code...

async function main() {
    const answer = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'runScraper',
            message: 'Do you want to run the scraper?',
            default: true
        }
    ]);

    if (!answer.runScraper) {
        console.log('Skipping scraper and collecting data.');
        return;
    }

    // Initialize and run the scraper
    // ...existing code...
}

main();
