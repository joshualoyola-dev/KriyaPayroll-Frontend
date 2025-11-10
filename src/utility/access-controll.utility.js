
export const userHasFeatureAccess = (service_feature_id) => {
    //we'll check in the array if the service_feature_id is in the array
    const service_features_access = JSON.parse(localStorage.getItem("service_features_access"));
    if (service_features_access.some(feature => feature.service_feature_id === service_feature_id)) {
        return true;
    }
    return false;
};