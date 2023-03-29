import React from "react";

import { getPendingMovies } from "@/helpers/api/data/admin";

import UploadPage from "@/components/admin/UploadPage";
import Layout from "../components/Layout";
import { moviesPageSideBarItems } from ".";

function Upload({ pending }) {
  // console.log(pending);
  return <UploadPage pending={pending} />;
}

Upload.getLayout = function getLayout(page) {
  return (
    <Layout sideBarItems={moviesPageSideBarItems} pageTitle={"Upload"}>
      {page}
    </Layout>
  );
};

export function getServerSideProps(context) {
  const { id } = context.query;

  if (!id) {
    return {
      props: {},
    };
  }

  const pending = getPendingMovies(id);
  return {
    props: pending
      ? {
          pending,
        }
      : {},
  };
}

export default Upload;
