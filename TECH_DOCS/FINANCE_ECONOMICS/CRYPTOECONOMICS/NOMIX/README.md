# NOMIX Project

NOMIX is a command-line interface (CLI) tool designed for simulating trading and performing market analysis. This project aims to provide users with a comprehensive platform for backtesting trading strategies and analyzing market data.

## Project Structure

```
NOMIX
├── src
│   └── nomix_console.py       # Main entry point for the console application
├── data                        # Directory for sample datasets and market data
├── logs                        # Directory for execution logs
├── config                      # Directory for configuration files
├── pipeline                    # Directory for storing scraped data
├── docs
│   └── README.md              # Documentation for the project
├── setup.bat                  # Batch script to set up and launch the console
├── requirements.txt           # List of dependencies for the project
└── README.md                  # Project description and instructions
```

## Features

- Simulate trading scenarios and strategies.
- Perform market analysis using historical data.
- Easy-to-use command-line interface for user interaction.
- Logging capabilities for debugging and performance tracking.
- Organized storage of scraped data in the `pipeline` folder.

## Installation

1. Clone the repository:

   ```
   git clone <repository-url>
   cd NOMIX
   ```

2. Install the required dependencies:

   ```
   pip install -r requirements.txt
   ```

3. Install Playwright:

   ```
   pip install playwright
   playwright install
   ```

4. Configure your API keys and settings in the `config/` directory.

## Usage

To launch the NOMIX console, run the following command in your terminal:

```
python src/nomix_console.py
```

Alternatively, you can use the provided batch script:

```
setup.bat
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
