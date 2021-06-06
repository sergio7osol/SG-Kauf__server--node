function datesToNgDates(buyDates) {
    const convertedBuyDates = buyDates.map(DateBuys => {
        return DateBuys.map(buy => {
            const { date, time, address, country, currency, payMethod, shopName, products } = buy;

            address.country = country;

            return {
                date,
                time, 
                shopName,
                address,
                currency,
                payMethod,
                products
            };
        });
    });

    console.log('convertedBuyDates ', convertedBuyDates[0]);

    return convertedBuyDates;
}

module.exports = {
    datesToNgDates,
};