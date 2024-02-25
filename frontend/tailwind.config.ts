import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
    content: [
        "./src/**/*.tsx",
        "./node_modules/flowbite/**/*.js",
        "./node_modules/tailwind-datepicker-react/dist/**/*",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-sans)", ...fontFamily.sans],
            },
        },
    },
    plugins: [require("flowbite/plugin")],
} satisfies Config;
