docker rm -f -v lnr-client
docker rmi $(docker images |grep lnr-client)
sh build.sh
sh run.sh
