from PIL import Image
import sys, time
from pathlib import Path

# feel free to change this boi, cuz everything onwards is dynamic
DEFAULT_MAXIMAL_WIDTH = 300
maximal_width = 0


# future math shi is calculated dynamically so feel free to add or subsrtact more characters
# cool variants
# default: [" ",".",":","-","=","+","*","#","%","@"]
# dual: [" ","@"]
# full: [" ",".", "-", "'", ":", "_", ",", "^", "=", ";", ">", "<", "+", "!", "r", "c", "*", "/", "z", "?", "s", "L", "T", "v", ")", "J", "7", "(", "|", "F", "i", "{", "C", "}", "f", "I", "3", "1", "t", "l", "u", "[", "n", "e", "o", "Z", "5", "Y", "x", "j", "y", "a", "]", "2", "E", "S", "w", "q", "k", "P", "6", "h", "9", "d", "4", "V", "p", "O", "G", "b", "U", "A", "K", "X", "H", "m", "8", "R", "D", "#", "$", "B", "g", "0", "M", "N", "W", "Q", "%", "&", "@"]

values_list = [
    [" ",".",":","-","=","+","*","#","%","@"],
    [" ","@"],
    [" ",".", "-", "'", ":", "_", ",", "^", "=", ";", ">", "<", "+", "!", "r", "c", "*", "/", "z", "?", "s", "L", "T", "v", ")", "J", "7", "(", "|", "F", "i", "{", "C", "}", "f", "I", "3", "1", "t", "l", "u", "[", "n", "e", "o", "Z", "5", "Y", "x", "j", "y", "a", "]", "2", "E", "S", "w", "q", "k", "P", "6", "h", "9", "d", "4", "V", "p", "O", "G", "b", "U", "A", "K", "X", "H", "m", "8", "R", "D", "#", "$", "B", "g", "0", "M", "N", "W", "Q", "%", "&", "@"]
]


# da main function, takes a filepath of img and formats into a strings
# resizes the image
# takes the full relative filepath, and the values in which it will color
# returns: 
#   a tuple, first index is string formated art 
#   second is amount of time it took to do dis bish
def printImgToAscii(filepath: str, values) -> tuple[str, int]:
    start_time = time.perf_counter()
    resulting_str: str = ""
    with Image.open(filepath).convert("L") as gray_img:
        new_image_height = (gray_img.height * maximal_width) // gray_img.width
        resized_gray_img = gray_img.resize((maximal_width, new_image_height), resample=Image.Resampling.LANCZOS)

        loaded_img = resized_gray_img.load()

        divisor: int = 255 // len(values)
        remainder: int = 255 - (255 % len(values)) -1

        for y in range(0, new_image_height):
            for x in range(0, maximal_width):
                
                if loaded_img[x, y] > remainder:
                    value = remainder
                else:
                    value = loaded_img[x, y]

                index = value // divisor

                character = values[index]

                resulting_str += " " + character + " "
            
            resulting_str += "\n"

    end_time = time.perf_counter()

    return (resulting_str, end_time-start_time)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("[WARNING] character mode not provided, default taken")
        character_set_index = 0
    else:
        character_set_index = int(sys.argv[1])

    if len(sys.argv) < 3:
        print("[WARNING] no max width provided, default taken")
        maximal_width = DEFAULT_MAXIMAL_WIDTH
    else:
        maximal_width = int(sys.argv[2])


    if character_set_index >= len(values_list) or character_set_index < 0:
        print("[ERROR] character mode invalid")
        exit(1)

    character_set = values_list[character_set_index]

    with open("out.txt", "w") as out:
        empty = True
        for file in Path("./current").iterdir():
            empty = False
            art, execution_time = printImgToAscii(file, character_set)

            out.write(art)

            print(f"[SUCCESS] Executed in {execution_time}s")
    if empty:
        print("[WARNING] no files provided")
