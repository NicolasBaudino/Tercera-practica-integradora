const socket = io();

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    
    const product = {
        title: formData.get("title"),
        description: formData.get("description"),
        price: formData.get("price"),
        thumbnails: formData.get("thumbnails"),
        code: formData.get("code"),
        stock: formData.get("stock")
    }

    socket.emit("product_send", product);
    form.reset();
});

socket.on("products", (data) => {
    const products = document.querySelector("#products");
    products.innerHTML = "";

    data.forEach(product => {
        console.log(product);
        products.innerHTML += `Id: ${product.id} - Title: ${product.title} - Description: ${product.description} - Price: ${product.price} - Thumbnail: ${product.thumbnail} - Code: ${product.code} - Stock: ${product.stock} - <button class="delete"> Delete </button> <br>`;
    });
});
