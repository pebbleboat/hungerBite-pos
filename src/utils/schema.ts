import * as Yup from "yup";

export type LoginFormValues = {
  email: string;
  password: string;
};

export const loginInitialValues: LoginFormValues = {
  email: "",
  password: "",
};

export const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});

export type ForgotPasswordEmailValues = {
  email: string;
};

export type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

export const forgotPasswordEmailInitialValues: ForgotPasswordEmailValues = {
  email: "",
};

export const resetPasswordInitialValues: ResetPasswordFormValues = {
  password: "",
  confirmPassword: "",
};

export const forgotPasswordEmailSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Enter a valid email")
    .required("Email is required"),
});

export const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

const passwordWithSpecial = Yup.string()
  .min(8, "Must be at least 8 characters")
  .matches(/[!@#$%^&*(),.?":{}|<>]/, "Include at least one special character")
  .required("Password is required");

export type OnboardingAccountValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type OnboardingOutletValues = {
  outletName: string;
  address: string;
  city: string;
  phone: string;
};

export const onboardingAccountInitialValues: OnboardingAccountValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

export const onboardingOutletInitialValues: OnboardingOutletValues = {
  outletName: "",
  address: "",
  city: "",
  phone: "",
};

export const onboardingAccountSchema = Yup.object({
  firstName: Yup.string().trim().required("First name is required"),
  lastName: Yup.string().trim().required("Last name is required"),
  email: Yup.string()
    .trim()
    .email("Enter a valid email")
    .required("Work email is required"),
  password: passwordWithSpecial,
});

export const onboardingOutletSchema = Yup.object({
  outletName: Yup.string().trim().required("Outlet name is required"),
  address: Yup.string().trim().required("Address is required"),
  city: Yup.string().trim().required("City is required"),
  phone: Yup.string()
    .trim()
    .matches(/^[+]?[\d\s()-]{7,}$/, "Enter a valid phone number")
    .required("Phone is required"),
});

export type MenuItemFormValues = {
  name: string;
  description: string;
  category: string;
  dietary: string;
  price: string;
  isAvailable: boolean;
  image: File | null;
};

export const menuItemInitialValues: MenuItemFormValues = {
  name: "",
  description: "",
  category: "",
  dietary: "",
  price: "",
  isAvailable: true,
  image: null,
};

export const menuItemSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Item name is too short")
    .required("Item name is required"),
  description: Yup.string()
    .trim()
    .min(10, "Add a few more words to the description")
    .required("Description is required"),
  category: Yup.string().trim().required("Category is required"),
  dietary: Yup.string().trim().required("Dietary type is required"),
  price: Yup.string()
    .matches(/^\d+(\.\d{1,2})?$/, "Enter a valid price")
    .required("Price is required")
    .test("min", "Price must be greater than 0", (v) => Number(v) > 0),
  isAvailable: Yup.boolean().required(),
  image: Yup.mixed<File>()
    .nullable()
    .test(
      "size",
      "Image must be 5MB or smaller",
      (file) => !file || (file instanceof File && file.size <= 5 * 1024 * 1024),
    )
    .test(
      "type",
      "Only JPG or PNG images are supported",
      (file) =>
        !file ||
        (file instanceof File &&
          ["image/jpeg", "image/png", "image/jpg"].includes(file.type)),
    ),
});
