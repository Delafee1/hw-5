import { useEffect } from "react";
import React from "react";

import Card from "components/Card";
import Loader, { LoaderSize } from "components/Loader";
import MultiDropdown from "components/MultiDropdown";
import Search from "components/Search";
import RecipesStore from "store/RecipesStore";
import { Meta } from "utils/types/meta";
import { useLocalStore } from "utils/useLocalStore";
import cn from "classnames";
import { observer } from "mobx-react-lite";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useSearchParams } from "react-router-dom";

import styles from "./RecipesPage.module.scss";

const RecipesPage: React.FC = () => {
  const recipesStore = useLocalStore(() => new RecipesStore());

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    recipesStore.getRecipesList();
  }, [recipesStore]);

  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    const search = e.target[0].value;
    searchParams.set("search", search);
    setSearchParams(searchParams);
  };

  return (
    <div className={styles.recipes}>
      <div className={styles.recipes__heading}>
        <Search
          onSubmit={handleSearchSubmit}
          className={styles.recipes__heading__search}
        />
        <div className={styles.recipes__heading__row}>
          <div className={styles.recipes__heading__row__results}>
            Total Results: {recipesStore.totalResults}
          </div>
          <MultiDropdown
            className={styles.recipes__heading__row__multidropdown}
          />
        </div>
      </div>
      <Loader
        loading={recipesStore.meta === Meta.loading}
        size={LoaderSize.l}
        className={styles.loader}
      />
      <InfiniteScroll
        className={cn(styles.recipes__cards, {
          [styles.recipes__cards_loading]: recipesStore.meta === Meta.loading,
        })}
        dataLength={recipesStore.recipes.length}
        next={recipesStore.getRecipesList}
        hasMore={true}
        loader={""}
      >
        {recipesStore.recipes.map((recipe, index) => (
          <Link to={`/recipe/?id=${recipe.id}`} key={index}>
            <Card
              image={recipe.image}
              title={recipe.title}
              subtitle={""}
              className={styles.recipes__card}
            />
          </Link>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default observer(RecipesPage);
