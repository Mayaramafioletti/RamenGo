document.addEventListener("DOMContentLoaded", () => {
  const brothOptionsContainer = document.getElementById("broth-options");
  const proteinOptionsContainer = document.getElementById("protein-options");
  const placeOrderButton = document.getElementById("place-order");
  const orderStatusContainer = document.getElementById("order-status");
  const successScreen = document.getElementById("success-section");
  const orderImage = document.getElementById("success-image");
  const orderDescription = document.getElementById("order-details");
  const newOrderButton = document.getElementById("new-order-button");
  const header = document.querySelector("header");
  const main = document.querySelector("main");
  const orderButton = document.querySelector(".order-button");

  let selectedBroth = null;
  let selectedProtein = null;

  const broths = [
    {
      id: "1",
      imageInactive: "https://tech.redventures.com.br/icons/salt/inactive.svg",
      imageActive: "https://tech.redventures.com.br/icons/salt/active.svg",
      name: "Salt",
      description: "Simple like the seawater, nothing more",
      price: 10,
    },
    {
      id: "2",
      imageInactive: "https://tech.redventures.com.br/icons/shoyu/inactive.svg",
      imageActive: "https://tech.redventures.com.br/icons/shoyu/active.svg",
      name: "Shoyu",
      description: "The good old and traditional soy sauce",
      price: 10,
    },
    {
      id: "3",
      imageInactive: "https://tech.redventures.com.br/icons/miso/inactive.svg",
      imageActive: "https://tech.redventures.com.br/icons/miso/active.svg",
      name: "Miso",
      description: "Paste made of fermented soybeans",
      price: 12,
    },
  ];

  const proteins = [
    {
      id: "1",
      imageInactive: "https://tech.redventures.com.br/icons/pork/inactive.svg",
      imageActive: "https://tech.redventures.com.br/icons/pork/active.svg",
      name: "Chasu",
      description:
        "A sliced flavourful pork meat with a selection of season vegetables.",
      price: 10,
    },
    {
      id: "2",
      imageInactive: "https://tech.redventures.com.br/icons/yasai/inactive.svg",
      imageActive: "https://tech.redventures.com.br/icons/yasai/active.svg",
      name: "Yasai Vegetarian",
      description:
        "A delicious vegetarian lamen with a selection of season vegetables.",
      price: 10,
    },
    {
      id: "3",
      imageInactive:
        "https://tech.redventures.com.br/icons/chicken/inactive.svg",
      imageActive: "https://tech.redventures.com.br/icons/chicken/active.svg",
      name: "Karaague",
      description:
        "Three units of fried chicken, moyashi, ajitama egg and other vegetables.",
      price: 12,
    },
  ];

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
      // Simulando a colocação bem-sucedida do pedido
      const data = {
        image: "https://tech.redventures.com.br/ramen-success.png", // Imagem mock
        description: `Broth: ${selectedBroth}, Protein: ${selectedProtein}`,
      };
      showSuccessScreen(data.image, data.description);
    } catch (error) {
      console.error("Error placing order:", error);
      orderStatusContainer.innerHTML =
        "<p>There was an error placing your order. Please try again.</p>";
    }
  }

  function showSuccessScreen(image, description) {
    orderImage.src = image;
    orderDescription.textContent = description;
    header.classList.add("hidden");
    main.classList.add("hidden");
    successScreen.classList.remove("hidden");
    successScreen.style.display = "flex"; // Garantir que seja exibido
  }

  function startNewOrder() {
    header.classList.remove("hidden");
    main.classList.remove("hidden");
    successScreen.classList.add("hidden");
    successScreen.style.display = "none"; // Ocultar novamente

    // Resetar seleção e estado do botão
    selectedBroth = null;
    selectedProtein = null;
    updateButtonState();

    // Limpar seleções visuais
    document.querySelectorAll(".option").forEach((el) => {
      el.classList.remove("selected");
      el.querySelector("img").src = el.dataset.imageInactive;
    });
  }

  loadOptions(broths, brothOptionsContainer, "broth");
  loadOptions(proteins, proteinOptionsContainer, "protein");

  placeOrderButton.addEventListener("click", placeOrder);
  newOrderButton.addEventListener("click", startNewOrder);

  // Smooth scroll to main section on "ORDER NOW" click
  orderButton.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelector("main").scrollIntoView({
      behavior: "smooth",
    });
  });
});
