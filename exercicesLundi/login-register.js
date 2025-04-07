

const user =  {
    surname: "Dupont",
    name: "Jean",
    email: "jean.dupont@example.com"
}

generateToken = (user) => btoa(user);


verifyToken = (token) => atob(token)

console.log(generateToken(user));

console.log(verifyToken(generateToken(user)))


const articles = [
    { id: 1, title: "Clavier mécanique", price: 89.99, category: "Informatique", inStock: true },
    { id: 2, title: "Écouteurs Bluetooth", price: 49.99, category: "Audio", inStock: false },
    { id: 3, title: "Écran 27 pouces", price: 199.99, category: "Informatique", inStock: true },
    { id: 4, title: "Chargeur rapide", price: 19.99, category: "Accessoires", inStock: true },
    { id: 5, title: "Casque gaming", price: 79.99, category: "Audio", inStock: false },
];

function filterByPrice(articles, prixMin) {
    return articles.filter(article => article.price >= prixMin);
}

function filtrerByStock(articles) {
    return articles.filter(article => article.inStock === true);
}


console.log(filterByPrice(articles,79));
console.log(filtrerByStock(articles))