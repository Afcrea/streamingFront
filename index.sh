#!/bin/bash
# ffmpeg 를 통해 해당 경로의 동영상 파일을 디코딩함

ffmpeg -re -i "/var/www/456.mp4" -c:v copy -c:a aac -ar 44100 -ac 1 -f flv rtmp://localhost/live/stream
