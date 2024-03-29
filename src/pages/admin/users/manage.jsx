import React from "react";
import { usersPageSideBarItems } from ".";
import { getDetailedUserData } from "../../../helpers/api/data/admin";
import UsersTable from "../../../components/admin/UsersTable";
import Layout from "../../../components/admin/Layout";

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
  const userData = await getDetailedUserData();

  return {
    props: {
      userData: userData.data || null,
    },
  };
}

export default manage;
