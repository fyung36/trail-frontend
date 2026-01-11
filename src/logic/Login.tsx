"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Row, Col } from "antd";

import type { Login } from "@/types/Auth";
import { LoginForm } from "@/components/Forms/LoginForm";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<Login>({
    email: "",
    password: "",
    user_type: "organisation_user",
  });
  const [isActive, setIsActive] = useState<boolean>(true);
  
  const onChangeForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleUserType = () => {
    setIsActive(!isActive);
    setFormData({ 
      ...formData, 
      user_type: isActive ? "generic_user" : "organisation_user" 
    });
  };
  
  const accountTypeOnChange = (e: any) => {
    const value = e.target.value;
    setFormData({ ...formData, user_type: value });
    setIsActive(value === "organisation_user");
  };

  const onSubmitForm = (values?: any) => {
    console.log("Login submitted:", values || formData);
    // For PoC: Simulate login and navigate to dashboard
    // In real app, this would make an API call and handle authentication
    if (values) {
      const loginData = { ...values, user_type: formData.user_type };
      console.log("Login data:", loginData);
    }
    router.push("/app/dashboard");
  };
  return (
    <div>
      <Row className="auth__row">
        <Col xs={{ span: 20 }} lg={{ span: 24 }}>
          <LoginForm
            formData={formData}
            isActive={isActive}
            onChangeForm={onChangeForm}
            toggleUserType={toggleUserType}
            accountTypeOnChange={accountTypeOnChange}
            onSubmitForm={onSubmitForm}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Login;
