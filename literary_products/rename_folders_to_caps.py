import os

def rename_folders_to_caps(base_dir, ignore_folder="JOES_NOTES"):
    """
    Rename all folders and subfolders in the given directory to ALL CAPS,
    excluding a specified folder.

    :param base_dir: The root directory to rename folders within.
    :param ignore_folder: Folder name to exclude from renaming.
    """
    for root, dirs, files in os.walk(base_dir, topdown=True):
        # Avoid renaming the ignore folder
        if ignore_folder in dirs:
            dirs.remove(ignore_folder)

        for dir_name in dirs:
            current_path = os.path.join(root, dir_name)
            new_name = dir_name.upper()
            new_path = os.path.join(root, new_name)

            # Rename if the name differs
            if current_path != new_path:
                try:
                    os.rename(current_path, new_path)
                    print(f"Renamed: {current_path} ➝ {new_path}")
                except Exception as e:
                    print(f"Error renaming {current_path}: {e}")


if __name__ == "__main__":
    # Set the base directory
    BASE_DIR = r"C:\Users\rolod\OneDrive\rolodexter Repo\literary_products"

    # Run the renaming function
    rename_folders_to_caps(BASE_DIR)

    print("\n✅ Folder renaming completed! Check the directory for changes.")
