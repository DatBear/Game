docker-compose -p bs build --build-arg ENV_FILE=docker-dev.env client 
docker tag bs_client:latest jrankin312/bs_client:latest
docker push jrankin312/bs_client:latest
pause