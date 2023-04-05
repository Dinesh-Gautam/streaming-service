import React from "react";
import { getAllUsersInfo } from "../../../helpers/api/data/admin";
import UsersInfo from "../../../components/admin/UsersInfo";
import Layout from "../../../components/admin/Layout";

function Users({ userData }) {
  return <UsersInfo userData={userData} />;
}

export const usersPageSideBarItems = [
  {
    icon: "activity",
    value: "Overview",
    href: "/admin/users",
  },
  {
    icon: "user",
    value: "Manage Users",
    href: "/admin/users/manage",
  },
];

Users.getLayout = function getLayout(page) {
  return (
    <Layout pageTitle="Users" sideBarItems={usersPageSideBarItems}>
      {page}
    </Layout>
  );
};

export async function getServerSideProps() {
  const userData = await getAllUsersInfo();

  return {
    props: {
      userData: userData.data || null,
    },
  };
}
export default Users;
