import os
import re

# Define the target directory
TARGET_DIR = r"C:\Users\rolod\OneDrive\rolodexter Repo\LITERARY_PRODUCTS\JOES_NOTES"

# Maximum filename length
MAX_FILENAME_LENGTH = 50

def normalize_filename(name):
    """Converts file/folder name to comply with the Markdown style guide."""
    # Convert to uppercase
    name = name.upper()
    # Replace spaces with underscores
    name = name.replace(" ", "_")
    # Remove special characters except underscores and dots (for file extensions)
    name = re.sub(r"[^A-Z0-9_.]", "", name)
    # Ensure length compliance
    if len(name) > MAX_FILENAME_LENGTH:
        name = name[:MAX_FILENAME_LENGTH]
    return name

def resolve_conflict(path):
    """Appends a unique number to the name if a conflict exists."""
    if not os.path.exists(path):
        return path  # No conflict, return original path

    base, ext = os.path.splitext(path)
    counter = 1
    while os.path.exists(path):
        path = f"{base}_{counter}{ext}"
        counter += 1
    return path

def rename_files_and_folders(directory):
    """Renames all files and folders recursively to match the style guide."""
    for root, dirs, files in os.walk(directory, topdown=False):  # Process subdirectories last
        # Rename files
        for filename in files:
            old_path = os.path.join(root, filename)
            new_filename = normalize_filename(filename)
            # Ensure .md files are converted to .MD
            if new_filename.lower().endswith(".md"):
                new_filename = new_filename[:-3] + ".MD"

            new_path = os.path.join(root, new_filename)

            # Only rename if there's a conflict
            if old_path != new_path:
                new_path = resolve_conflict(new_path)
                os.rename(old_path, new_path)
                print(f"Renamed file: {old_path} -> {new_path}")
            else:
                print(f"Skipped file (already compliant): {old_path}")

        # Rename directories
        for dirname in dirs:
            old_path = os.path.join(root, dirname)
            new_dirname = normalize_filename(dirname)
            new_path = os.path.join(root, new_dirname)

            if old_path != new_path:
                new_path = resolve_conflict(new_path)
                os.rename(old_path, new_path)
                print(f"Renamed directory: {old_path} -> {new_path}")
            else:
                print(f"Skipped directory (already compliant): {old_path}")

if __name__ == "__main__":
    rename_files_and_folders(TARGET_DIR)
    print("Renaming process completed.")
