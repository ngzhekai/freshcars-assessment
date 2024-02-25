import Head from "next/head";
import "flowbite";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface Company {
    id: number;
    name: string;
}

interface Vehicle {
    carPlate: string;
    propellant: string;
    seats: number;
    colour: string;
    companyName: string;
    companyId: number;
    expiryDate: string;
}

interface FormData {
    carPlate: string;
    propellant: string;
    seats: number;
    colour: string;
    companyId: number;
    expiryDate: Date;
}

interface updateData {
    propellant: string;
    seats: number;
    colour: string;
    companyId: number;
    expiryDate: Date;
}

export default function Home() {
    const { register, handleSubmit, reset } = useForm();

    const {
        register: register2,
        handleSubmit: handleSubmit2,
        reset: reset2,
    } = useForm();

    const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
        if (
            data.carPlate !== "" &&
            data.propellant !== "" &&
            data.seats !== null &&
            data.colour !== "" &&
            data.companyId !== null &&
            data.expiryDate !== null
        ) {
            console.log(data);
            // make api call
            try {
                setIsSubmitLoading(true);
                const res = await fetch("http://127.0.0.1:8000/vehicles/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
                if (!res.ok) {
                    const errorMessage = await res.json();

                    toast.error(errorMessage.detail || "Failed to submit");
                    throw new Error(errorMessage.detail);
                }
                console.log("Data Submitted Successfully!");
                toast.success("Vehicle added successfully!");
                reset();
                await fetchVehicleData();
            } catch (error) {
                console.error("Error submitting data: ", error);
                toast.error("Failed to add Vehicle!");
            } finally {
                setIsSubmitLoading(false);
            }
        } else {
            reset();
        }
    };

    const [carPlate, setCarPlate] = useState<string>("");

    const onUpdate: SubmitHandler<updateData> = async (data: updateData) => {
        console.log("carPlate: ", carPlate);
        if (
            data.propellant !== "" &&
            data.seats !== null &&
            data.colour !== "" &&
            data.companyId !== null &&
            data.expiryDate !== null
        ) {
            console.log(data);
            // make api call
            try {
                setIsSubmitLoading(true);
                const res = await fetch(`http://127.0.0.1:8000/${carPlate}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
                if (!res.ok) {
                    const errorMessage = await res.json();

                    toast.error(errorMessage.detail || "Failed to submit");
                    throw new Error(errorMessage.detail);
                }
                console.log("Data Submitted Successfully!");
                toast.success(`Vehicle ${carPlate} updated successfully!`);
                reset2();
                await fetchVehicleData();
            } catch (error) {
                console.error("Error submitting data: ", error);
                toast.error("Failed to update Vehicle!");
            } finally {
                setIsSubmitLoading(false);
            }
        } else {
            reset2();
        }
    };

    const [data, setData] = useState<Company[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSubmitLoading, setIsSubmitLoading] = useState<boolean>(false);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("http://127.0.0.1:8000/companies/");
            if (!res.ok) {
                toast.error(
                    "This didn't work. Failed to fetch Car Company List!"
                );
                throw new Error("Failed to fetch data");
            }
            const jsonData: Company[] = await res.json();
            setData(jsonData);
            toast.success("Car Company List Updated!");
        } catch (error) {
            console.error("Error fetching data: ", error);
            toast.error("This didn't work.");
        } finally {
            setIsLoading(false);
        }
    };

    {
        /* retrieve vehicles properties from backend  */
    }
    const [vehicleData, setVehicleData] = useState<Vehicle[] | null>(null);
    const [vehicleIsLoading, setVehicleIsLoading] = useState<boolean>(false);

    const fetchVehicleData = async () => {
        try {
            setVehicleIsLoading(true);
            const res = await fetch("http://127.0.0.1:8000/vehicles/");
            if (!res.ok) {
                toast.error(
                    "This didn't work. Failed to fetch Car Company List!"
                );
                throw new Error("Failed to fetch data");
            }

            const jsonData: Vehicle[] = await res.json();

            setVehicleData(jsonData);
            toast.success("Vehicle List Updated!");
        } catch (error) {
            console.error("Error fetching data: ", error);
            toast.error("This didn't work.");
        } finally {
            setVehicleIsLoading(false);
            {
                /* console.log("vehicleData:", vehicleData); */
            }
        }
    };

    useEffect(() => {
        fetchVehicleData();
        fetchData();
    }, []);

    return (
        <>
            <Head>
                <title>Create T3 App</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/* <!-- Main modal --> */}
            <div
                id="crud-modal"
                tabIndex={-1}
                aria-hidden="true"
                className="fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0"
            >
                <div className="relative max-h-full w-full max-w-md p-4">
                    <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between rounded-t border-b p-4 dark:border-gray-600 md:p-5">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Add Vehicle
                            </h3>
                            <button
                                type="button"
                                className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-toggle="crud-modal"
                            >
                                <svg
                                    className="h-3 w-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        <form
                            className="p-4 md:p-5"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="mb-4 grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Car Plate Number
                                    </label>
                                    <input
                                        type="text"
                                        className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                                        placeholder="Car Plate Number"
                                        {...register("carPlate", {
                                            required: true,
                                        })}
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Propellant
                                    </label>
                                    <select
                                        className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                                        {...register("propellant", {
                                            required: true,
                                        })}
                                    >
                                        <option value="electric">
                                            Electric
                                        </option>
                                        <option value="petrol">Petrol</option>
                                        <option value="hybrid">Hybrid</option>
                                        <option value="diesel">Diesel</option>
                                    </select>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Number of Seats
                                    </label>
                                    <input
                                        type="number"
                                        className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                                        placeholder="5"
                                        {...register("seats", {
                                            required: true,
                                        })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Colour
                                    </label>
                                    <input
                                        type="text"
                                        className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                                        placeholder="e.g. black"
                                        {...register("colour", {
                                            required: true,
                                        })}
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Car Company
                                    </label>
                                    <select
                                        className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                                        {...register("companyId", {
                                            required: true,
                                        })}
                                    >
                                        {data?.map((company) => (
                                            <option
                                                key={company.id}
                                                value={company.id}
                                            >
                                                {company.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Refresh Car Company List
                                    </label>
                                    <button
                                        className="ml-0 flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        onClick={fetchData}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Fetching..." : "Refresh"}
                                    </button>
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                    Expiry Date
                                </label>
                                <input
                                    type="date"
                                    className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                                    {...register("expiryDate", {
                                        required: true,
                                    })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-4 inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <svg
                                    className="-ms-1 me-1 h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                                {isSubmitLoading
                                    ? "Submitting..."
                                    : "Add Vehicle"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Update modal */}

            <div
                id="update-modal"
                tabIndex={-1}
                aria-hidden="true"
                className="fixed left-0 right-0 top-0 z-50 hidden h-[calc(100%-1rem)] max-h-full w-full items-center justify-center overflow-y-auto overflow-x-hidden md:inset-0"
            >
                <div className="relative max-h-full w-full max-w-md p-4">
                    <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
                        <div className="flex items-center justify-between rounded-t border-b p-4 dark:border-gray-600 md:p-5">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Update Vehicle
                            </h3>
                            <button
                                type="button"
                                className="ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                                data-modal-toggle="update-modal"
                            >
                                <svg
                                    className="h-3 w-3"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 14 14"
                                >
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        <form
                            className="p-4 md:p-5"
                            onSubmit={handleSubmit2(onUpdate)}
                        >
                            <div className="mb-4 grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Car Plate Number
                                    </label>
                                    <input
                                        type="text"
                                        className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                                        placeholder="Car Plate Number"
                                        value={carPlate}
                                        onChange={(e) =>
                                            setCarPlate(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="col-span-2 sm:col-span-1">
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Propellant
                                    </label>
                                    <select
                                        className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                                        {...register2("propellant", {
                                            required: true,
                                        })}
                                    >
                                        <option value="electric">
                                            Electric
                                        </option>
                                        <option value="petrol">Petrol</option>
                                        <option value="hybrid">Hybrid</option>
                                        <option value="diesel">Diesel</option>
                                    </select>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Number of Seats
                                    </label>
                                    <input
                                        type="number"
                                        className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                                        placeholder="5"
                                        {...register2("seats", {
                                            required: true,
                                        })}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Colour
                                    </label>
                                    <input
                                        type="text"
                                        className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                                        placeholder="e.g. black"
                                        {...register2("colour", {
                                            required: true,
                                        })}
                                    />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Car Company
                                    </label>
                                    <select
                                        className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                                        {...register2("companyId", {
                                            required: true,
                                        })}
                                    >
                                        {data?.map((company) => (
                                            <option
                                                key={company.id}
                                                value={company.id}
                                            >
                                                {company.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                        Refresh Car Company List
                                    </label>
                                    <button
                                        className="ml-0 flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                        onClick={fetchData}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Fetching..." : "Refresh"}
                                    </button>
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                                    Expiry Date
                                </label>
                                <input
                                    type="date"
                                    className="focus:ring-primary-600 focus:border-primary-600 dark:focus:ring-primary-500 dark:focus:border-primary-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 dark:border-gray-500 dark:bg-gray-600 dark:text-white dark:placeholder-gray-400"
                                    {...register2("expiryDate", {
                                        required: true,
                                    })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-4 inline-flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                <svg
                                    className="-ms-1 me-1 h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                                {isSubmitLoading
                                    ? "Submitting..."
                                    : "Update Vehicle"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="w-full flex-col items-center justify-center ">
                <div className="flex justify-between">
                    <button
                        className="mx-auto my-5 flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={fetchVehicleData}
                        disabled={vehicleIsLoading}
                    >
                        {vehicleIsLoading ? "Fetching..." : "Refresh"}
                    </button>
                    {/* <!-- Modal toggle --> */}
                    <button
                        data-modal-target="crud-modal"
                        data-modal-toggle="crud-modal"
                        className=" mx-auto my-5 flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        type="button"
                    >
                        Add Vehicle
                    </button>
                    <button
                        data-modal-target="update-modal"
                        data-modal-toggle="update-modal"
                        className="mx-auto my-5 flex items-center rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        type="button"
                    >
                        Update Vehicle
                    </button>
                </div>

                <h3 className="my-4 text-center text-2xl font-bold">
                    Vehicles List
                </h3>
                <div className="flex w-full items-center justify-center gap-5">
                    {vehicleData ? (
                        <div className="grid grid-cols-2 gap-4">
                            {vehicleData.map((vehicle) => (
                                <div
                                    key={vehicle.carPlate}
                                    className="col-span-2 block max-w-sm rounded-lg border border-gray-200 bg-white p-5 shadow hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 md:col-span-1"
                                >
                                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        {vehicle.carPlate}
                                    </h5>
                                    <div className="mb-2 grid grid-cols-3 gap-3">
                                        <div className="col-span-3 font-normal text-gray-700 dark:text-gray-400 md:col-span-1 md:text-sm">
                                            Color: {vehicle.colour}
                                        </div>
                                        <div className="col-span-3 font-normal text-gray-700 dark:text-gray-400 md:col-span-2 md:text-sm">
                                            Propellant: {vehicle.propellant}
                                        </div>
                                        <div className="col-span-3 font-normal text-gray-700 dark:text-gray-400 md:col-span-1 md:text-sm">
                                            Seats: {vehicle.seats}
                                        </div>

                                        <div className="col-span-3 font-normal text-gray-700 dark:text-gray-400 md:col-span-2 md:text-sm">
                                            Car Company: {vehicle.companyName}{" "}
                                        </div>
                                        <div className="col-span-3 font-normal text-gray-700 dark:text-gray-400 md:text-sm">
                                            Expiry Date: {vehicle.expiryDate}{" "}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Nothing is fetched</p>
                    )}
                </div>
            </div>
        </>
    );
}
