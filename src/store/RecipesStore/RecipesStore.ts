import rootStore from "store/RootStore";
import { API_KEY } from "utils/constants/ApiKey";
import { Meta } from "utils/types/meta";
import { ILocalStore } from "utils/useLocalStore";
import axios from "axios";
import {
  action,
  computed,
  IReactionDisposer,
  makeObservable,
  observable,
  reaction,
  runInAction,
} from "mobx";
import { ParsedQs } from "qs";

type RecipeListItem = {
  id: number;
  image: string;
  title: string;
};

type PrivateFields = "_recipes" | "_meta" | "_totalResults";

export default class RecipesStore implements ILocalStore {
  private _meta: Meta = Meta.initial;
  private _recipes: RecipeListItem[] = [];
  private _offset: number = 1;
  private _totalResults: number = 0;

  constructor() {
    makeObservable<RecipesStore, PrivateFields>(this, {
      _meta: observable,
      _recipes: observable.ref,
      _totalResults: observable,
      totalResults: computed,
      meta: computed,
      recipes: computed,
      getRecipesList: action,
    });
  }

  get recipes(): RecipeListItem[] {
    return this._recipes;
  }

  get meta(): Meta {
    return this._meta;
  }

  get totalResults(): number {
    return this._totalResults;
  }

  getRecipesList = async (
    category: string | string[] | ParsedQs | ParsedQs[] | undefined = "",
    search: string | string[] | ParsedQs | ParsedQs[] | undefined = "",
    reset: boolean = false
  ) => {
    if (rootStore.query.getParam("search") !== undefined) {
      search = `&query=${rootStore.query.getParam("search")}`;
    }
    if (rootStore.query.getParam("categories") !== undefined) {
      category = `&type=${rootStore.query.getParam("categories")}`;
    }
    if (reset) {
      this._offset = 1;
    }
    try {
      const result = await axios({
        method: "get",
        url: `https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&offset=${this._offset}${category}${search}`,
      });

      runInAction(() => {
        if (reset === true) {
          this._recipes = [];
        }
        this._meta = Meta.success;
        this._recipes = this._recipes.concat(result.data.results);
        this._offset = this._offset + result.data.results.length;
        this._totalResults = result.data.totalResults;
      });
    } catch (e) {
      runInAction(() => {
        this._meta = Meta.error;
      });
    }
  };

  destroy(): void {
    this._qpCategoryReaction();
  }

  private readonly _qpCategoryReaction: IReactionDisposer = reaction(
    () =>
      rootStore.query.getParam("search") ||
      rootStore.query.getParam("categories"),
    () => {
      this.getRecipesList(
        rootStore.query.getParam("categories"),
        rootStore.query.getParam("search"),
        true
      );
    }
  );
}
