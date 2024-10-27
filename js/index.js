// ^ HTML
let mealsData = document.querySelector("#mealsData");
let searchInputs = document.querySelector("#searchInputs");

// ? Functions
function loadScreenFadeout() {
  $(".loading-screen").fadeOut(500);
}
function loadScreenFadeIn() {
  $(".loading-screen").fadeIn(500);
}

$(document).ready(async function loadScreen() {
  await getMealName("");
  loadScreenFadeout();
  $(document.body).removeClass("overflow-hidden");
});

// & Side Bar
function sideBar() {
  $(".side-bar").animate({
    left: `-${$(".side-bar .nav-tabs").outerWidth()}px`,
  });

  $(".side-bar i.open-icon").click(() => {
    let sidebBarWidth = $(".side-bar .nav-tabs").outerWidth();
    let sideBarLeft = $(".side-bar").css("left");
    let timer = 500;

    if (sideBarLeft === "0px") {
      $(".side-bar").animate({ left: `-${sidebBarWidth}px` }, timer);

      $(".side-bar i.open-icon").removeClass("fa-x");
      $(".side-bar i.open-icon").addClass("fa-align-justify");

      $(".nav-links li").animate({ top: "300px" }, timer);
    } else {
      $(".side-bar").animate({ left: 0 }, timer);

      $(".side-bar i.open-icon").removeClass("fa-align-justify");
      $(".side-bar i.open-icon").addClass("fa-x");

      $(".nav-links li").eq(0).animate({ top: 0 }, timer);
      $(".nav-links li")
        .eq(1)
        .animate({ top: 0 }, timer + 100);
      $(".nav-links li")
        .eq(2)
        .animate({ top: 0 }, timer + 200);
      $(".nav-links li")
        .eq(3)
        .animate({ top: 0 }, timer + 300);
      $(".nav-links li")
        .eq(4)
        .animate({ top: 0 }, timer + 400);
    }
  });
}
sideBar();

// & Close Bar inside
function closeBar() {
  $(".side-bar").animate({
    left: `-${$(".side-bar .nav-tabs").outerWidth()}px`,
  });
  $(".side-bar i.open-icon").removeClass("fa-x");
  $(".side-bar i.open-icon").addClass("fa-align-justify");
}

// ! API
// * Get Meal by Name
async function getMealName(qname) {
  $("#mealsData").fadeOut(500);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${qname}`
  );
  let apiData = await response.json();
  // console.log(apiData.meals);

  apiData.meals ? displayMeals(apiData.meals) : null;
  $("#mealsData").fadeIn(500);
}

async function getMealFirstLetter(q) {
  $("#mealsData").fadeOut(500);

  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${q ? q : "."}`
  );
  let apiData = await response.json();
  // console.log(apiData.meals);

  apiData.meals ? displayMeals(apiData.meals) : null;
  if (apiData.meals === null) {
    document.querySelector("#searchFirstLetter").classList.toggle("is-invalid");
  } else {
    document.querySelector("#searchFirstLetter").classList.remove("is-invalid");
  }
  $("#mealsData").fadeIn(500);
}
function displayMeals(mealList) {
  let mealHtml = "";

  for (let i = 0; i < mealList.length; i++) {
    mealHtml += `
          <div class="col-lg-3 col-md-6">
            <div onclick="getMealInstructions('${
              mealList[i].idMeal
            }')" class="meal meal-pointer rounded-2 position-relative overflow-hidden">
              <img class="w-100" src="${
                mealList[i].strMealThumb ? mealList[i].strMealThumb : null
              }" alt="${mealList[i].strMeal}">
                <div class="meal-overlay p-2 text-black position-absolute d-flex justify-content-start align-items-center">
                  <h3>${mealList[i].strMeal}</h3>
                </div>
            </div>
          </div>    
    `;
  }

  mealsData.innerHTML = mealHtml;
}

