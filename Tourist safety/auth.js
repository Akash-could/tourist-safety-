function register() {
    let user = document.getElementById("regUser").value;
    let pass = document.getElementById("regPass").value;

    if (!user || !pass) {
        alert("Fill all fields");
        return;
    }

    localStorage.setItem(user, pass);
    alert("Registered!");
    window.location.href = "login.html";
}

function login() {
    let user = document.getElementById("loginUser").value;
    let pass = document.getElementById("loginPass").value;

    let stored = localStorage.getItem(user);

    if (stored === pass) {
        alert("Login successful!");
        window.location.href = "index.html";
    } else {
        alert("Invalid credentials");
    }
}