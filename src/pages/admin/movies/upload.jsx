import React from "react";

import { getPendingMovies } from "@/helpers/api/data/admin";

import UploadPage from "@/components/admin/UploadPage";
import { moviesPageSideBarItems } from ".";
import Layout from "../../../components/admin/Layout";
import { getProgressData } from "../../../helpers/api/data/movie";

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

export async function getServerSideProps(context) {
  const { id } = context.query;

  if (!id) {
    return {
      props: {},
    };
  }

  const pending = await getPendingMovies(id);
  const progress = await getProgressData(id);
  console.log(progress);
  return {
    props: pending
      ? {
          pending: { ...pending, progress },
        }
      : {},
  };
}

export default Upload;
