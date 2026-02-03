export const normalizeTemplateValues = (template = []) => {
    return (template ?? []).map((item) => {
        if (!item) return item;
        if (item.field_type === "number") {
            const n = Number(item.value);
            return { ...item, value: Number.isFinite(n) ? n : 0 };
        }
        return { ...item, value: item.value ?? "" };
    });
};

export const indexTemplateByCode = (template = []) => {
    const map = new Map();
    for (const item of template ?? []) {
        if (!item?.field_code) continue;
        map.set(item.field_code, item);
    }
    return map;
};

