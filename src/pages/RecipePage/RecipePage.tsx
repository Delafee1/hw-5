import { useEffect } from "react";
import React from "react";

import ErrorMessage from "components/ErrorMessage";
import Loader, { LoaderSize } from "components/Loader";
import RecipeStore from "store/RecipeStore";
import { Meta } from "utils/types/meta";
import { useLocalStore } from "utils/useLocalStore";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

import styles from "./RecipePage.module.scss";

const RecipePage: React.FC = () => {
  const recipeStore = useLocalStore(() => new RecipeStore());
  const navigate = useNavigate();
  useEffect(() => {
    recipeStore.getRecipe();
  }, [recipeStore]);

  if (recipeStore.meta === Meta.error) {
    return <ErrorMessage errorText={recipeStore.errorMessage} />;
  }

  return (
    <>
      <Loader
        loading={recipeStore.meta === Meta.loading}
        size={LoaderSize.l}
        className={styles.loader}
      />
      {recipeStore.recipe && (
        <div
          style={{ backgroundImage: `url(${recipeStore.recipe.image})` }}
          className={styles.recipe}
        >
          <button className={styles.recipe__back} onClick={() => navigate(-1)}>
            <span className={styles.recipe__back__arrow}/>
          </button>

          <div className={styles.recipe__content}>
            <span className={styles.recipe__content__line}/>
            <h2 className={styles.recipe__content__title}>
              {recipeStore.recipe.title}
            </h2>
            <div className={styles.recipe__content__numbers}>
              <div className={styles.recipe__content__numbers__minutes}>
                <span className={styles.recipe__content__numbers__minutes__icon}/>           
                <p className={styles.recipe__content__numbers__minutes__text}>
                  {recipeStore.recipe.readyInMinutes} minutes
                </p>
              </div>
              <div className={styles.recipe__content__numbers__likes}>
                <span className={styles.recipe__content__numbers__likes__icon}/>
                <p className={styles.recipe__content__numbers__likes__text}>
                  {recipeStore.recipe.aggregateLikes} likes
                </p>
              </div>
            </div>
            <div
              className={styles.recipe__content__text}
              dangerouslySetInnerHTML={{ __html: recipeStore.recipe.summary }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default observer(RecipePage);
