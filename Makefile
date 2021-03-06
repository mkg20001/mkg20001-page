build:
	if ! [ -d node_modules ]; then npm i; fi
	npm run build
gh-pages: build
	cp IPFS-HASH dist
	cp IPFS-URL dist
	git config --global user.name "mkg20001"
	git config --global user.email "mkg20001@gmail.com"
	npm run publish
zeronet:
	npm run ipfs-build
	cp IPFS-HASH dist
	cp IPFS-URL dist
	sudo rm -rf $(HOME)/ZeroNet/1MBFot8DT9hBbjULhMay9t2oHZq1bwzuvT/web
	sudo mkdir $(HOME)/ZeroNet/1MBFot8DT9hBbjULhMay9t2oHZq1bwzuvT/web
	sudo cp -r -v ./dist/* $(HOME)/ZeroNet/1MBFot8DT9hBbjULhMay9t2oHZq1bwzuvT/web
zeronet-publish: zeronet
	bash ./scripts/zeronet-publish.sh
ipfs:
	npm run ipfs-build
	ipfs add -r dist
ipfs-publish: ipfs
	bash scripts/ipfs-publish.sh
publish: ipfs-publish zeronet-publish gh-pages
clean:
	rm -rf dist .tmp .tmpdist .tmpbuild release
distclean: clean
	rm -rf node_modules MAIN
watch:
	nodemon /usr/bin/npm run serve --ext js,html,css -i dist -i .tmpbuild -i .tmp
update: crop
	cd scripts;bash update.sh
	bower install visionmedia/page.js jquery #fontawesome
	#rm -rf app/fonts;mkdir -p app/fonts
	cp bower_components/page/page.js app/page.js
	cp bower_components/jquery/dist/jquery.min.js app/jquery.js
	#cp bower_components/font-awesome/css/font-awesome.min.css app/fontawesome.css
	#cp -r bower_components/font-awesome/fonts/* app/fonts/
	rm -rf bower_components
	convert app/images/logo.png -resize 32x32 app/favicon.ico
	convert app/images/logo.png -resize 192x192 app/images/android-desktop.png
	convert app/images/logo.jpg -resize 120x120 app/images/ios-desktop.png
	convert app/images/logo.jpg -resize 144x144 app/images/ms-touch-icon-144x144-precomposed.png
crop:
	cd scripts;bash croper.sh
release:
	rm -rf release
	mkdir -p release
	cp -r ../static ../h.cp
	mv ../h.cp release/code
	make -C release/code distclean
	cd release;tar cvfz code.tar.gz code
	npm run build
	mv dist release/web
	cd release;tar cvfz web.tar.gz web
	npm run ipfs-build
	mv dist release/ipfs
	cd release;tar cvfz ipfs.tar.gz ipfs
	rm -rf release/web release/ipfs release/code
	tree release -f
