
const API_URL = 'http://localhost:3000/products';

const productList = document.querySelector('#products');
const addProductForm = document.querySelector('#add-product-form');
const updateProductForm = document.querySelector('#update-product-form');
const searchProductForm = document.querySelector('#search-product-form');

// Buscar todos os produtos
async function fetchProducts() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Erro ao buscar produtos');
    }

    const products = await response.json();

    productList.innerHTML = '';

    products.forEach(product => {
      const li = document.createElement('li');

      const info = document.createElement('div');

      const name = document.createElement('strong');
      name.textContent = product.name;

      const price = document.createElement('p');
      price.textContent = `Price: R$ ${product.price}`;

      const description = document.createElement('p');
      description.textContent = `Description: ${product.description || ''}`;

      const id = document.createElement('p');
      id.textContent = `ID: ${product.id}`;

      info.append(name, price, description, id);

      // Botão Delete
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete-button';

      deleteButton.addEventListener('click', async () => {
        await deleteProduct(product.id);
      });

      // Botão Update
      const updateButton = document.createElement('button');
      updateButton.textContent = 'Update';
      updateButton.className = 'update-button';

      updateButton.addEventListener('click', () => {
        document.querySelector('#update-id').value = product.id;
        document.querySelector('#update-name').value = product.name;
        document.querySelector('#update-price').value = product.price;
        document.querySelector('#update-description').value =
          product.description || '';

        document.querySelector('#update-product-form').scrollIntoView({
          behavior: 'smooth'
        });
      });

      li.append(info, deleteButton, updateButton);
      productList.appendChild(li);
    });

  } catch (error) {
    alert(error.message);
  }
}

// Adicionar produto
addProductForm.addEventListener('submit', async event => {
  event.preventDefault();

  const name = document.querySelector('#name').value;
  const price = document.querySelector('#price').value;
  const description = document.querySelector('#description').value;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        price: Number(price),
        description
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao cadastrar produto');
    }

    alert('Produto cadastrado com sucesso!');

    addProductForm.reset();
    await fetchProducts();

  } catch (error) {
    alert(error.message);
  }
});

// Atualizar produto
updateProductForm.addEventListener('submit', async event => {
  event.preventDefault();

  const id = document.querySelector('#update-id').value;
  const name = document.querySelector('#update-name').value;
  const price = document.querySelector('#update-price').value;
  const description = document.querySelector('#update-description').value;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        price: Number(price),
        description
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar produto');
    }

    alert('Produto atualizado com sucesso!');

    updateProductForm.reset();
    await fetchProducts();

  } catch (error) {
    alert(error.message);
  }
});

// Excluir produto
async function deleteProduct(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      throw new Error('Erro ao excluir produto');
    }

    alert('Produto excluído com sucesso!');
    await fetchProducts();

  } catch (error) {
    alert(error.message);
  }
}

// Consultar produto pelo ID
searchProductForm.addEventListener('submit', async event => {
  event.preventDefault();

  const id = document.querySelector('#search-id').value;
  const result = document.querySelector('#search-result');

  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (response.status === 404) {
      result.textContent = 'Produto não encontrado!';
      return;
    }

    if (!response.ok) {
      throw new Error('Erro ao consultar produto');
    }

    const product = await response.json();

    result.innerHTML = '';

    const name = document.createElement('p');
    name.textContent = `Name: ${product.name}`;

    const price = document.createElement('p');
    price.textContent = `Price: R$ ${product.price}`;

    const description = document.createElement('p');
    description.textContent = `Description: ${product.description || ''}`;

    const productId = document.createElement('p');
    productId.textContent = `ID: ${product.id}`;

    result.append(name, price, description, productId);

  } catch (error) {
    result.textContent = error.message;
  }
});

// Carregar produtos ao abrir a página
fetchProducts();
