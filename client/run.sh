docker run --net lnr-network -it -d --restart=always --name lnr-client -h lnr-client -p 80:80 -e HOST_NAME="prod" lnr-client:0.0.0
