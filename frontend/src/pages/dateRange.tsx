import { useState } from "react";
import toast from "react-hot-toast";

interface ExpirySoonVehicle {
    carPlate: string;
    expiryDate: string;
}

const DateRange: React.FC = () => {
    const [vehicleData, setVehicleData] = useState<ExpirySoonVehicle[] | null>(
        null
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const fetchVehicleData = async () => {
        if (startDate !== "" && endDate !== "") {
            const startDateObj = new Date(startDate);
            const endDateObj = new Date(endDate);
            if (startDateObj < endDateObj) {
                try {
                    setIsLoading(true);
                    const res = await fetch(
                        `http://127.0.0.1:8000/expiryRange/?startDate=${startDate}&endDate=${endDate}`
                    );
                    if (!res.ok) {
                        toast.error(
                            "This didn't work. Failed to fetch Vehicles!"
                        );
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
                    // console.log("vehicleData:", vehicleData);
                }
            } else {
                toast.error("End date must be after start date!");
            }
        } else {
            toast.error(
                "Please select both the starting date and the ending date!"
            );
        }
    };

    return (
        <div className="w-full flex-col items-center justify-center ">
            <div className="mx-auto mt-10 w-full flex-col items-center justify-center space-y-3 p-4">
                <h3 className="text-left text-2xl font-bold">
                    Search Vehicles with Expiry Date between these Date Range:
                </h3>
                <div className="mb-4 grid grid-cols-5 gap-5">
                    <div className="col-span-5 md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                            Starting From:
                        </label>

                        <input
                            type="date"
                            className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div className="col-span-5 md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                            To:
                        </label>

                        <input
                            type="date"
                            className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div className="col-span-5 md:col-span-1">
                        <button
                            className="mx-auto my-7 flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={fetchVehicleData}
                            disabled={isLoading}
                        >
                            {isLoading ? "Fetching..." : "Search"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex w-full flex-col items-center justify-center gap-5">
                {vehicleData ? (
                    <>
                        <h3 className="text-left text-2xl font-bold">
                            Search Result:
                        </h3>

                        <div className="grid grid-cols-3 gap-4">
                            {vehicleData.map((vehicle) => (
                                <div
                                    key={vehicle.carPlate}
                                    className="col-span-3 block max-w-sm rounded-lg border border-gray-200 bg-white p-5 shadow  dark:border-gray-700 dark:bg-gray-800 md:col-span-1"
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
                    </>
                ) : (
                    <p></p>
                )}
            </div>
        </div>
    );
};

export default DateRange;
