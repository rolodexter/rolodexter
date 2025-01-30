import os

def rename_directories_to_uppercase(root_dir):
    for dirpath, dirnames, filenames in os.walk(root_dir, topdown=False):
        for dirname in dirnames:
            old_path = os.path.join(dirpath, dirname)
            new_path = os.path.join(dirpath, dirname.upper())

            if old_path != new_path:  # Avoid unnecessary renaming
                try:
                    os.rename(old_path, new_path)
                    print(f"Renamed: {old_path} ➝ {new_path}")
                except Exception as e:
                    print(f"Error renaming {old_path}: {e}")

if __name__ == "__main__":
    repo_root = os.getcwd()  # Change this if running from a different location
    rename_directories_to_uppercase(repo_root)
    print("\n✅ Directory renaming completed!")
