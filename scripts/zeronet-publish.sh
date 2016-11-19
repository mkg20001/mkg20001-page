site=$1
if [ -z $1 ]; then site=1MBFot8DT9hBbjULhMay9t2oHZq1bwzuvT; fi
docker exec -it zeronet sh -c "cd \$HOME;./zeronet.py siteSign $site;./zeronet.py sitePublish $site"
