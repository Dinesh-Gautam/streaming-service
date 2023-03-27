import React from "react";
import { usersPageSideBarItems } from ".";
import Layout from "../components/Layout";
import UsersTable from "../components/UsersTable";
function manage() {
  return <UsersTable />;
}

manage.getLayout = function getLayout(page) {
  return (
    <Layout pageTitle="Manage User" sideBarItems={usersPageSideBarItems}>
      {page}
    </Layout>
  );
};

export default manage;
