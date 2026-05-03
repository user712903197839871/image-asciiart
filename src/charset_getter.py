# ================================================
# 
# a module that gets the list of character lists 
# 
# ================================================

# import pprint

CHARSET_FILEPATH = "./charset"

# returs an array where each index is a list of characters
def getCharset() -> list[tuple[str, int, str]]:
    charset_array = []
    with open(CHARSET_FILEPATH) as charset_datafile:
        for line in charset_datafile:
            line.strip()

            set_type, index, charset_string = line.split(r"\split")

            items = [character.strip().strip('"') for character in charset_string.split(',') if character.strip()]

            charset_array.append((set_type, index, items))


    return charset_array
