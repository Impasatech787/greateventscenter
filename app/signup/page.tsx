"use client";

import { Input } from "@/components/ui/input";
import { useSignUp } from "@/hooks/useSignUp";

export default function SignupPage() {
  const { signUpForm, errors, handleInputChange, handleSignUp, isLoading } =
    useSignUp();

  return (
    <div className="bg-white">
      <div className="container min-h-screen flex items-center justify-center">
        <form
          className="flex flex-col items-center  bg-gray-200 border rounded-md p-4 gap-4"
          onSubmit={handleSignUp}
          noValidate
        >
          <div className="space-y-2 flex flex-col">
            <label className="text-black">Email</label>
            <Input
              type="email"
              name="email"
              value={signUpForm.email}
              onChange={handleInputChange}
              className={`bg-slate-100 p-2 md:w-80 text-black ${
                errors.email ? "border border-red-500" : ""
              }`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <span id="email-error" className="text-xs text-red-600">
                {errors.email}
              </span>
            )}
          </div>
          <div className="space-y-2 flex flex-col">
            <label className="text-black">Name</label>
            <Input
              type="text"
              name="name"
              value={signUpForm.firstName}
              onChange={handleInputChange}
              className={`bg-slate-100 p-2 md:w-80 text-black ${
                errors.firstName ? "border border-red-500" : ""
              }`}
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? "name-error" : undefined}
            />
            {errors.firstName && (
              <span id="name-error" className="text-xs text-red-600">
                {errors.firstName}
              </span>
            )}
          </div>
          {errors.general && (
            <div className="text-sm text-red-600">{errors.general}</div>
          )}
          <button
            className={`${
              isLoading ? "bg-gray-400 pointer-event-none" : "bg-black"
            } text-white px-4 py-2 w-full rounded`}
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Submitting" : "SignUp"}
          </button>
        </form>
      </div>
    </div>
  );
}
