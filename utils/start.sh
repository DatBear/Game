#this is run on the server to start everything up
sudo docker run --pull=always -p 80:8080 -d jrankin312/bs_client
sudo docker run --pull=always -p 4000:4000 -d jrankin312/bs_ws