async function getMealInstructions(instId) {
  loadScreenFadeIn();
  closeBar();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${instId}`
  );
  let apiData = await response.json();
  // console.log(apiData.meals[0]);

  function displayMealsInstructions(inst) {
    let instHtml = "";
    let ingredientMeasure = ``;
    let instTags = ``;

    let instTagsArray = inst.strTags ? inst.strTags.split(",") : "";

    for (let i = 0; i < 20; i++) {
      inst[`strIngredient${i + 1}`]
        ? (ingredientMeasure += `<li class="alert alert-info m-2 p-2">${
            inst[`strMeasure${i + 1}`]
          } ${inst[`strIngredient${i + 1}`]}</li>`)
        : "";
    }
    for (let i = 0; i < instTagsArray.length; i++) {
      instTags += `<li class="alert alert-danger m-2 p-2">${instTagsArray[i]}</li>`;
    }

    instHtml += `
               <div class="col-lg-4">
                  <img class="w-100 rounded-3" src="${inst.strMealThumb}"
                      alt="${inst.strMeal}">
                  <h2 class="mt-2">${inst.strMeal}</h2>
               </div>
               <div class="col-lg-8">
                  <h2>Instructions</h2>
                  <p>${inst.strInstructions}</p>
                  <h3><span>Area :</span> ${inst.strArea}</h3>
                  <h3><span>Category :</span> ${inst.strCategory}</h3>
                  <h3>Recipes :</h3>
                  <ul class="list-unstyled d-flex flex-wrap">
                      ${ingredientMeasure}
                  </ul>
                  <h3>Tags :</h3>
                  <ul class="list-unstyled d-flex flex-wrap">
                      ${
                        instTags
                          ? instTags
                          : `<li class="alert alert-secondary m-2 p-2">No Tags</li>`
                      }
                  </ul>
                  <a target="_blank" href="${
                    inst.strSource
                  }" class="btn btn-success m-1">Source</a>
                  <a target="_blank" href="${
                    inst.strYoutube
                  }" class="btn btn-danger m-1">YouTube</a>
               </div>  
    `;

    mealsData.innerHTML = instHtml;
  }

  displayMealsInstructions(apiData.meals[0]);
  searchInputs.innerHTML = "";
  loadScreenFadeout();
}
// ***************************************

// *  Search
function displaySearchInput() {
  loadScreenFadeIn();
  closeBar();
  let searchHtml = "";

  searchHtml += `
            <div class="col-md-6">
              <input id="searchByNamee" onkeyup="getMealName(this.value)" class="form-control text-white bg-transparent" type="search" placeholder="Search By Name">
            </div>
            <div class="col-md-6">
              <input id="searchFirstLetter" onkeyup="getMealFirstLetter(this.value)" class="form-control text-white bg-transparent" type="search" maxlength="1" placeholder="Search By First Letter">
            </div> 
`;

  searchInputs.innerHTML = searchHtml;
  mealsData.innerHTML = "";
  loadScreenFadeout();
}
// *******************************

// * Get Meal by Categories
async function getMealCategories() {
  loadScreenFadeIn();
  closeBar();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  let apiData = await response.json();
  // console.log(apiData.categories);

  function displayMealsCategories(mealList) {
    let mealHtml = "";

    for (let i = 0; i < mealList.length; i++) {
      mealHtml += `
            <div class="col-lg-3 col-md-6">
              <div onclick="getMealsInCategories('${mealList[i].strCategory}')"
              class="meal meal-pointer rounded-2 position-relative overflow-hidden">
                <img class="w-100" src="${mealList[i].strCategoryThumb}" alt="${
        mealList[i].strCategory
      }">
                  <div class="meal-overlay p-2 text-black position-absolute text-center">
                    <h3>${mealList[i].strCategory}</h3>
                    <p>${
                      mealList[i].strCategoryDescription.split(".")[0] + "."
                    }</p>
                  </div>
              </div>
            </div>    
      `;
    }

    mealsData.innerHTML = mealHtml;
  }

  displayMealsCategories(apiData.categories);
  loadScreenFadeout();

  searchInputs.innerHTML = "";
}

async function getMealsInCategories(qcategory) {
  loadScreenFadeIn();
  closeBar();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${qcategory}`
  );
  let apiData = await response.json();
  // console.log(apiData);

  displayMeals(apiData.meals);
  loadScreenFadeout();
}
// * *********************************

