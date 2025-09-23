export function formatPhone(value: string){
    //Primeiro vamos remover todos os caracteres nao numericos:
    const cleanedValue = value.replace(/\D/g, ""); //Aqui basicamente o que está dentro de /.../g é o que queremos remover, no nosso caso como queremos remover caractericos nao numericos o equivalente a isso é \D e logo depois em ", "" " é aonde queremos colocar o que sobrou, que no caso aspas vazias "" é dentro e uma string

    //Verificar se o numero tem no maximo 11 caracteres:
    if(cleanedValue.length > 11){
        return value.slice(0,11);
    }

    const firstPart = cleanedValue.slice(0, 3);
    const rest = cleanedValue.slice(3);

    //Aplicar a mascara:
    const groupedRest = rest.replace(/(\d{2})(?=\d)/g, "$1 ");
    
    return `${firstPart} ${groupedRest}`.trim();
}

export function extractPhoneNumber(phone: string){
    const phoneValue = phone.replace(/[\(\)\s-]/g, "");

    return phoneValue;
}