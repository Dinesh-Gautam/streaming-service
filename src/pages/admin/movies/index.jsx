import React from "react";
import Layout from "../components/Layout";

function MoviePage() {
  return <div>MoviePage</div>;
}

const moviesPageSideBarItems = [
  {
    icon: "activity",
    value: "Overview",
    href: "/admin/movies",
  },
];

MoviePage.getLayout = function getLayout(page) {
  return (
    <Layout sideBarItems={moviesPageSideBarItems} pageTitle="Movies">
      {page}
    </Layout>
  );
};

export default MoviePage;
