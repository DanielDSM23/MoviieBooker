

const user =  {
    surname: "Dupont",
    name: "Jean",
    email: "jean.dupont@example.com"
}

generateToken = (user) => btoa(user);


verifyToken = (token) => atob(token)

console.log(generateToken(user));

console.log(verifyToken(generateToken(user)))


