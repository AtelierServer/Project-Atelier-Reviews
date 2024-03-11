import React, { useState, useEffect } from 'react';
import RelatedCard from './RelatedCard.jsx';
import './lib/relatedProducts.css';

function RelatedList({
  relatedProducts, relatedProductStyles, relatedCardClickHandler, actionButtonHandler,
}) {
  // console.log(relatedProductStyles, 'default index')
  return (
    <div className="related-products-container">
      {relatedProducts.map((product, index) => (
        <div className="related-card" key={product.id}>
          <RelatedCard
            product={relatedProducts[index]}
            style={relatedProductStyles[index]}
            relatedCardClickHandler={relatedCardClickHandler}
            actionButtonHandler={actionButtonHandler}
          />
        </div>
      ))}
    </div>
  );
}

export default RelatedList;
