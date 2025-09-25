

// sanitize by converting all pay item values to numbers
export const sanitizedPayslips = (payslips) => {
    return Object.fromEntries(
        Object.entries(payslips).map(([empId, payItems]) => [
            empId,
            Object.fromEntries(
                Object.entries(payItems).map(([payItem, value]) => [
                    payItem,
                    Number(value) || 0, // force number, fallback to 0 if NaN
                ])
            ),
        ])
    );
}