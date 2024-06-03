document.addEventListener("DOMContentLoaded", () => {
  const brothOptionsContainer = document.getElementById("broth-options");
  const proteinOptionsContainer = document.getElementById("protein-options");
  const placeOrderButton = document.getElementById("place-order");
  const orderStatusContainer = document.getElementById("order-status");

  let selectedBroth = null;
  let selectedProtein = null;

  // Função para criar os elementos de opção
  function createOptionElement(item, type) {
    const option = document.createElement("div");
    option.classList.add("option");
    option.innerHTML = `
            <img src="${item.imageInactive}" alt="${item.name}" />
            <p>${item.name}</p>
        `;
    option.addEventListener("click", () => {
      document
        .querySelectorAll(`#${type}-options .option`)
        .forEach((el) => el.classList.remove("selected"));
      option.classList.add("selected");
      if (type === "broth") {
        selectedBroth = item.id;
      } else {
        selectedProtein = item.id;
      }
      updateButtonState();
    });
    return option;
  }

  // Função para atualizar o estado do botão
  function updateButtonState() {
    placeOrderButton.disabled = !(selectedBroth && selectedProtein);
  }

  // Função para buscar as opções da API
  async function fetchOptions(endpoint, container, type) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          "x-api-key": "ZtVdh8XQ2U8pWI2gmZ7f796Vh8GllXoN7mr0djNf",
        },
      });
      const data = await response.json();
      data.forEach((item) => {
        const optionElement = createOptionElement(item, type);
        container.appendChild(optionElement);
      });
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  }

  // Função para fazer o pedido
  async function placeOrder() {
    try {
      const response = await fetch(
        "https://api.tech.redventures.com.br/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "ZtVdh8XQ2U8pWI2gmZ7f796Vh8GllXoN7mr0djNf",
          },
          body: JSON.stringify({
            brothId: selectedBroth,
            proteinId: selectedProtein,
          }),
        }
      );
      const data = await response.json();
      orderStatusContainer.innerHTML = `<p>Your order for ${data.broth.name} broth with ${data.protein.name} has been placed successfully!</p>`;
    } catch (error) {
      console.error("Error placing order:", error);
      orderStatusContainer.innerHTML =
        "<p>There was an error placing your order. Please try again.</p>";
    }
  }

  // Buscar as opções de broth e protein na inicialização
  fetchOptions(
    "https://api.tech.redventures.com.br/broths",
    brothOptionsContainer,
    "broth"
  );
  fetchOptions(
    "https://api.tech.redventures.com.br/proteins",
    proteinOptionsContainer,
    "protein"
  );

  // Adicionar o event listener ao botão de pedido
  placeOrderButton.addEventListener("click", placeOrder);
});
