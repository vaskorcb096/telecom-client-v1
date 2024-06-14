/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        xss: ["0.625rem", "0.75rem"],
        xs: ["0.75rem", "0.975rem"],
        sm: ["0.875rem", "1.225rem"],
        base: ["1rem", "1.22rem"],
        md: ["1.125rem", "1.35rem"],
        lg: ["1.25rem", "1.5rem"],
        xl: ["1.5rem", "1.8rem"],
      },
    },
  },
  plugins: [
    nextui({
      layout: {
        spacingUnit: 4,
        disabledOpacity: 0.5,
        dividerWeight: "1px",
        radius: {
          small: "8px",
          medium: "12px",
          large: "14px",
        },
        borderWidth: {
          small: "1px",
          medium: "2px",
          large: "3px",
        },
      },
      themes: {
        light: {
          layout: {
            hoverOpacity: 0.8,
            boxShadow: {
              small:
                "0px 0px 5px 0px rgb(0 0 0 / 0.02), 0px 2px 10px 0px rgb(0 0 0 / 0.06), 0px 0px 1px 0px rgb(0 0 0 / 0.3)",
              medium:
                "0px 0px 15px 0px rgb(0 0 0 / 0.03), 0px 2px 30px 0px rgb(0 0 0 / 0.08), 0px 0px 1px 0px rgb(0 0 0 / 0.3)",
              large:
                "0px 0px 30px 0px rgb(0 0 0 / 0.04), 0px 30px 60px 0px rgb(0 0 0 / 0.12), 0px 0px 1px 0px rgb(0 0 0 / 0.3)",
            },
          },
          colors: {
            background: "#FFFFFF",
            foreground: "#000000",
            primary: {
              DEFAULT: "#3169FF",
              100: "#E5ECFF",
              200: "#BACDFF",
              300: "#98B4FF",
              400: "#769BFF",
              500: "#5382FF",
              600: "#2958D4",
              700: "#2146AA",
              800: "#193580",
              900: "#102355",
              1000: "#0A1533",
            },
            secondary: {
              DEFAULT: "#32C072",
              100: "#ECF9F2",
              200: "#BBEAD0",
              300: "#98DFB8",
              400: "#76D5A1",
              500: "#54CA89",
              600: "#2AA05F",
              700: "#21804C",
              800: "#196039",
              900: "#114026",
              1000: "#0A2617",
            },
            tertiary: {
              DEFAULT: "#FF6E31",
              100: "#FFEDE5",
              200: "#FFCFBA",
              300: "#FFB698",
              400: "#FF9E76",
              500: "#FF8653",
              600: "#D45C29",
              700: "#AA4921",
              800: "#803719",
              900: "#552510",
              1000: "#33160A",
            },
            quarternary: {
              DEFAULT: "#FFA51F",
              100: "#FFF5E5",
              200: "#FFE1B4",
              300: "#FFD28F",
              400: "#FFC36A",
              500: "#FFB444",
              600: "#D4891A",
              700: "#AA6E15",
              800: "#805310",
              900: "#55370A",
              1000: "#332106",
            },
            neutral: {
              DEFAULT: "#212121",
              100: "#FFFFFF",
              200: "#F5F5F5",
              300: "#EEEEEE",
              400: "#E0E0E0",
              500: "#BDBDBD",
              600: "#9E9E9E",
              700: "#757575",
              800: "#616161",
              900: "#424242",
              1000: "#212121",
            },
            success: {
              DEFAULT: "#54A675",
              100: "#DDEDE3",
              200: "#C6E1D1",
              300: "#A9D2BA",
              400: "#8DC4A3",
              500: "#71B58C",
              600: "#468A62",
              700: "#386F4E",
              800: "#2A533B",
              900: "#1C3727",
              1000: "#112117",
            },
            warning: {
              DEFAULT: "#EEAB3A",
              100: "#FCEED8",
              200: "#F9E3BD",
              300: "#F6D59C",
              400: "#F4C77C",
              500: "#F1B95B",
              600: "#C68E30",
              700: "#9F7227",
              800: "#77561D",
              900: "#4F3913",
              1000: "#30220C",
            },
            danger: {
              DEFAULT: "#E53E3E",
              100: "#FCE8E8",
              200: "#F6BFBF",
              300: "#F29E9E",
              400: "#EE7E7E",
              500: "#E95E5E",
              600: "#BF3434",
              700: "#992929",
              800: "#731F1F",
              900: "#4C1515",
              1000: "#2E0C0C",
            },
            info: {
              DEFAULT: "#3379FA",
              100: "#D6E4FE",
              200: "#BBD2FD",
              300: "#99BCFC",
              400: "#77A6FC",
              500: "#558FFB",
              600: "#2B65D0",
              700: "#2251A7",
              800: "#1A3D7D",
              900: "#112853",
              1000: "#0A1832",
            },
          },
        },
        dark: {
          layout: {
            hoverOpacity: 0.9,
            boxShadow: {
              small:
                "0px 0px 5px 0px rgb(0 0 0 / 0.05), 0px 2px 10px 0px rgb(0 0 0 / 0.2), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)",
              medium:
                "0px 0px 15px 0px rgb(0 0 0 / 0.06), 0px 2px 30px 0px rgb(0 0 0 / 0.22), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)",
              large:
                "0px 0px 30px 0px rgb(0 0 0 / 0.07), 0px 30px 60px 0px rgb(0 0 0 / 0.26), inset 0px 0px 1px 0px rgb(255 255 255 / 0.15)",
            },
          },
        },
      },
    }),
  ],
};
