import React from "react";
import { usersPageSideBarItems } from ".";
import Layout from "../components/Layout";

function manage() {
  return <div>manage user</div>;
}

manage.getLayout = function getLayout(page) {
  return (
    <Layout pageTitle="Manage User" sideBarItems={usersPageSideBarItems}>
      {page}
    </Layout>
  );
};

export default manage;
