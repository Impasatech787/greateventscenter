"use client";

import { useState } from "react";

interface SignupForm {
  email: string;
  name: string;
}

interface FormErrors {
  email?: string;
  name?: string;
  general?: string;
}
export default function SignupPage() {
  const [signupForm, setSignupForm] = useState<SignupForm>({
    email: "",
    name: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, general: undefined }));
  };

  const validate = (form: SignupForm): FormErrors => {
    const newErrors: FormErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required.";
    if (!form.name.trim()) newErrors.name = "Name is required.";
    return newErrors;
  };

  const handleSignUp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const validationErrors = validate(signupForm);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    console.log("Submitting form:", signupForm);
    setIsLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupForm),
      });
      if (!res.ok) {
        setErrors({ general: "Signup failed. Please try again." });
      } else {
        setSignupForm({ email: "", name: "" });
        setErrors({});
        // Optionally show a success message or redirect
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setErrors({ general: "Signup failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

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
            <input
              type="email"
              name="email"
              value={signupForm.email}
              onChange={handleChange}
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
            <input
              type="text"
              name="name"
              value={signupForm.name}
              onChange={handleChange}
              className={`bg-slate-100 p-2 md:w-80 text-black ${
                errors.name ? "border border-red-500" : ""
              }`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <span id="name-error" className="text-xs text-red-600">
                {errors.name}
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