// * Get Meal by Area
async function getMealArea() {
  loadScreenFadeIn();
  closeBar();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  let apiData = await response.json();
  // console.log(apiData.meals);

  function displayMealsArea(areaList) {
    let areaHtml = "";

    for (let i = 0; i < areaList.length; i++) {
      areaHtml += `
            <div class="col-lg-3 col-md-6">
              <div onclick="getMealsInAreas('${areaList[i].strArea}')" class="meal-pointer rounded-2 text-center">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${areaList[i].strArea}</h3>
              </div>
            </div>    
      `;
    }

    mealsData.innerHTML = areaHtml;
  }

  displayMealsArea(apiData.meals);
  searchInputs.innerHTML = "";
  loadScreenFadeout();
}

async function getMealsInAreas(qarea) {
  loadScreenFadeIn();
  closeBar();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${qarea}`
  );
  let apiData = await response.json();
  // console.log(apiData);

  displayMeals(apiData.meals);
  loadScreenFadeout();
}
// * **************************************

// * Get Meal by Ingredients
async function getMealIngredients() {
  loadScreenFadeIn();
  closeBar();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  let apiData = await response.json();
  // console.log(apiData.meals);

  function displayMealsIngredients(ingredientList) {
    let ingredientHtml = "";

    for (let i = 0; i < ingredientList.length; i++) {
      ingredientHtml += `
            <div class="col-lg-3 col-md-6">
              <div onclick="getMealsInIngredients('${
                ingredientList[i].strIngredient
              }')" class="meal-pointer rounded-2 text-center">
                <i class="fa-solid fa-utensils fa-4x"></i>
                <h3>${ingredientList[i].strIngredient}</h3>
                <p>${
                  ingredientList[i].strDescription
                    ? ingredientList[i].strDescription.split(".")[0] + "."
                    : "Undefined Description"
                }</p>
              </div>
            </div>    
      `;
    }

    mealsData.innerHTML = ingredientHtml;
    searchInputs.innerHTML = "";
  }

  displayMealsIngredients(apiData.meals);
  loadScreenFadeout();
}

async function getMealsInIngredients(qingredient) {
  loadScreenFadeIn();
  closeBar();
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${qingredient}`
  );
  let apiData = await response.json();
  // console.log(apiData);

  displayMeals(apiData.meals);
  loadScreenFadeout();
}

// * Contact us
function displayContactUs() {
  loadScreenFadeIn();
  closeBar();

  let contHtml = ``;

  contHtml += `
  <div class="contact d-flex justify-content-center align-items-center mt-5 pt-5">
                <div class="container w-75 text-center">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <input id="nameInput" onkeyup="validationAllContactInputs()" class="form-control"
                                type="text" placeholder="Enter Your Name">
                            <div id="nameAlert" class="alert alert-danger w-100 mt-1 d-none">
                                Write a valid first and last name. No special character and numbers.
                                example: Ahmed Mohamed
                            </div>
                        </div>
                        <div class="col-md-6">
                            <input id="emailInput" onkeyup="validationAllContactInputs()" class="form-control"
                                type="email" placeholder="Enter Your Email">
                            <div id="emailAlert" class="alert alert-danger w-100 mt-1 d-none">
                                Write a valid email.
                                example: admin@admin.com
                            </div>
                        </div>
                        <div class="col-md-6">
                            <input id="phoneInput" onkeyup="validationAllContactInputs()" class="form-control"
                                type="tel" placeholder="Enter Your Phone">
                            <div id="phoneAlert" class="alert alert-danger w-100 mt-1 d-none">
                                Write a valid phone number.
                                example: 01234567890
                            </div>
                        </div>
                        <div class="col-md-6">
                            <input id="ageInput" onkeyup="validationAllContactInputs()" class="form-control"
                                type="number" placeholder="Enter Your Age">
                            <div id="ageAlert" class="alert alert-danger w-100 mt-1 d-none">
                                age between 16 and 100.
                            </div>
                        </div>
                        <div class="col-md-6">
                            <input id="passwordInput" onkeyup="validationAllContactInputs()" class="form-control"
                                type="password" placeholder="Write Your Password">
                            <div id="passwordAlert" class="alert alert-danger w-100 mt-1 d-none">
                                enter valid password *Minimum eight characters, at least one letter and one number.
                            </div>
                        </div>
                        <div class="col-md-6">
                            <input id="repasswordInput" onkeyup="validationAllContactInputs()" class="form-control"
                                type="password" placeholder="Rewrite Your Password">
                            <div id="repasswordAlert" class="alert alert-danger w-100 mt-1 d-none">
                                wrong password try again.
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-outline-danger subbtn mt-3 p-2" disabled>Submit</button>
                </div>
            </div> 
  `;

  mealsData.innerHTML = contHtml;
  loadScreenFadeout();
  document.querySelector(".btn.btn-outline-danger.subbtn");
}

