const CURRENCY_FORMATTER = new Intl.NumberFormat("pt-PT", {
    currency: "EUR",
    style: "currency",
    minimumFractionDigits: 0
});

export function formatCurrency(number: number){
    return CURRENCY_FORMATTER.format(number);
}