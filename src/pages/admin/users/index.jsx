import React from "react";
import Layout from "../components/Layout";

function Users() {
  return <div>Users</div>;
}

Users.getLayout = function getLayout(page) {
  return (
    <Layout
      pageTitle="Users"
      sideBarItems={[
        { icon: "activity", value: "Overview", href: "/admin/user/overview" },
        {
          icon: "user",
          value: "Manage Users",
          href: "/admin/user/manage",
        },
      ]}
    >
      {page}
    </Layout>
  );
};
export default Users;