function validationAllContactInputs() {
  nameValidation()
    ? document
        .querySelector("#nameAlert")
        .classList.replace("d-block is-valid", "d-none")
    : document
        .querySelector("#nameAlert")
        .classList.replace("d-none", "d-block");

  emailValidation()
    ? document
        .querySelector("#emailAlert")
        .classList.replace("d-block", "d-none")
    : document
        .querySelector("#emailAlert")
        .classList.replace("d-none", "d-block");

  phoneValidation()
    ? document
        .querySelector("#phoneAlert")
        .classList.replace("d-block", "d-none")
    : document
        .querySelector("#phoneAlert")
        .classList.replace("d-none", "d-block");

  ageValidation()
    ? document.querySelector("#ageAlert").classList.replace("d-block", "d-none")
    : document
        .querySelector("#ageAlert")
        .classList.replace("d-none", "d-block");

  passwordValidation()
    ? document
        .querySelector("#passwordAlert")
        .classList.replace("d-block", "d-none")
    : document
        .querySelector("#passwordAlert")
        .classList.replace("d-none", "d-block");

  repasswordValidation()
    ? document
        .querySelector("#repasswordAlert")
        .classList.replace("d-block", "d-none")
    : document
        .querySelector("#repasswordAlert")
        .classList.replace("d-none", "d-block");

  if (
    nameValidation() &&
    emailValidation() &&
    phoneValidation() &&
    ageValidation() &&
    passwordValidation() &&
    repasswordValidation()
  ) {
    document
      .querySelector(".btn.btn-outline-danger.subbtn")
      .removeAttribute("disabled");
  } else {
    document
      .querySelector(".btn.btn-outline-danger.subbtn")
      .setAttribute("disabled", true);
  }
}

function nameValidation() {
  const nameInput = document.querySelector("#nameInput");
  const nameRegex =
    /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)/;

  return nameRegex.test(nameInput.value);
}
function emailValidation() {
  const emailInput = document.querySelector("#emailInput");
  const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;

  return emailRegex.test(emailInput.value);
}
function phoneValidation() {
  const phoneInput = document.querySelector("#phoneInput");
  const phoneRegex =
    /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

  return phoneRegex.test(phoneInput.value);
}
function ageValidation() {
  const ageInput = document.querySelector("#ageInput");
  const ageRegex = /^(1[6-9]|[2-9][0-9]|100)$/;

  return ageRegex.test(ageInput.value);
}
function passwordValidation() {
  const passwordInput = document.querySelector("#passwordInput");
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  return passwordRegex.test(passwordInput.value);
}
function repasswordValidation() {
  const repasswordInput = document.querySelector("#repasswordInput");

  return (
    repasswordInput.value === document.querySelector("#passwordInput").value
  );
}
