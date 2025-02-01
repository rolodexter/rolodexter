import os
import re

# Define the target directory
TARGET_DIR = r"C:\Users\rolod\OneDrive\rolodexter Repo\LITERARY_PRODUCTS\JOES_NOTES"

def remove_suffix_1(name):
    """Removes the `_1` suffix from a file or directory name."""
    return re.sub(r"_1(\.[A-Z0-9]+)?$", r"\1", name)  # Removes `_1` before extensions or at the end of names

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
    """Renames all files and folders recursively to remove `_1` suffix."""
    for root, dirs, files in os.walk(directory, topdown=False):  # Process subdirectories last
        # Rename files
        for filename in files:
            old_path = os.path.join(root, filename)
            new_filename = remove_suffix_1(filename)
            new_path = os.path.join(root, new_filename)

            if old_path != new_path:
                # Resolve conflicts if needed
                new_path = resolve_conflict(new_path)
                os.rename(old_path, new_path)
                print(f"Renamed file: {old_path} -> {new_path}")
            else:
                print(f"Skipped file (no `_1` suffix): {old_path}")

        # Rename directories
        for dirname in dirs:
            old_path = os.path.join(root, dirname)
            new_dirname = remove_suffix_1(dirname)
            new_path = os.path.join(root, new_dirname)

            if old_path != new_path:
                # Resolve conflicts if needed
                new_path = resolve_conflict(new_path)
                os.rename(old_path, new_path)
                print(f"Renamed directory: {old_path} -> {new_path}")
            else:
                print(f"Skipped directory (no `_1` suffix): {old_path}")

if __name__ == "__main__":
    rename_files_and_folders(TARGET_DIR)
    print("Renaming process completed.")
