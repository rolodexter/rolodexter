import os
import re

# Define the target directory
TARGET_DIR = r"C:\Users\rolod\OneDrive\rolodexter Repo\LITERARY_PRODUCTS"

# Maximum filename length
MAX_FILENAME_LENGTH = 50

def normalize_name(name):
    """
    Converts file/folder names to comply with the Markdown style guide.
    - Uppercase all letters.
    - Replace spaces with underscores.
    - Remove special characters except underscores and dots.
    - Ensure .md files are converted to .MD.
    - Limit filenames to MAX_FILENAME_LENGTH.
    """
    # Convert to uppercase
    name = name.upper()
    # Replace spaces with underscores
    name = name.replace(" ", "_")
    # Remove special characters except underscores and dots (for file extensions)
    name = re.sub(r"[^A-Z0-9_.]", "", name)
    # Limit filename length
    if len(name) > MAX_FILENAME_LENGTH:
        name = name[:MAX_FILENAME_LENGTH]
    return name

def align_files_and_folders(directory):
    """
    Aligns all .md files and folder names recursively according to the style guide.
    """
    for root, dirs, files in os.walk(directory, topdown=False):  # Process subdirectories last
        # Rename files
        for filename in files:
            old_path = os.path.join(root, filename)
            new_filename = normalize_name(filename)
            # Convert .md files to .MD
            if new_filename.lower().endswith(".md"):
                new_filename = new_filename[:-3] + ".MD"
            new_path = os.path.join(root, new_filename)

            if old_path != new_path:
                os.rename(old_path, new_path)
                print(f"Renamed file: {old_path} -> {new_path}")
            else:
                print(f"Skipped file (already aligned): {old_path}")

        # Rename directories
        for dirname in dirs:
            old_path = os.path.join(root, dirname)
            new_dirname = normalize_name(dirname)
            new_path = os.path.join(root, new_dirname)

            if old_path != new_path:
                os.rename(old_path, new_path)
                print(f"Renamed directory: {old_path} -> {new_path}")
            else:
                print(f"Skipped directory (already aligned): {old_path}")

if __name__ == "__main__":
    align_files_and_folders(TARGET_DIR)
    print("Alignment process completed.")
