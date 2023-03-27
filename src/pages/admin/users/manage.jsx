import React from "react";
import { usersPageSideBarItems } from ".";
import { getDetailedUserData } from "../../../helpers/api/data/admin";
import Layout from "../components/Layout";
import UsersTable from "../components/UsersTable";
function manage({ userData }) {
  return <UsersTable userData={userData} />;
}

manage.getLayout = function getLayout(page) {
  return (
    <Layout pageTitle="Manage User" sideBarItems={usersPageSideBarItems}>
      {page}
    </Layout>
  );
};

export async function getServerSideProps() {
  const userData = getDetailedUserData().data;
  console.log(userData);
  return {
    props: {
      userData: userData || null,
    },
  };
}

export default manage;
