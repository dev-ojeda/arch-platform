/** @type {import("syncpack").RcFile} */
module.exports = {
  versionGroups: [
    {
      label: "Use workspace protocol internally",
      dependencies: ["$LOCAL"],
      dependencyTypes: ["dependencies", "devDependencies", "peerDependencies"],
      pinVersion: "workspace:*"
    }
  ],

  semverGroups: [
    {
      label: "Pin internal tooling",
      dependencies: [
        "typescript",
        "vitest",
        "turbo",
        "eslint",
        "prettier",
        "tsup"
      ],
      range: ""
    }
  ],

  sortAz: [
    "name",
    "version",
    "scripts",
    "dependencies",
    "devDependencies",
    "peerDependencies"
  ]
};