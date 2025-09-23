/**
 * Verificar se o dia de hoje é o dia de hoje
 */
export function isToday(date: Date){
    const now = new Date();

    return(
        date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth() && date.getDate() === now.getDate()
    )
}

/**
 * Verificar se determinado slot já passou.
 */
export function isSlotInThePast(slotTime: string){
    const [slotHour, slotMinute] = slotTime.split(":").map(Number); //O map aqui usamos para percorrer cada const e transformar em um número, porque sem ele fica sendo uma string e nao nos permite fazer uma comparacao de if posteriormente.

    const now = new Date();

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if(slotHour < currentHour){
        return true; //true quer dizer que a hora já passou
    }else if(slotHour === currentHour && slotMinute <= currentMinute){
        //A comparacao aqui seria: Selecionou 16:30 e agora é 16:50
        return true;
    }

    return false; //Ou seja, a hora ainda nao passou.
}

/** 
 * Verificar se, a partir de um slot inicial, existe uma sequência de "requiredSlots" disponiveis.
 * Exemplo: se um serviço tem 2 required slots (2 slots preenchidos) e começa no time 15:00,
 * precisa garantir que 15:00 e 15:30 nao estejam no nosso blockedSlots
 */
export function isSlotSequenceAvailable(
    startSlot: string, //Primeiro horario que deve começar
    requiredSlots: number, //Quantidade de slots necessaria
    allSlots: string[], //Todos os horários da clinica
    blockedSlots: string[] //Horários bloqueados
){
    const startIndex = allSlots.indexOf(startSlot); //Ex.: passamos 10:00

    if(startIndex === -1 || startIndex + requiredSlots > allSlots.length){
        return false;
    } //Se a clinica nao se importar em agendar um procedimento para o ultimo horário (ou seja, teria que fechar a clinica depois do horario previsto) basta retirar a parte do codigo: || startIndex + requiredSlots > allSlots.length

    for(let i = startIndex; i < startIndex + requiredSlots; i++){
        const slotTime = allSlots[i];

        //Vamos verificar se esse time esta na blockedSlots
        if(blockedSlots.includes(slotTime)){
            return false;
        }
    }

    return true;
}