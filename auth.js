const loginForm =
document.getElementById("loginForm");

if(loginForm){

    loginForm.addEventListener(
    "submit",
    function(e){

        e.preventDefault();

        alert("Login successful!");

        const userType =
localStorage.getItem("userType");

if(userType === "farmer"){
    window.location.href =
    "farmer-dashboard.html";
}
else{
    window.location.href =
    "buyer-dashboard.html";
}

    });

}