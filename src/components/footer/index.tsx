"use client";

import Text from "@/shared/heading/Text";
import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Support", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
  { label: "API Documentation", href: "#" },
];

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-gray-200/80 bg-white px-4 py-4 lg:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <Text
          as="span"
          size="xxs"
          type="bold"
          className="uppercase tracking-widest text-gray-400"
        >
          Hungerbite
        </Text>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Text as="span" size="xxs" variant="tertiary">
          © {year} Hungerbite POS Systems. All rights reserved.
        </Text>
      </div>
    </footer>
  );
};

export default Footer;
