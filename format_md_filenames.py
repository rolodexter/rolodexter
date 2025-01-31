import os

def format_md_filenames(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            # Check if the file is a Markdown file
            if file.lower().endswith(".md"):
                # Split the filename and extension
                name, ext = os.path.splitext(file)
                
                # Format the name to uppercase and replace spaces or hyphens with underscores
                formatted_name = name.replace(" ", "_").replace("-", "_").upper()
                
                # Ensure the extension is in uppercase
                formatted_ext = ext.upper()
                
                # Create the new filename
                new_filename = f"{formatted_name}{formatted_ext}"
                
                # Check if the filename needs to be changed
                if file != new_filename:
                    old_filepath = os.path.join(root, file)
                    new_filepath = os.path.join(root, new_filename)
                    
                    try:
                        os.rename(old_filepath, new_filepath)
                        print(f"Renamed: {old_filepath} -> {new_filepath}")
                    except Exception as e:
                        print(f"Failed to rename {old_filepath}: {e}")

# Update the path to the JOES_NOTES folder here
joes_notes_directory = r"LITERARY_PRODUCTS\JOES_NOTES"

if __name__ == "__main__":
    format_md_filenames(joes_notes_directory)
    print("Markdown filename formatting complete!")
