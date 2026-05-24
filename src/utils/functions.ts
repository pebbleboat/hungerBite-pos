import { FormikProps } from "formik";
import moment from "moment";

export const extractText = (
    text: string,
    replace?: string,
    replaceWith?: string
) => text?.toLowerCase()?.replaceAll(replace || "_", replaceWith || " ");

export const createUrl = (url: string, params?: object): string => {
    const queryString = params
        ? url?.includes("?")
            ? `&${stringifyParams(params)}`
            : `?${stringifyParams(params)}`
        : "";
    return `${url}${queryString}`;
};

export const stringifyParams = (params: object) => {
    return Object.entries(params)
        ?.filter(([, value]) => {
            if (Array.isArray(value)) return value.length > 0;
            return Boolean(value);
        })
        ?.flatMap(([key, value]) => {
            if (Array.isArray(value)) {
                return value.map(
                    (v) =>
                        `${encodeURIComponent(key)}=${encodeURIComponent(v as string)}`
                );
            }
            return [
                `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`,
            ];
        })
        ?.join("&");
};

export const decodeToken = (token: string) => {
    try {
        return JSON.parse(window?.atob(token?.split(".")[1]));
    } catch (e) {
        console.error("Failed to decode token:", e);
        return null;
    }
};

export function combine(...args: (string | undefined | null)[]): string {
    return args?.filter(Boolean)?.join(" ");
}

export const convertDate = (date: any) => {
    return moment(date).local().format("DD MMM YYYY");
};

export const convertTime = (time: any) => {
    return moment(time).local().format("hh:mm A");
};


export const CURRENCY_SYMBOL = "₹";

export function formatINR(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}


export function formikFieldError<T extends object>(
    formik: FormikProps<T>,
    field: keyof T & string,
): string | undefined {
    const touched = formik.touched[field as keyof typeof formik.touched];
    const error = formik.errors[field as keyof typeof formik.errors];
    if (touched && typeof error === "string") return error;
    return undefined;
}