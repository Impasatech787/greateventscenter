import { useRouter } from "next/navigation";
import { useState } from "react";

export interface LoginForm {
  email: string;
  password: string;
}
interface LoginError {
  email?: string;
  password?: string;
  general?: string;
}
export const useLogin = () => {
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<LoginError | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const togglePasswordShow = () => {
    setShowPassword(!showPassword);
  };
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validateLoginForm = (): boolean => {
    const errors: LoginError = {};
    if (!loginForm.email.trim()) errors.email = "Email is required.";
    if (!loginForm.password.trim()) errors.password = "Password is required.";
    if (!validateEmail(loginForm.email)) {
      errors.email = "Invalid email format";
    }
    if (loginForm.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }
    setLoginError(errors);
    return Object.keys(errors).length === 0;
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    mode?: string,
  ) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoading(true);
    try {
      if (validateLoginForm()) {
        const res = await fetch("/api/auth/sign-in", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginForm),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          const message =
            (data && (data.error || data.message)) ||
            "Login failed. Please try again.";
          setLoginError({ general: message });
        } else {
          localStorage.setItem("authToken", data.data.token);
          if (data.data.roles.includes("Admin")) {
            router.push("/back_office/dashboard");
          } else {
            router.push("/");
          }
          setLoginForm({ email: "", password: "" });
          setLoginError(null);
        }
      } else {
        return;
      }
    } catch (error) {
      setLoginError({
        general: "Login failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginForm,
    loginError,
    isLoading,
    handleInputChange,
    validateEmail,
    handleSubmit,
    showPassword,
    togglePasswordShow,
  };
};
