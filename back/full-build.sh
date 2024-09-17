docker rm -f -v lnr-back
docker rmi $(docker images |grep lnr-back)
sh build.sh
sh run.sh
