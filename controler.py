from flask import Flask, render_template_string
import os
import subprocess
from flask import Flask, request

app = Flask(__name__)

@app.route('/')
def index():
    with open('form.html', 'r') as f:
        return render_template_string(f.read())


@app.route('/process', methods=['POST'])
def process_data():
    print("⏰ Call")
    # 1. Get the data
    file = request.files.get('user_image')
    
    # 2. Save the file temporarily so your script can read it
    file_path = f"./current/temp_{file.filename}"
    file.save(file_path)
    print(f"💾 saved {file_path}")
    
    # 3. Call your script (assuming it takes text and path as arguments)
    # This is the "dirty" way, but it works for your prototype!
    # first is the characterset, then the limit
    result = subprocess.run(["python", "converter.py", "2", "50"], capture_output=True, text=True)
    
    # 4. Read your output file (if your script writes to a file)
    # Or just return the result.stdout if your script prints to console
    with open('out.txt', 'r') as f:
        output_content = f.read()
        
    os.remove(file_path)
    print("♻️ DELETED")

    return output_content

if __name__ == '__main__':
    app.run(debug=True, port=5000)
