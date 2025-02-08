# NOMIX Documentation

## Overview
NOMIX is a command-line interface (CLI) tool designed for simulating trading and performing market analysis. It provides users with the ability to backtest trading strategies using historical market data and execute trading simulations.

## Project Structure
The NOMIX project is organized into the following directories and files:

- **src/**: Contains the core scripts for the console application.
  - **nomix_console.py**: The main entry point for the console application, implementing the CLI for trading simulations and market analysis.
  
- **data/**: This directory holds sample datasets and market data used for backtesting and trading simulations. It may include CSV files or other relevant data formats.

- **logs/**: Used for storing execution logs, which assist in debugging and tracking the application's performance and errors.

- **config/**: Contains configuration files that store API keys, application settings, and exchange configurations. This may include JSON or YAML files for easy management of settings.

- **docs/**: Documentation files, including this README, providing an overview and usage guidelines for the NOMIX console.

- **setup.bat**: A batch script designed to set up the environment and launch the NOMIX console in the terminal. It includes commands to install dependencies and run the main script.

- **requirements.txt**: Lists the dependencies required for the project if using Python, specifying the packages and their versions needed to run the application.

- **README.md**: Provides a project description and instructions for users on how to set up and use the NOMIX console, including features, installation steps, and usage examples.

## Setup Instructions
1. Clone the repository or download the project files.
2. Navigate to the NOMIX directory in your terminal.
3. Run `setup.bat` to install dependencies and set up the environment.
4. Launch the console by executing `python src/nomix_console.py`.

## Usage Guidelines
Once the console is launched, you can use various commands to simulate trading and analyze market data. Refer to the documentation in the `src/nomix_console.py` file for detailed command usage and options.

## Contributing
Contributions to the NOMIX project are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.