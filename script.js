const productContainer = document.querySelector(".product-list")
const isProductDetailPage = document.querySelector(".product-detail")

if (productContainer) {
    displayProducts()
} else if (isProductDetailPage) {
    displayProductsDetail()
}

function displayProducts() {
    products.forEach(product => {
        const productCard = document.createElement("div")
        productCard.classList.add("product-card")
        productCard.innerHTML = `
            <div class = "img-box">
                <img src="${product.colors[0].mainImage}">
            </div>
            <h2 class="title">${product.title}</h2>
            <span class="price">${product.price}</span>
        `;
        productContainer.appendChild(productCard);

        const imgBox = productCard.querySelector(".img-box")
        imgBox.addEventListener("click", () => {
            sessionStorage.setItem("selectedProduct", JSON.stringify(product))
            window.location.href = "product-detail.html"
        })
    })
}

function displayProductsDetail() {
    const productData = JSON.parse(sessionStorage.getItem("selectedProduct"))
    const titleEl = document.querySelector(".title")
    const priceEl = document.querySelector(".price")
    const descriptionEl = document.querySelector(".description")
    const mainImageCointainer = document.querySelector(".main-img")
    const thumbBnailCointainer = document.querySelector(".thumbnail-list")
    const colorCointainer = document.querySelector(".color-options")
    const sizeCointainer = document.querySelector(".size-options")
    const addToCartBtn = document.querySelector("#add-cart-btn")

    let selectedColor = productData.colors[0]
    let selectedSize = selectedColor.sizes[0]
    function UpdateProductDisplay(colorData) {
        if (!colorData.sizes.includes(selectedSize)) {
            selectedSize = colorData.sizes[0]
        }

        mainImageCointainer.innerHTML = `<img src="${colorData.mainImage}">`

        thumbBnailCointainer.innerHTML = ""
        const allThumbnails = [colorData.mainImage].concat(colorData.thumbnails.slice(0, 3));
        allThumbnails.forEach(thumb => {
            const img = document.createElement("img")
            img.src = thumb

            thumbBnailCointainer.appendChild(img)

            img.addEventListener("click", () => {
                mainImageCointainer.innerHTML = `<img src="${thumb}">`
            })
        })
        colorCointainer.innerHTML = "";
        productData.colors.forEach(color => {
            const img = document.createElement("img")
            img.src = color.mainImage
            if (color.name === colorData.name) img.classList.add("selected")

            colorCointainer.appendChild(img)

            img.addEventListener("click", () => {
                selectedColor = color
                UpdateProductDisplay(color)
            })
        })

        // 
        sizeCointainer.innerHTML = "";

        colorData.sizes.forEach(size => {
            const btn = document.createElement("button");
            btn.textContent = size;

            if (size === selectedSize) {
                btn.classList.add("selected");
            }

            sizeCointainer.appendChild(btn);

            btn.addEventListener("click", () => {
                document.querySelectorAll(".size-options button").forEach(el =>
                    el.classList.remove("selected")
                );
                btn.classList.add("selected");
                selectedSize = size;
            });
        });

    }
    titleEl.textContent = productData.title
    priceEl.textContent = productData.price
    descriptionEl.textContent = productData.description

    UpdateProductDisplay(selectedColor)

    addToCartBtn.addEventListener("click", () => {
        addToCart(productData, selectedColor, selectedSize)
    })
}


function addToCart(product, color, size) {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

    const existingItem = cart.find(item =>
        item.id === product.id &&
        item.color === color.name &&
        item.size === size
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: color.mainImage,
            color: color.name,
            size: size,
            quantity: 1
        });
    }

    sessionStorage.setItem("cart", JSON.stringify(cart));
}
