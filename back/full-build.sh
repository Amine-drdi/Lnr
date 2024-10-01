docker rm -f -v lnr-back:1.0.0
docker rmi $(docker images |grep lnr-back:1.0.0)
sh build.sh
sh run.sh
