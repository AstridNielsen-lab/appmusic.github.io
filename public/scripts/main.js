async function submitForm() {
    const bandInput = document.getElementById('bandInput').value;
  
    // Enviar a lista de bandas para o servidor
    try {
      const response = await fetch(`/api/recommendations?bands=${encodeURIComponent(bandInput)}`);
      const data = await response.json();
      displayResults(data);
    } catch (error) {
      console.error('Erro ao buscar recomendações:', error);
    }
  }
  
  function displayResults(results) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';
  
    // Exibir os resultados na página
    results.forEach(result => {
      const resultElement = document.createElement('div');
      resultElement.innerHTML = `
        <p><strong>Nome:</strong> ${result.name}</p>
        <p><strong>Gêneros:</strong> ${result.genres.join(', ')}</p>
        <p><strong>Popularidade:</strong> ${result.popularity}</p>
        <hr>
      `;
      resultsContainer.appendChild(resultElement);
    });
  }
  