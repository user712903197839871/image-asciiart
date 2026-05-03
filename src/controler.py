import os, subprocess
from flask import Flask, request, render_template
import charset_getter as charset_getter

# import pprint

app = Flask(__name__)

@app.route('/')
def index():
    charset = charset_getter.getCharset()

    data = {
        "title": "Image to Ascii",
        "charset": charset
    }

    return render_template('index.html', data=data)


@app.route('/process', methods=['POST'])
def process_data():
    print("⏰ Call")
    # 1. Get the data from form
    file = request.files.get('user_image')
    charset = request.form.get('charset')
    char_limit = request.form.get('char_limit')

    # data validation
    if file.filename == '':
        return "no file given!"
    
    if int(char_limit) < 0:
        return "boi u cannot go negative!"
    elif int(char_limit) < 20:
        return "boi, u cannot go lowwer!"
    elif int(char_limit) > 2499:
        return "boi, u cannot go higher"

    
    # 2. Save the file temporarily so converter can read it
    file_path = f"./current/temp_{file.filename}"
    file.save(file_path)
    print(f"💾 saved {file_path}")
    
    # 3. Call the converter 
    # first is the characterset, then the limit
    result = subprocess.run(["python", "converter.py", charset, char_limit], capture_output=True, text=True)
    
    # print(result)

    # 4. Read output file
    with open('out.txt', 'r') as f:
        output_content = f.read()
        
    
    os.remove(file_path)
    print("♻️  DELETED")

    return output_content

if __name__ == '__main__':
    app.run(debug=True, port=5000)
