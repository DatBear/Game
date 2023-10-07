docker-compose -p bs build --build-arg ENV_FILE=docker-dev.env ws
docker tag bs_ws:latest jrankin312/bs_ws:latest
docker push jrankin312/bs_ws:latest
pause