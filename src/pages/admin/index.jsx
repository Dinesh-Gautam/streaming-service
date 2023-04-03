import React from "react";

import App from "./AdminApp";
import Layout from "../../components/admin/Layout";

export default function adminPage() {
  return <App />;
}
export const adminPageSideBarItems = [
  { icon: "activity", value: "Overview", href: "/admin" },
];
adminPage.getLayout = function getLayout(page) {
  return (
    <Layout sideBarItems={adminPageSideBarItems} pageTitle="Admin">
      {page}
    </Layout>
  );
};
