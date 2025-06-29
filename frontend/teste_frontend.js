// Script para testar se o frontend consegue acessar o backend
console.log('🔄 Testando comunicação frontend -> backend...');

// Testar se consegue acessar a API de categorias
fetch('/api/categorias-produto')
  .then(response => {
    console.log('Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('✅ Categorias carregadas:', data.length);
    console.log('Primeiras 3:', data.slice(0, 3));
    
    // Filtrar categorias de produtos (IDs 1-36)
    const categoriasProdutos = data.filter(cat => cat.id >= 1 && cat.id <= 36);
    console.log('📦 Categorias de produtos:', categoriasProdutos.length);
    
    // Filtrar categorias de serviços (IDs 37-66)
    const categoriasServicos = data.filter(cat => cat.id >= 37 && cat.id <= 66);
    console.log('🔧 Categorias de serviços:', categoriasServicos.length);
  })
  .catch(error => {
    console.error('❌ Erro ao carregar categorias:', error);
  }); 