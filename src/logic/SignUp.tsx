"use client";
import { Row, Col, Form } from "antd";
import { useState } from "react";

import StepOne from "@/components/Forms/SignUpForm/StepOne";
import StepTwo from "@/components/Forms/SignUpForm/StepTwo";
import StepThree from "@/components/Forms/SignUpForm/StepThree";
import { UseLocalStorage } from "@/components/FormLocalState";
import SignUpType from "@/components/SignUpType";
import SignUpFooter from "@/components/SignUpFooter";

const SignUp = () => {
  const [step, setStep] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [regType, setRegType] = useState({
    accountType: "",
  });
  const [formData, setFormData] = UseLocalStorage("formData", {
    firstName: "",
    lastName: "",
    email: "",
    altEmail: "",
    phone: 0,
    password: "",
    password2: "",
    accountType: "",
    organisation: {
      name: "",
      type: "",
      website: "",
    },
    terms: false,
  });

  const accountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRegType({ ...regType, accountType: e.target.value });
    setFormData({ ...formData, accountType: e.target.value });
    // canBeSubmitted();
  };
  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };
  const toggleUserType = (name: string) => {
    setIsActive(!isActive);
    setRegType({ ...regType, accountType: name });
  };

  return (
    <div className="auth">
      <Row className="auth__row">
        <Col
          className={`${regType.accountType !== "" ? `signup-row-center` : ""}`}
          xs={{ span: 20 }}
          lg={{ span: 24 }}
        >
          {regType?.accountType === "" ? (
            <SignUpType
              isActive={isActive}
              accountTypeChange={accountTypeChange}
              toggleUserType={toggleUserType}
            />
          ) : (
            <div className="sign-up">
              <Form>
                {(() => {
                  switch (step) {
                    case 1:
                      return (
                        <StepOne
                          step={step}
                          nextStep={nextStep}
                          prevStep={prevStep}
                          formData={formData}
                        />
                      );
                    case 2:
                      return (
                        <StepTwo
                          step={step}
                          nextStep={nextStep}
                          prevStep={prevStep}
                          formData={formData}
                        />
                      );
                    case 3:
                      return (
                        <StepThree
                          step={step}
                          prevStep={prevStep}
                          formData={formData}
                        />
                      );
                    default:
                    //   return null;
                  }
                })()}
              </Form>
              <SignUpFooter />
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default SignUp;
