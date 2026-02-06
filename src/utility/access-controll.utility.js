export const userHasFeatureAccess = (service_feature_id) => {
    if (!service_feature_id) return false;
    try {
        const raw = localStorage.getItem("service_features_access");
        const service_features_access = JSON.parse(raw || "[]");
        if (!Array.isArray(service_features_access)) return false;
        return service_features_access.some((feature) => feature.service_feature_id === service_feature_id);
    } catch {
        return false;
    }
};