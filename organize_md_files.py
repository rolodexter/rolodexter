import os
import shutil

# Define the base directory for MISC files
misc_directory = "LITERARY_PRODUCTS/JOES_NOTES/MISC"

target_folders = {
    "HISTORY": ["1973.MD", "2023.MD", "2024.MD", "JANUARY_2025.MD", "HISTORY.MD", "MANHATTAN_PROJECT.MD", "MONTREAL_PROTOCOL.MD", "NICCOLO_MACHIAVELLI.MD", "THOMAS_HOBBES.MD"],
    "CRYPTO_ECONOMICS": ["BITCOIN.MD", "BITCOIN_BASICS.MD", "QUANTSTAMP.MD", "STOCKS.MD", "VALUATIONS.MD", "TRILLION_DOLLARS.MD", "GOLDMAN_SACHS.MD", "PRIVATE_EQUITY.MD", "GOVERNMENT_BONDS.MD", "MONEY_MARKET_INSTRUMENTS.MD"],
    "TECHNOLOGY": ["TECHNOLOGY.MD", "MACHINE_LEARNING.MD", "ZERO_KNOWLEDGE_PROOFS.MD", "SMART_CONTRACTS.MD", "SOFTWARE_ENGINEERING.MD", "CRYPTOGRAPHY.MD", "LLM.MD", "AI_AUTOMATION.MD", "FULLY_HOMOMORPHIC_ENCRYPTION.MD"],
    "ENVIRONMENT": ["CLIMATE_CHANGE.MD", "CLIMATE_NEUTRALITY.MD", "ELECTRIC_VEHICLES.MD", "WILDFIRES.MD", "RENEWABLE_ENERGY.MD", "OZONE_HOLE.MD"],
    "PHILOSOPHY": ["CONSCIOUSNESS.MD", "LINGUISTIC_DETERMINISM.MD", "MERGING_REALITIES.MD", "EVOLUTIONARY_IMPERATIVE.MD", "EVOLUTIONARY_LEAP.MD", "SPIRITUALITY.MD"],
    "SECURITY": ["CYBERSECURITY.MD", "CYBER_WARFARE.MD", "NATIONAL_SECURITY.MD", "US_SECURITY.MD", "INFORMATION_WARFARE.MD", "SURVEILLANCE.MD", "DISINFORMATION.MD"],
    "GOVERNANCE": ["REGULATORY_FRAMEWORKS.MD", "REGULATORY_ENVIRONMENTS.MD", "DECENTRALIZATION.MD", "GOVERNANCE_DECENTRALIZATION.MD", "POLITICAL_REALISM.MD", "PUBLIC_SECTOR_ENGAGEMENT.MD"],
    "HEALTH": ["MEDICINE.MD", "MENTAL_HEALTH.MD", "HEALTH_AWARENESS.MD", "GENETIC_VARIATION.MD", "INSURANCE_CRISIS.MD", "BOARD_CERTIFIED_DOCTORS.MD", "PHYSIOLOGY.MD"],
    "SPACE": ["PROJECT_BLUE_BOOK.MD", "PROJECT_SIGN.MD", "ROSWELL.MD", "TRANSMEDIUM_CAPABILITIES.MD", "METALLIC_ORB.MD", "DISC_SHAPED_UFO.MD", "DIAMOND_SHAPED_UFO.MD", "PYRAMID_SHAPED_UFO.MD", "EXTRATERRESTRIAL_LIFE.MD", "NASA.MD"]
}

def organize_files():
    for category, files in target_folders.items():
        category_path = os.path.join("LITERARY_PRODUCTS/JOES_NOTES", category)
        os.makedirs(category_path, exist_ok=True)  # Create category folder if it doesn't exist
        
        for file_name in files:
            old_path = os.path.join(misc_directory, file_name)
            new_path = os.path.join(category_path, file_name)
            
            if os.path.exists(old_path):
                shutil.move(old_path, new_path)
                print(f"Moved {file_name} -> {category}/")
            else:
                print(f"File not found: {file_name}, skipping.")

if __name__ == "__main__":
    organize_files()
    print("Markdown files successfully organized!")
