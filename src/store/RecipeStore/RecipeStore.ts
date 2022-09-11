import rootStore from "store/RootStore";
import { API_KEY } from "utils/constants/ApiKey";
import { Meta } from "utils/types/meta";
import { ILocalStore } from "utils/useLocalStore";
import axios from "axios";
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { ParsedQs } from "qs";

type Recipe = {
  id: number;
  image: string;
  title: string;
  summary: string;
  readyInMinutes: number;
  aggregateLikes: number;
};

type PrivateFields = "_recipe" | "_meta" | "_errorMessage";

export default class RecipeStore implements ILocalStore {
  private _meta: Meta = Meta.initial;
  private _recipe: Recipe | null = null;
  private _errorMessage: string = "";

  constructor() {
    makeObservable<RecipeStore, PrivateFields>(this, {
      _meta: observable,
      _recipe: observable.ref,
      _errorMessage: observable,
      recipe: computed,
      meta: computed,
      errorMessage: computed,
      getRecipe: action,
    });
  }

  get recipe(): Recipe | null {
    return this._recipe;
  }

  get meta(): Meta {
    return this._meta;
  }

  get errorMessage(): string {
    return this._errorMessage;
  }

  getRecipe = async (
    id:
      | string
      | string[]
      | ParsedQs
      | ParsedQs[]
      | undefined = rootStore.query.getParam("id")
  ) => {
    this._meta = Meta.loading;
    try {
      const result = await axios({
        method: "get",
        url: `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`,
      });
      if (result) {
        runInAction(() => {
          this._meta = Meta.success;
          this._recipe = result.data;
        });
      }
    } catch (e) {
      runInAction(() => {
        if (e instanceof Error) {
          this._meta = Meta.error;
          this._errorMessage = e.message;
        }
      });
    }
  };

  destroy(): void {}
}
