"use client";
import { useState } from "react";
import ProfileRead from "@/components/Profile/ProfileDetail";
import EditProfile from "@/components/Profile/EditProfile";

const ProfileDetails = () => {
  const [editProfile, setEditProfile] = useState(false);

  const onClickEdit = () => {
    setEditProfile(true);
  };
  return (
    <>
      {editProfile ? (
        <EditProfile />
      ) : (
        <ProfileRead onClickEdit={onClickEdit} />
      )}
    </>
  );
};

export default ProfileDetails;
