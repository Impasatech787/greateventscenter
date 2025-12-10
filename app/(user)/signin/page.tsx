"use client";

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
    <div className="min-h-screen bg-[#FDFBF9] flex items-center justify-center p-6 sm:p-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-8">
          <Image
            src="/GreatEventsLogo.svg"
            alt="Great Events Center"
            height={50}
            width={50}
          />
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1D1D1D] font-[Manrope] mb-2">
            Login
          </h1>
          <p className="text-zinc-500">
            Don&apos; have an account?{" "}
            <Link
              href="/signup"
              className="text-[#BB2327] font-medium hover:underline"
            >
              Register
            </Link>
          </p>
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

        {/* Divider */}
        <div className="mt-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-zinc-200" />
          <span className="text-sm text-zinc-400">or continue with</span>
          <div className="flex-1 h-px bg-zinc-200" />
        </div>

        {/* Social Login Options */}
        <div className="mt-6 flex gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12 rounded-xl border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-all"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12 rounded-xl border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-all"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#1877F2"
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
            Facebook
          </Button>
        </div>
      </div>
    </div>
  );
}
