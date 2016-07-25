//Main Script
/* jshint ignore:start */
global=window;
/* jshint ignore:end */
global.isIPFS=window.location.href.split("/")[3];
global.isIPFS=(isIPFS=="ipfs"||isIPFS=="ipns")
if (isIPFS) {
  //global.baseUri=window.location.href.split("/").slice(0,3).join("/");
  global.fullUrl=window.location.href.split("/").slice(0,5).join("/");
  global.baseUri="/"+window.location.href.split("/").slice(3,5).join("/");
} else {
  global.fullUrl=window.location.href.split("/").slice(0,3).join("/");
  global.baseUri="/";
}
if (isIPFS) page.base(global.baseUri+"/");

$(".page").addClass("pageoff");

function showPage(page) {
  $(".pageon").removeClass("pageon").addClass("pageoff");
  $(".page-"+page).removeClass("pageoff").addClass("pageon").hide().fadeIn("fast");
}

function addRoute(p,p2) {
  page(isIPFS?p:"/"+p,function() {
    showPage(p2);
  });
}

page("",function() {
  showPage("home");
});

page("/",function() {
  showPage("home");
});

addRoute("Kontakt","contact");
addRoute("Impressum","about");

/*page("/Kontakt",function() {
  showPage("contact");
});

page("/Impressum",function() {
  showPage("about");
});*/

page("*",function() {
  showPage("404");
});

page({
  hashbang: isIPFS
});
