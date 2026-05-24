import { SvgLogo } from "@/assets/svgs";
import Text from "@/shared/heading/Text";
import { FC, PropsWithChildren } from "react";


const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="relative flex min-h-[280px] flex-col justify-between bg-onboardingBg px-8 py-10 text-white lg:min-h-screen lg:w-[42%] lg:shrink-0 lg:px-12 lg:py-14">
        <div>
          <div className="flex items-center gap-2.5">
            <SvgLogo className="h-8 w-auto [&_circle:first-child]:fill-white [&_circle:last-child]:fill-[#0e214d]" />
            <Text as="span" size="xl" type="bold" className="text-white">
              HungerBite
            </Text>
          </div>
          <Text
            as="h1"
            size="3xl"
            type="bold"
            className="mt-10 max-w-md leading-tight text-white lg:mt-12 lg:text-4xl"
          >
            Scale your restaurant business with precision.
          </Text>
          <Text
            size="sm"
            className="mt-4 max-w-md leading-relaxed text-brand-200"
          >
            Manage orders, staff, and analytics across all your outlets from one
            single, powerful dashboard.
          </Text>
        </div>
        <div className="mt-10 flex items-center gap-3 lg:mt-0">
          <div className="flex -space-x-2">
            {["A", "B", "C"].map((initial, i) => (
              <div
                key={initial}
                className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#011640] bg-brand-400 text-xs font-semibold text-white"
                style={{ zIndex: 3 - i }}
              >
                {initial}
              </div>
            ))}
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#011640] bg-brand-700 text-[10px] font-semibold text-white">
              +2k
            </div>
          </div>
          <Text size="sm" className="text-brand-100">
            Trusted by 2,000+ outlets
          </Text>
        </div>
      </aside>
      <main className="flex flex-1 flex-col bg-white px-6 py-10 sm:px-10 lg:px-16 lg:py-14">
        <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
