import os

def setup_nomix():
    base_path = "C:/rolodexter/TECH_DOCS/FINANCE_ECONOMICS/CRYPTOECONOMICS/NOMIX"
    subdirs = ["src", "data", "logs", "config", "docs"]
    
    for subdir in subdirs:
        os.makedirs(os.path.join(base_path, subdir), exist_ok=True)
    
    files = {
        "README.md": "# NOMIX\n\nCrypto market intelligence and trading console for the rolodexter ecosystem.",
        "requirements.txt": "# Dependencies (if using Python)\npandas\nyfinance\nrequests",
        "setup.bat": "@echo off\necho Setting up NOMIX...\npython nomix_console.py",
        "nomix_console.py": """import os\n\ndef login():\n    username = input('Username: ')\n    password = input('Password: ')\n    if username == 'joemaristela' and password == 'rolodexter':\n        home_screen()\n    else:\n        print('Invalid credentials. Try again.')\n        login()\n\ndef home_screen():\n    print('\nWelcome to NOMIX, Joe Maristela!')\n    while True:\n        command = input('1. Log Out\nChoose an option: ')\n        if command == '1':\n            print('Logging out...')\n            break\n\nprint('NOMIX Crypto Market Intelligence Console')\nlogin()"""
    }
    
    for file, content in files.items():
        with open(os.path.join(base_path, file), "w") as f:
            f.write(content)
    
    print("NOMIX folder structure and basic files created successfully.")

setup_nomix()
