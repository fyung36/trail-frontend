"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Row, Col } from "antd";

import { IForgotPassword } from "@/types/Auth";
import ForgotPasswordForm from "@/components/Forms/ForgotPasswordForm";

const ForgotPassword = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<IForgotPassword>({
    email: "",
  });
  const onChangeForm = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmitForm = () => {
    console.log("forgot password");
  };
  // if (isAuthenticated) {
  //   return <Redirect to="/app/dashboard" />;
  // }
  const goToPreviousPath = () => {
    router.back();
  };

  return (
    <div className="auth">
      <Row className="auth__row">
        <Col xs={{ span: 20 }} lg={{ span: 24 }}>
          <ForgotPasswordForm
            formData={formData}
            onChangeForm={onChangeForm}
            goToPreviousPath={goToPreviousPath}
            onSubmitForm={onSubmitForm}
          />
        </Col>
      </Row>
    </div>
  );
};

export default ForgotPassword;
