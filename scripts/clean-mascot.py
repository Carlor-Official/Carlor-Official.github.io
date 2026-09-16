"""User-authorized pixel-only background cleanup; preserve all non-mask RGB pixels."""
from PIL import Image
from collections import deque
im = Image.open('docs/public/logo.png').convert('RGBA')
original = im.copy()
w, h = im.size
pixels = im.load()
# Visually reviewed background islands; exclude face, fabric and painted highlights.
seeds = [(74,177),(44,276),(38,282),(485,303),(487,347),(507,390),
         (38,448),(9,420),(19,445),(431,444),(125,458),(188,452),
         (375,453),(394,456),(156,458),(414,462),(431,466),(91,473),
         (460,463),(127,480),(35,475)]
mask=set()
for seed in seeds:
    queue=deque([seed])
    while queue:
        x,y=queue.popleft()
        if (x,y) in mask or not (0<=x<w and 0<=y<h): continue
        r,g,b,a=pixels[x,y]
        if a<1 or min(r,g,b)<218 or max(r,g,b)-min(r,g,b)>25: continue
        mask.add((x,y))
        queue.extend([(x-1,y),(x+1,y),(x,y-1),(x,y+1)])
for x,y in mask:
    r,g,b,a=pixels[x,y]
    pixels[x,y]=(r,g,b,0)
assert all(original.getpixel((x,y))[:3] == im.getpixel((x,y))[:3] for x,y in mask)
im.save('docs/public/mascot-clean.png', optimize=True)
print(f'{w}x{h}; removed {len(mask)} background pixels; RGB artwork unchanged')
