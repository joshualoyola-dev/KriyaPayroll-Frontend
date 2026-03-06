import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { usePayitemContext } from "../../../../contexts/PayitemProvider";
import { formatPayitemGroup } from "../../../../utility/text.utility";

const PayitemDropdown = ({ onSelect, disabled = false, filterIds = [] }) => {
    const { payitems } = usePayitemContext();
    const [open, setOpen] = useState(false);

    const filtered = payitems.filter(
        item => !filterIds.includes(item.payitem_id)
    );

    return (
        <div className="relative">
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen(o => !o)}
                className={`w-full px-3 py-2.5 border border-gray-500 rounded-3xl text-sm flex justify-between items-center ${disabled ? "cursor-not-allowed bg-gray-100 text-gray-400" : ""}`}
            >
                Select Pay Items
                <ChevronDownIcon className="h-5 w-5 text-gray-400" />
            </button>

            {open && !disabled && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute z-50 mt-2 w-full bg-white border border-gray-500 rounded-xl max-h-80 overflow-auto">
                        {filtered.map(item => (
                            <button
                                key={item.payitem_id}
                                type="button"
                                onClick={() => {
                                    onSelect(item.payitem_id);
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-teal-50 text-sm text-gray-700 flex flex-col gap-0.5"
                            >
                                <span>{item.payitem_name}</span>
                                {item.payitem_group && (
                                    <span
                                        className="text-[10px] font-medium px-1.5 py-0.5 rounded-full w-fit"
                                        style={{ border: '1px solid #008080', color: '#008080' }}
                                    >
                                        {formatPayitemGroup(item.payitem_group)}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default PayitemDropdown;
