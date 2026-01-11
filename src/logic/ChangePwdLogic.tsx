"use client";
import { useState, ChangeEvent } from "react";
import ChangePwd from "@/components/ChangePwd";
import { IChangePwdForm } from "@/types/settings";

const ChangePwdLogic = () => {
  const [formData, setFormData] = useState<IChangePwdForm>({
    verifyPwd: "",
    newPwd: "",
    confirmPwd: "",
  });

  const onChangePwdInput = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onSubmitForm = () => {};
  return (
    <>
      <ChangePwd
        onChangePwdInput={onChangePwdInput}
        onSubmitForm={onSubmitForm}
        formData={formData}
      />
    </>
  );
};

export default ChangePwdLogic;
