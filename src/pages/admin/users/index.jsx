import React from "react";
import { getAllUsersInfo } from "../../../helpers/api/data/admin";
import Layout from "../components/Layout";
import UsersInfo from "../components/UsersInfo";

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
  const userData = getAllUsersInfo().data;

  return {
    props: {
      userData: userData || null,
    },
  };
}
export default Users;
