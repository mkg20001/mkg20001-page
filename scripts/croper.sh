echo
for s in 1024 2048 2880; do
  o="../app/images/w:$s"
  rm -rf $o
  mkdir -p $o
  for f in stones.jpg; do
    c="convert -resize $s ../app/images/$f $o/$f"
    echo "+ $c"
    $c
  done
  echo
done
