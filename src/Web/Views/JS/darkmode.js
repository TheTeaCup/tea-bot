function toggleDarkMode() {
  var theme = $("#cssproto").attr("href");
  if (theme == "") {
    localStorage.setItem("theme", "dark");
    $("#cssproto").attr("href", "/css/dark_index.css");
    $("#nav-coco").attr("style", "color:#fff");
    $("#nav-coc").attr("style", "color:#fff");
    $("#nav-co").attr("style", "color:#fff");
    $("#nav-c").attr("style", "color:#fff");
    $("#nav-cho").attr("style", "color:#fff");
    $("#nav-choco").attr("style", "color:#fff");
    $("#nav-io").attr("style", "color:#fff");

    console.log(`New theme is:  ${localStorage.getItem("theme")}`);
  }
  if (theme == "/css/light_index.css") {
    localStorage.setItem("theme", "dark");
    $("#cssproto").attr("href", "/css/dark_index.css");
    $("#nav-coco").attr("style", "color:#fff");
    $("#nav-coc").attr("style", "color:#fff");
    $("#nav-co").attr("style", "color:#fff");
    $("#nav-c").attr("style", "color:#fff");
    $("#nav-cho").attr("style", "color:#fff");
    $("#nav-choco").attr("style", "color:#fff");
    $("#nav-io").attr("style", "color:#fff");

    console.log(`New theme is:  ${localStorage.getItem("theme")}`);
  }
  if (theme == "/css/dark_index.css") {
    localStorage.setItem("theme", "light");
    $("#cssproto").attr("href", "/css/light_index.css");

    console.log(`New theme is:  ${localStorage.getItem("theme")}`);
  }
}
$(document).ready(function() {
  var theme = localStorage.getItem("theme");
  if (theme == "") {
    localStorage.setItem("theme", "light");
    console.log(`Could not find a theme. Defaulted to white.`);
  }
  if (theme == "light") {
    $("#cssproto").attr("href", "/css/light_index.css");
    console.log(`Theme is:  ${localStorage.getItem("theme")}`);
  }
  if (theme == "dark") {
    $("#cssproto").attr("href", "/css/dark_index.css");
    $(".dn").prop("checked", "checked");
    $("#nav-coco").attr("style", "color:#fff");
    $("#nav-coc").attr("style", "color:#fff");
    $("#nav-co").attr("style", "color:#fff");
    $("#nav-c").attr("style", "color:#fff");
    $("#nav-cho").attr("style", "color:#fff");
    $("#nav-choco").attr("style", "color:#fff");
    $("#nav-io").attr("style", "color:#fff");

    console.log(`Theme is:  ${localStorage.getItem("theme")}`);
  }
});
