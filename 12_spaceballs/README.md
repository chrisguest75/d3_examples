# README
Spaceballs Dancer

TODO:
* Preload the frames
* Have a fade effect behind them.
* Stop the flickering.
* Try different rendering effects. 
* Add a pixelised font render.  

## Creating SVG

```sh
# download a video of a dancer
youtube-dl https://www.youtube.com/watch\?v\=gPxjgSK08lc

# export thumbnail frames
mkdir -p ./frames
ffmpeg -i danceloop.mp4 ./frames/danceloop_%05d.jpg

# crop images and remove background
mkdir ./converted_frames
for file in ./frames/danceloop*.jpg; do
    # remove extension
    outname="${file%.*}"
    convert "$file" -fill white -draw "rectangle 0,0 300,720 rectangle 950,0 1280,720" ./converted_frames/"$(basename $outname).bmp"
done

# install potrace 
brew info potrace

brew install gimp



# open in sketchbook
/Applications/Autodesk/SketchBook/SketchBook.app/Contents/MacOS/SketchBook ./converted_frames/headlooktest_00002.bmp 


mkdir ./svg_frames

for file in ./converted_frames/danceloop*.bmp; do
    # remove extension
    outname="${file%.*}"
    potrace --svg --output "./svg_frames/$(basename $outname).svg" $file
done

potrace --svg --output ./svg_frames/headlooktest_00001.svg ./converted_frames/headlooktest_00001.bmp 


# open in chrome
open ./svg_frames/headlooktest_00001.svg     

```