Array.prototype.forEach.call(document.querySelectorAll('.mdl-card__media'), function(el) {
  var link = el.querySelector('a');
  if(!link) {
    return;
  }
  var target = link.getAttribute('href');
  if(!target) {
    return;
  }
  el.addEventListener('click', function() {
    location.href = target;
  });
});
function get(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}
function openInIPFS() {
  get("./IPFS-URL",function(url) {
    if (url.startsWith("http://ipfs.io")) window.location.href=url; else console.error("Not a valid IPFS URL starts with "+url.substr(0,10));
  });
}
