import React from "react";
import Layout from "../components/Layout";

function Users() {
  return <div>Users</div>;
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
export default Users;
