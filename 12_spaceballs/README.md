# README
Spaceballs Dancer

## Creating SVG

```sh
# download a video of a dancer
youtube-dl https://www.youtube.com/watch\?v\=gPxjgSK08lc

# export thumbnail frames
ffmpeg -i headlooktest.mp4 -vf ./frames/headlooktest_%05d.jpg

# crop images and remove background
mkdir ./converted_frames

for file in ./frames/headlooktest_*.jpg; do
    # remove extension
    outname="${file%.*}"
    convert "$file" -fill white -draw "rectangle 0,0 500,720 rectangle 750,0 1280,720" ./converted_frames/"$(basename $outname).bmp"
done

# install potrace 
brew info potrace

# open in sketchbook
/Applications/Autodesk/SketchBook/SketchBook.app/Contents/MacOS/SketchBook ./converted_frames/headlooktest_00002.bmp 


mkdir ./svg_frames

for file in ./converted_frames/*.bmp; do
    # remove extension
    outname="${file%.*}"
    potrace --svg --output "./svg_frames/$(basename $outname).svg" $file
done

potrace --svg --output ./svg_frames/headlooktest_00001.svg ./converted_frames/headlooktest_00001.bmp 


# open in chrome
open ./svg_frames/headlooktest_00001.svg     

```