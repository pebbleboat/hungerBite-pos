"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/** Single app-wide toast host — required for `showToast()` outside PageWrapper (e.g. onboarding). */
export default function ToastProvider() {
  return (
    <ToastContainer
      stacked
      className="!z-[10050]"
      toastClassName="!z-[10050]"
    />
  );
}
