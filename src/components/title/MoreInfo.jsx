import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FormatParagraph, checkIfStringIsValidUrl } from "../../utils";
import { useData } from "../../context/stateContext";
import styles from "./moreInfo.module.scss";
import { getImageUrl } from "../../tmdbapi/tmdbApi";
function MoreInfo({ result, id, media_type }) {
  const filteredResults = Object.entries(result).filter(
    ([key, value]) =>
      (value || value?.length) &&
      (key === "first_air_date" ||
        key === "release_date" ||
        key === "original_name" ||
        key === "languages" ||
        key === "original_title" ||
        key === "original_language" ||
        key === "production_countries" ||
        key === "spoken_languages" ||
        key === "status" ||
        key === "tagline" ||
        key === "seasons" ||
        key === "homepage" ||
        key === "revenue")
  );
  console.log(Object.entries(result));
  console.log(filteredResults);
  const { moreInfoData, setMoreInfoData } = useData();
  const [moreInfo, setMoreInfo] = useState(null);
  useEffect(() => {
    const alreadyExists = moreInfoData.find(
      (e) => e.id === id && e.media_type === media_type
    );

    if (alreadyExists) {
      setMoreInfo(alreadyExists.data);

      return;
    }

    async function fetchMoreInfo() {
      console.log("fetching more Info");
      const data = await fetch(
        "/api/tmdb/more?id=" +
          id +
          "&media_type=" +
          media_type +
          "&r=" +
          "reviews,watch_providers,external_ids"
      ).then((e) => e.json());
      if (data.success) {
        setMoreInfo(data.data);
        console.log(data);
        setMoreInfoData((prev) => [
          ...prev,
          { id, media_type, data: data.data },
        ]);
      } else {
        alert("some error occured");
      }
    }

    fetchMoreInfo();
  }, []);

  useEffect(() => {
    console.log(moreInfo);
  }, [moreInfo]);

  const topReview = moreInfo?.reviews?.results[0];
  return (
    <div className={styles.moreInfoWrapper}>
      <div>
        <h2>Details</h2>
        <div className={styles.detailsContainer}>
          {filteredResults.map(([key, value], index) => {
            return (
              <div className={styles.item} key={index}>
                <span className={styles.key}>{key.replaceAll("_", " ")}: </span>
                <span className={styles.value}>
                  {typeof value === "object" ? (
                    <>
                      {value
                        ?.map((e) => e.english_name || e.name || e)
                        .join(", ")}
                      <span style={{ opacity: 0.5 }}> ({value.length}) </span>
                    </>
                  ) : (
                    checkIfStringIsValidUrl(value)
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div
        className={
          styles.linksContainer +
          (!moreInfo ? " " + styles.moreInfoLoading : "")
        }
      >
        <h2>Links</h2>
        <div className={styles.linksGroup}>
          {moreInfo?.watch_providers.results.IN && (
            <div>
              {moreInfo &&
                moreInfo.watch_providers.results.IN &&
                moreInfo.watch_providers.results.IN[
                  moreInfo.watch_providers.results.IN.flatrate
                    ? "flatrate"
                    : "buy"
                ].map((provider) => (
                  <Link
                    target={"_blank"}
                    key={provider.id}
                    href={moreInfo.watch_providers.results.IN.link}
                  >
                    <div className={styles.linkLogo}>
                      <Image
                        src={getImageUrl(provider.logo_path)}
                        alt={provider.provider_name}
                        height={50}
                        width={50}
                      />
                    </div>
                  </Link>
                ))}
            </div>
          )}
          <div>
            {moreInfo && (
              <Link
                target="_blank"
                href={"https://imdb.com/title/" + moreInfo.external_ids.imdb_id}
              >
                Imdb
              </Link>
            )}
          </div>
        </div>
      </div>
      {moreInfo && moreInfo.reviews.results.length > 0 && (
        <>
          <div className={!moreInfo ? styles.moreInfoLoading : ""}>
            <h2>User Reviews:</h2>
            <div className={styles.reviewContainer}>
              <div className={styles.reviewHeader}>
                <div className={styles.avatar}>
                  {topReview && topReview.author_details.avatar_path && (
                    <Image
                      src={
                        topReview.author_details.avatar_path.startsWith(
                          "/https"
                        )
                          ? topReview.author_details.avatar_path.replace(
                              "/",
                              ""
                            )
                          : getImageUrl(topReview.author_details.avatar_path)
                      }
                      alt="user_pic"
                      width={40}
                      height={40}
                    />
                  )}
                </div>
                <div className={styles.authorInfo}>
                  <h4>{topReview && topReview.author}</h4>
                  <span>{topReview && topReview.author_details.username}</span>
                </div>
              </div>
              <div className={styles.reviewContent}>
                {topReview && <FormatParagraph para={topReview.content} />}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MoreInfo;
