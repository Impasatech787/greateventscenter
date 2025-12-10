import { useState } from "react";

export interface SignupForm {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface FormErrors {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  general?: string;
}
export const useSignUp = () => {
  const [signUpForm, setSignUpForm] = useState<SignupForm>({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpForm((prev) => ({ ...prev, [name]: value }));
  };
  const validate = (form: SignupForm): FormErrors => {
    const newErrors: FormErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required.";
    if (!form.firstName.trim()) newErrors.firstName = "First Name is required.";
    if (!form.lastName.trim()) newErrors.lastName = "Lastname is required.";
    if (!form.lastName.trim()) newErrors.password = "Password is required.";
    return newErrors;
  };

  const togglePasswordShow = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const validationErrors = validate(signUpForm);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpForm),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        const message =
          (data && (data.error || data.message)) ||
          "Signup failed. Please try again.";
        setErrors({ general: message });
      } else {
        setSignUpForm({ email: "", firstName: "", lastName: "", password: "" });
        setErrors({});
      }
    } catch (error) {
      setErrors({ general: "Signup failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signUpForm,
    errors,
    handleInputChange,
    handleSignUp,
    togglePasswordShow,
    showPassword,
    isLoading,
  };
};
