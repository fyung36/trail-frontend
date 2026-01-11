"use client";
import { useState, useRef, ChangeEvent } from "react";
import OrgMember from "@/components/OrgMembers/OrgMember";
import { Form } from "antd";
import { IOrgMemeberForm } from "@/types/settings";
import useFilterForm from "@/utils/CustomHooks/useFilterForm";
import useModal from "@/utils/CustomHooks/useModal";
import AddMemberModal from "@/components/AllModals/AddMemberModal";

const OrgMemberLogic = () => {
  const { filterText, filterInputChange } = useFilterForm();
  const [isModalVisible, showModal, handleCancel] = useModal();
  const [orgForm] = Form.useForm();
  const [orgUserForm, setOrgUserForm] = useState<IOrgMemeberForm>({
    firstName: "",
    lastName: "",
    email: "",
    roleId: "",
    entity: "",
  });
  const onChangeOrgUserInput = (e: ChangeEvent<HTMLInputElement>) => {
    setOrgUserForm({ ...orgUserForm, [e.target.name]: e.target.value });
  };
  const onChooseOrgUserRole = (value: string) => {
    setOrgUserForm({ ...orgUserForm, roleId: value });
  };
  const onSubmitOrgUserForm = () => {
    if (
      orgUserForm.firstName === "" ||
      orgUserForm.lastName === "" ||
      orgUserForm.email === "" ||
      orgUserForm.roleId === "" ||
      orgUserForm.entity === ""
    ) {
      console.log("hello");
    } else {
      orgForm.resetFields();
    }
  };

  return (
    <>
      <OrgMember
        filterInputChange={filterInputChange}
        filterText={filterText}
        showModal={showModal}
      />

      <AddMemberModal
        orgForm={orgForm}
        orgUserForm={orgUserForm}
        onChangeOrgUserInput={onChangeOrgUserInput}
        onSubmitOrgUserForm={onSubmitOrgUserForm}
        onChooseOrgUserRole={onChooseOrgUserRole}
        handleCancel={handleCancel}
        isModalVisible={isModalVisible}
      />
    </>
  );
};

export default OrgMemberLogic;
