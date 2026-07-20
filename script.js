const exploreButton =
  document.getElementById("exploreButton");

const categorySection =
  document.getElementById("categories");


exploreButton.addEventListener("click", () => {

  categorySection.scrollIntoView({
    behavior: "smooth"
  });

});