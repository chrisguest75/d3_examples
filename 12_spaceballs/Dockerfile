FROM nginx:1.17.10 

ENV PORT=80
WORKDIR /work
COPY bootstrap.sh /work/bootstrap.sh

WORKDIR /usr/share/nginx/html
COPY og ./og
COPY frames.json ./
COPY index.html ./

CMD ["/bin/sh", "-c", "/work/bootstrap.sh"]