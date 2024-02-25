import { type AppType } from "next/dist/shared/lib/utils";
import { Toaster } from "react-hot-toast";

import "~/styles/globals.css";
import Navbar from "~/components/navbar";

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <div>
            <main className="flex h-full justify-center">
                <div className="h-fit min-h-screen w-full md:max-w-3xl">
                    <Toaster position="bottom-center" reverseOrder={true} />
                    <Navbar />
                    <Component {...pageProps} />
                    <div className="text-center text-xs mt-5 mb-2">Built by Ng Zhe Kai</div>
                </div>
            </main>
        </div>
    );
};

export default MyApp;
