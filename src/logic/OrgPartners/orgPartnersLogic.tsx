"use client";
import { useState } from "react";
import OrgPartner from "@/components/OrgPartners/OrgPartner";
import { InvitePartnerFormData } from "@/types/settings";
import useModal from "@/utils/CustomHooks/useModal";
import AddPartnersModal from "@/components/AllModals/AddPartnersModal";
import useFilterForm from "@/utils/CustomHooks/useFilterForm";

const OrgPartnersLogic = () => {
  const [isModalVisible, showModal, handleCancel] = useModal();
  const { filterText, filterInputChange } = useFilterForm();
  const [partners, setPartner] = useState<InvitePartnerFormData[]>([]);
  const [formData, setFormData] = useState<InvitePartnerFormData>({
    email: "",
    role: "32", //viewer by default for organisation partners.. (i.e 32 is viewers' id)
    name: "",
  });

  const addPartners = () => {
    setPartner([
      ...partners,
      {
        email: "",
        role: "",
        name: "",
      },
    ]);
  };

  const onChangeInput = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitForm = () => {
    console.log("submit");
  };

  return (
    <>
      <OrgPartner
        filterInputChange={filterInputChange}
        filterText={filterText}
        showModal={showModal}
      />

      <AddPartnersModal
        partners={partners}
        onSubmitForm={onSubmitForm}
        onChangeInput={onChangeInput}
        formData={formData}
        addPartners={addPartners}
        handleCancel={handleCancel}
        isModalVisible={isModalVisible}
      />
    </>
  );
};

export default OrgPartnersLogic;
