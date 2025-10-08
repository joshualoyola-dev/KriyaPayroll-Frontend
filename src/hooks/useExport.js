import { useState } from "react";

const useExport = () => {

    const [selectedExport, setSelectedExport] = useState("ytd"); //selections include: 2316, 1601c

    const handleChangeSelection = (selected) => {
        setSelectedExport(selected);
    }

    return {
        selectedExport, setSelectedExport,
        handleChangeSelection,
    };
};

export default useExport;