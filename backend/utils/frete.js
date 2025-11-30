// Utilitário para cálculo de frete
// A loja fica em São Paulo, então frete baseado na UF de destino

function calcularFrete(uf) {
    const regioes = {
        sudeste: {
            estados: ['SP', 'RJ', 'MG', 'ES'],
            valores: {
                'SP': 10.00,  // Capital
                'RJ': 15.00,
                'MG': 18.00,
                'ES': 20.00
            }
        },
        sul: {
            estados: ['PR', 'SC', 'RS'],
            valorBase: 25.00
        },
        centroOeste: {
            estados: ['GO', 'DF', 'MT', 'MS'],
            valorBase: 30.00
        },
        nordeste: {
            estados: ['BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA'],
            valorBase: 40.00
        },
        norte: {
            estados: ['PA', 'AP', 'AM', 'RR', 'AC', 'RO', 'TO'],
            valorBase: 50.00
        }
    }

    // Buscar região do estado
    for (const [regiao, config] of Object.entries(regioes)) {
        if (config.estados.includes(uf)) {
            return config.valores?.[uf] || config.valorBase
        }
    }

    return 30.00 // Padrão
}

// Calcular data estimada de chegada baseado na UF
function calcularDataEstimada(uf) {
    const regioes = {
        sudeste: {
            estados: ['SP', 'RJ', 'MG', 'ES'],
            diasEntrega: {
                'SP': 2,   // São Paulo (capital) - 2 dias úteis
                'RJ': 3,   // Rio de Janeiro - 3 dias úteis
                'MG': 4,   // Minas Gerais - 4 dias úteis
                'ES': 4    // Espírito Santo - 4 dias úteis
            }
        },
        sul: {
            estados: ['PR', 'SC', 'RS'],
            diasEntregaBase: 5  // 5 dias úteis
        },
        centroOeste: {
            estados: ['GO', 'DF', 'MT', 'MS'],
            diasEntregaBase: 6  // 6 dias úteis
        },
        nordeste: {
            estados: ['BA', 'SE', 'AL', 'PE', 'PB', 'RN', 'CE', 'PI', 'MA'],
            diasEntregaBase: 7  // 7 dias úteis
        },
        norte: {
            estados: ['PA', 'AP', 'AM', 'RR', 'AC', 'RO', 'TO'],
            diasEntregaBase: 8  // 8 dias úteis
        }
    }

    let diasUteis = 6; // Padrão

    // Buscar região do estado
    for (const [regiao, config] of Object.entries(regioes)) {
        if (config.estados.includes(uf)) {
            diasUteis = config.diasEntrega?.[uf] || config.diasEntregaBase || 6;
            break;
        }
    }

    // Calcular a data estimada de entrega (apenas dias úteis)
    const dataAtual = new Date();
    let dataEstimada = new Date(dataAtual);
    let contadorDiasUteis = 0;

    // Incrementar apenas dias úteis (seg-sex)
    while (contadorDiasUteis < diasUteis) {
        dataEstimada.setDate(dataEstimada.getDate() + 1);

        // Verificar se é dia útil (0 = domingo, 6 = sábado)
        const diaSemana = dataEstimada.getDay();
        if (diaSemana !== 0 && diaSemana !== 6) {
            contadorDiasUteis++;
        }
    }

    return dataEstimada;
}

// Formatar data estimada para exibição
function formatarDataEstimada(data) {
    const opcoes = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return data.toLocaleDateString('pt-BR', opcoes);
}

module.exports = { calcularFrete, calcularDataEstimada, formatarDataEstimada };

