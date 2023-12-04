import math
from PIL import Image

PATH = "level.png"

chrs = " gdsbtw321pcC@         "
img = Image.open(PATH)
w = img.width
h = img.height
img = img.convert("RGB")
data = img.getdata()
bmp = [[] for i in range(h)]
usedColors = [(0, 0, 0), (67, 101, 48), (52, 35, 26), (72, 70, 68), (102, 139, 81), (156, 133, 120), (131, 91, 52), (255, 255, 0), (95, 95, 95), (75, 75, 75), (255, 255, 255), (0, 0, 255), (0, 0, 150), (255, 0, 255)]
y = -1
for i in range(len(data)):
    color = data[i]

    if i % w == 0:
        y += 1
        
    if not (color in usedColors):
        usedColors.append(color)

    
    bmp[y].append(chrs[usedColors.index(color)])

with open("javascript/level.js", "w") as file:
    finalCode = "var levels = [[\n"

    for i in range(len(bmp)):
        bmp[i] = "".join(bmp[i])

    for i in bmp:
        finalCode += '    "'+i.rstrip()+'",\n'
    finalCode += "]]; \n\n"

    file.write(finalCode)
print("level updated")