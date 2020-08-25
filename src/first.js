// Thanks https://github.com/ungap/promise-any/blob/master/index.js
export const first =
  Promise.any ||
  function($) {
    return new Promise((D, E, A, L) => {
      A = [];
      L = $.map(($, i) => {
        return Promise.resolve($).then(D, function(O) {
          return ((A[i] = O), --L) || E({ errors: A });
        });
      }).length;
    });
  };
