import os

# Define the directory to rename files and folders
base_directory = r"C:\Users\rolod\OneDrive\rolodexter Repo\TECH_DOCS"

def rename_files_and_folders(directory):
    # Walk through all files and folders
    for root, dirs, files in os.walk(directory, topdown=False):
        # Rename files
        for file in files:
            original_path = os.path.join(root, file)
            # Convert file name to ALL CAPS, replace spaces and special characters
            new_name = file.upper().replace(' ', '_').replace('-', '_')
            new_name = os.path.splitext(new_name)[0] + ".MD"  # Ensure .MD extension
            new_path = os.path.join(root, new_name)

            if original_path != new_path:
                os.rename(original_path, new_path)
                print(f"Renamed file: {original_path} -> {new_path}")

        # Rename folders
        for folder in dirs:
            original_folder_path = os.path.join(root, folder)
            # Convert folder name to ALL CAPS, replace spaces and special characters
            new_folder_name = folder.upper().replace(' ', '_').replace('-', '_')
            new_folder_path = os.path.join(root, new_folder_name)

            if original_folder_path != new_folder_path:
                os.rename(original_folder_path, new_folder_path)
                print(f"Renamed folder: {original_folder_path} -> {new_folder_path}")

# Execute the renaming process
rename_files_and_folders(base_directory)
