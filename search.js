/**
 * MeroX Search Module
 * Powered by MeroXCatalog in products.js
 */

(function (global) {
  "use strict";

  const MeroXSearch = {
    query: function (term) {
      if (global.MeroXCatalog) {
        return global.MeroXCatalog.search(term);
      }
      return [];
    },
    getByCategory: function (category) {
      if (global.MeroXCatalog) {
        return global.MeroXCatalog.getByCategory(category);
      }
      return [];
    }
  };

  global.MeroXSearch = MeroXSearch;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = MeroXSearch;
  }
})(typeof window !== "undefined" ? window : globalThis);