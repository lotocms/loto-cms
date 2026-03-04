export let statics = [
  {
    prefix: "/public/",
    dir: "public",
    maxAge: 24 * 60 * 60 * 100, // one day
  },
  {
    prefix: "/",
    dir: "public",
    maxAge: 24 * 60 * 60 * 100, // one day
  },
];

export default {
  statics,
};
