import { useState, useEffect } from "react";
import toast from "react-hot-toast";

interface ExpirySoonVehicle {
    carPlate: string;
    expiryDate: string;
}

const QueryDate: React.FC = () => {
    const currentDate = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    const formatDate = (date: Date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    };

    const formattedCurrentDate = formatDate(currentDate);
    const formattedOneMonthFromNow = formatDate(oneMonthFromNow);

    const [vehicleData, setVehicleData] = useState<ExpirySoonVehicle[] | null>(
        null
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchVehicleData = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(
                `http://127.0.0.1:8000/expiryRange/?startDate=${formattedCurrentDate}&endDate=${formattedOneMonthFromNow}`
            );
            if (!res.ok) {
                toast.error("This didn't work. Failed to fetch Vehicles!");
                throw new Error("Failed to fetch data");
            }

            const jsonData: ExpirySoonVehicle[] = await res.json();

            setVehicleData(jsonData);
            toast.success("Vehicle Data Fetched!");
        } catch (error) {
            console.error("Error fetching data: ", error);
            toast.error("This didn't work.");
        } finally {
            setIsLoading(false);
            console.log("vehicleData:", vehicleData);
        }
    };

    const highlightThreshold = 1000 * 60 * 60 * 24 * 14; // two weeks in milliseconds
    const isExpiringSoon = (expiryDate: string) => {
        const expiryDateTime = new Date(expiryDate).getTime();
        return expiryDateTime - currentDate.getTime() <= highlightThreshold;
    };

    useEffect(() => {
        fetchVehicleData();
    }, []);

    return (
        <div className="mt-10 items-center w-full justify-center  space-y-3">
            <h3 className="text-2xl text-center font-bold">Vehicles that are expiring soon:</h3>

            <div className="flex w-full items-center justify-center gap-5">
                {vehicleData ? (
                    <div className="grid grid-cols-3 gap-4">
                        {vehicleData.map((vehicle) => (
                            <div
                                key={vehicle.carPlate}
                                className={`${isExpiringSoon(vehicle.expiryDate) ? "bg-red-200" : ""} col-span-3 block max-w-sm rounded-lg border border-gray-200  p-5 shadow dark:border-gray-700 dark:bg-gray-800 md:col-span-1`}
                            >
                                <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {vehicle.carPlate}
                                </h5>

                                <div className="col-span-3 font-normal text-gray-700 dark:text-gray-400 md:text-sm">
                                    Expiry Date: {vehicle.expiryDate}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Nothing is fetched</p>
                )}
            </div>
        </div>
    );
};

export default QueryDate;
