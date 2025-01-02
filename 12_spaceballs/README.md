# README

Recreate the Spaceballs Demo Dancer

TODO:

* Try different rendering effects.
* Add mod music player https://github.com/warpdesign/modplayer-js

## Creating SVG frames

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

## Deploy to heroku

```sh
# open heroku dashboard and create a qberted app.
open https://dashboard.heroku.com/

brew tap heroku/brew && brew install heroku
heroku login
heroku container:login

# build and push
docker build -f Dockerfile -t registry.heroku.com/spaceballs/web .
docker push registry.heroku.com/spaceballs/web

# create the new release
heroku container:release web -a spaceballs
open https://spaceballs.herokuapp.com/
```
