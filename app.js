document.addEventListener("DOMContentLoaded", () => {
    const brothOptionsContainer = document.getElementById("broth-options");
    const proteinOptionsContainer = document.getElementById("protein-options");
    const placeOrderButton = document.getElementById("place-order");
    const orderStatusContainer = document.getElementById("order-status");
    const successScreen = document.getElementById("success-section");
    const orderImage = document.getElementById("success-image");
    const orderDescription = document.getElementById("order-details");
    const header = document.querySelector("header");
    const main = document.querySelector("main");
    const orderButton = document.querySelector(".order-button");
    const newOrderButton = document.getElementById("new-order-button");
    const brothDots = document.getElementById("broth-dots");
    const proteinDots = document.getElementById("protein-dots");

    let selectedBroth = null;
    let selectedProtein = null;

    async function loadOptionsFromAPI(endpoint, container, type) {
        try {
            const response = await fetch(endpoint, {
                headers: { 'x-api-key': 'ZtVdh8XQ2U8pWI2gmZ7f796Vh8GllXoN7mr0djNf' }
            });
            const data = await response.json();
            loadOptions(data, container, type);
            createDots(container, type === 'broth' ? brothDots : proteinDots);
            updateDots(container, type === 'broth' ? brothDots : proteinDots);
        } catch (error) {
            console.error(`Error loading ${type} options:`, error);
        }
    }

    function createOptionElement(item, type) {
        const option = document.createElement("div");
        option.classList.add("option");
        option.innerHTML = `
            <img src="${item.imageInactive}" alt="${item.name}" />
            <p>${item.name}</p>
            <p>${item.description}</p>
            <p>US$ ${item.price}</p>
        `;
        option.addEventListener("click", () => {
            document.querySelectorAll(`#${type}-options .option`).forEach((el) => {
                el.classList.remove("selected");
                el.querySelector("img").src = el.dataset.imageInactive;
            });

            option.classList.add("selected");
            option.querySelector("img").src = item.imageActive;
            if (type === "broth") {
                selectedBroth = item.id;
            } else {
                selectedProtein = item.id;
            }
            updateButtonState();
        });

        option.dataset.imageInactive = item.imageInactive;
        option.dataset.imageActive = item.imageActive;
        return option;
    }

    function updateButtonState() {
        placeOrderButton.disabled = !(selectedBroth && selectedProtein);
    }

    function loadOptions(data, container, type) {
        data.forEach((item) => {
            const optionElement = createOptionElement(item, type);
            container.appendChild(optionElement);
        });
    }

    async function placeOrder() {
        try {
            const response = await fetch("https://api.tech.redventures.com.br/orders", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'ZtVdh8XQ2U8pWI2gmZ7f796Vh8GllXoN7mr0djNf'
                },
                body: JSON.stringify({
                    brothId: selectedBroth,
                    proteinId: selectedProtein
                })
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            showSuccessScreen(data.image, data.description);
        } catch (error) {
            console.error("Error placing order:", error);
            orderStatusContainer.innerHTML = "<p>There was an error placing your order. Please try again.</p>";
        }
    }

    function showSuccessScreen(image, description) {
        orderImage.src = image;
        orderDescription.textContent = description;
        header.classList.add("hidden");
        main.classList.add("hidden");
        successScreen.classList.remove("hidden");
        successScreen.style.display = "flex";
        successScreen.scrollIntoView({ behavior: "smooth" });
    }

    function startNewOrder() {
        header.classList.remove("hidden");
        main.classList.remove("hidden");
        successScreen.classList.add("hidden");
        successScreen.style.display = "none";
        selectedBroth = null;
        selectedProtein = null;
        updateButtonState();
        document.querySelectorAll(".option").forEach((el) => {
            el.classList.remove("selected");
            el.querySelector("img").src = el.dataset.imageInactive;
        });
        header.scrollIntoView({ behavior: "smooth" });
    }

    loadOptionsFromAPI("https://api.tech.redventures.com.br/broths", brothOptionsContainer, "broth");
    loadOptionsFromAPI("https://api.tech.redventures.com.br/proteins", proteinOptionsContainer, "protein");

    placeOrderButton.addEventListener("click", placeOrder);
    newOrderButton.addEventListener("click", startNewOrder);
    orderButton.addEventListener("click", (e) => {
        e.preventDefault();
        document.querySelector("main").scrollIntoView({ behavior: "smooth" });
    });

    function createDots(carousel, dotsContainer) {
        dotsContainer.innerHTML = '';
        const items = carousel.children;
        for (let i = 0; i < items.length; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                carousel.scrollTo({ left: items[i].offsetLeft, behavior: 'smooth' });
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots(carousel, dotsContainer) {
        const items = carousel.children;
        carousel.addEventListener('scroll', () => {
            let index = Math.round(carousel.scrollLeft / items[0].offsetWidth);
            dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        });
    }
});
