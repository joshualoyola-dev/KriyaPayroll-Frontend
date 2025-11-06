import LoadingBackground from "../../../../components/LoadingBackground";
import Search from "../../../../components/Search";
import { usePayitemContext } from "../../../../contexts/PayitemProvider";
import PayitemTable from "./PayitemTable";

const PayitemPage = () => {
    const { query, setQuery, payitemsLoading, payitems } = usePayitemContext();

    return (
        <>
            <div className="flex pb-4">
                <Search query={query} setQuery={setQuery} />
            </div>
            {payitems && <PayitemTable />}
            {payitemsLoading && <LoadingBackground />}

        </>
    )
};

export default PayitemPage;