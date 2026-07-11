/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as catalog from "../catalog.js";
import type * as domain_catalog from "../domain/catalog.js";
import type * as domain_hybridRecommendation from "../domain/hybridRecommendation.js";
import type * as domain_production from "../domain/production.js";
import type * as domain_recommendations from "../domain/recommendations.js";
import type * as domain_seedCatalog from "../domain/seedCatalog.js";
import type * as domain_types from "../domain/types.js";
import type * as production from "../production.js";
import type * as recommend from "../recommend.js";
import type * as seed from "../seed.js";
import type * as validators from "../validators.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  catalog: typeof catalog;
  "domain/catalog": typeof domain_catalog;
  "domain/hybridRecommendation": typeof domain_hybridRecommendation;
  "domain/production": typeof domain_production;
  "domain/recommendations": typeof domain_recommendations;
  "domain/seedCatalog": typeof domain_seedCatalog;
  "domain/types": typeof domain_types;
  production: typeof production;
  recommend: typeof recommend;
  seed: typeof seed;
  validators: typeof validators;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
