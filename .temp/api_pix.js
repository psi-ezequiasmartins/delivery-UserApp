const axios = require('axios');

async function repassarValor(chavePixDestino, valor) {
    const config = {
        method: 'POST',
        url: 'https://api.gerencianet.com.br/v1/pix',
        headers: {
            Authorization: `Bearer SEU_TOKEN`,
            'Content-Type': 'application/json'
        },
        data: {
            valor: valor.toFixed(2),
            chave: chavePixDestino,
            descricao: 'Repasse Sanduba do Zé'
        }
    };

    try {
        const response = await axios(config);
        console.log('Pagamento realizado:', response.data);
    } catch (error) {
        console.error('Erro ao realizar pagamento:', error.response.data);
    }
}

repassarValor('chave-pix-destino@exemplo.com', 59.90);
