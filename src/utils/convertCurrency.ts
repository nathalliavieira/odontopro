// - Valor em centavos = Valor em reais * 100
// - Valor em reais = Valor em centavos / 100

// abaixo, vamos escrever as caracteristicas da funcao

/**
* Converte um valor monetário em reais para centavos
* @param {string} amount - O valor monetário em reais a ser convertido
* @returns {number} O valor convertido em centavos
* 
* @example
* convertRealToCents("5,00"); // Retorna: 500 cents
*/
export function convertRealToCents(amount: string){
    const numericPrice = parseFloat(amount.replace(/\./g, "").replace(",", ".")); //Aonde tiver ponto ele retira e coloca string vazia, e aonde está virgula ele tira e troca por ponto

    const priceInCents = Math.round(numericPrice * 100);

    return priceInCents;
}