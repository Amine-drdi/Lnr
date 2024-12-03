docker run --net lnr-network  -it -d --restart=always --name lnr-back -h lnr-back -p 5000:5000 -v /home/ubuntu/uploads:/usr/src/app/uploads  -e HOST_NAME="prod" lnr-back:1.0.0
