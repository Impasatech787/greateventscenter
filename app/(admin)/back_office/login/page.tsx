"use client";

import { RoleProvider } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/useLogin";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const {
    loginForm,
    loginError,
    handleInputChange,
    handleSubmit,
    isLoading,
    showPassword,
    togglePasswordShow,
  } = useLogin();

  return (
    <RoleProvider>
      <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex justify-center mb-8">
            <Image
              src="/GreatEventsLogo.svg"
              alt="Great Events Center"
              height={64}
              width={64}
            />
          </Link>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1D1D1D] font-manrope mb-2">
              Back Office Login
            </h1>
          </div>

          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit}
            method="post"
            noValidate
          >
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1D1D1D]">
                Email Address
              </label>
              <Input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={loginForm.email}
                onChange={handleInputChange}
                className={`bg-white border-zinc-200 rounded-xl h-12 px-4 text-[#1D1D1D] placeholder:text-zinc-400 focus:border-[#BB2327] focus:ring-[#BB2327]/20 transition-all ${
                  loginError?.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : ""
                }`}
                aria-invalid={!!loginError?.email}
                aria-describedby={loginError?.email ? "email-error" : undefined}
              />
              {loginError?.email && (
                <span
                  id="email-error"
                  className="text-xs text-red-600 flex items-center gap-1"
                >
                  {loginError.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1D1D1D]">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  value={loginForm.password}
                  onChange={handleInputChange}
                  className={`bg-white border-zinc-200 rounded-xl h-12 px-4 pr-12 text-[#1D1D1D] placeholder:text-zinc-400 focus:border-[#BB2327] focus:ring-[#BB2327]/20 transition-all ${
                    loginError?.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                  aria-invalid={!!loginError?.password}
                  aria-describedby={
                    loginError?.password ? "password-error" : undefined
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={togglePasswordShow}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 hover:bg-zinc-100 rounded-lg text-zinc-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </Button>
              </div>
              {loginError?.password && (
                <span
                  id="password-error"
                  className="text-xs text-red-600 flex items-center gap-1"
                >
                  {loginError.password}
                </span>
              )}
            </div>

            {/* General Error */}
            {loginError?.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 text-center">
                {loginError.general}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full h-12 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
                isLoading
                  ? "bg-zinc-400 cursor-not-allowed"
                  : "bg-[#BB2327] hover:bg-[#a01d21]"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in ..
                </span>
              ) : (
                <span className="flex items-center gap-2">Login </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </RoleProvider>
  );
}
