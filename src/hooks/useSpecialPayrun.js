const formData = {
    date_from: '',
    date_to: '',
    payment_date: '',
    pay_items: [
        { 'payitem-id-01': "Tax Withheld" },
        { 'payitem-id-02': "Basic Pay" },
    ], //payitem_id : pay_item_name in the column
};

const useSpecialPayrun = () => {
    return {};
};

export default useSpecialPayrun;