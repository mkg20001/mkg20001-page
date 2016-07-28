ipfs add -q -r dist > ipfs-publish.log
tail -n1 ipfs-publish.log > IPFS-HASH
echo https://ipfs.io/ipfs/$(cat IPFS-HASH) > IPFS-URL
#ipfs name publish $(cat IPFS-HASH) > ipns-publish.log
