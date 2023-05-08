/*
 * The Every.org API uses Cloudinary to serve images.
 * Images can be adjusted and transformed with options.
 *
 * @see https://cloudinary.com/documentation/image_transformations
 */
export const EVERYORG_IMAGE_URL =
    "https://res.cloudinary.com/everydotorg/image/upload/";
export const EVERYORG_IMAGE_OPTIONS = "f_auto,c_limit,w_3840,q_auto/";

/*
 * Theme colors for the skeleton loading animation.
 * Variants are intended for different background colors.
 *
 * @usage <Skeleton {...DEFAULT_SKELETON_THEME} />
 */
export const DEFAULT_SKELETON_THEME = {
    baseColor: "#e5d391",
    highlightColor: "#eddfa1",
};
export const LIGHT_SKELETON_THEME = {
    baseColor: "#efe8c6",
    highlightColor: "#f4eecd",
};
