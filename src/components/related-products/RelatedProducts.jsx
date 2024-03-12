import React, { useState, useEffect, useCallback } from 'react';
import RelatedList from './RelatedList.jsx';
import RelatedComparison from './RelatedComparison.jsx';
import CompareModal from './util/CompareModal.jsx';
import { getProduct, getRelatedProducts, getProductStyles } from './util/relatedModels.js';

function RelatedProducts({ productId, setProductId }) {
  // To Do:
  // Create a useState that will be made for Related Products and Outfit
  // Give those useStates to the RelatedList to generate the carousel
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedProductsStyles, setRelatedProductsStyles] = useState([]);
  const [comparisonModal, setComparisonModal] = useState(false);
  const [comparedProduct, setComparedProduct] = useState({});

  const populateRelatedProductData = async () => {
    const relatedProductIDs = await getRelatedProducts(productId);
    const uniqueRelatedProductIds = relatedProductIDs.data.filter(
      (value, index, array) => array.indexOf(value) === index,
    );
    const uniqueRelatedProducts = await Promise.all(uniqueRelatedProductIds.map(
      (id) => getProduct(id),
    ));
    setRelatedProducts(uniqueRelatedProducts.map(
      (uniqueRelatedProduct) => uniqueRelatedProduct.data,
    ));
  };

  const populateRelatedStylesData = async () => {
    const relatedProductIDs = await getRelatedProducts(productId);
    const uniqueRelatedProductIds = relatedProductIDs.data.filter(
      (value, index, array) => array.indexOf(value) === index,
    );
    const defaultStyles = await Promise.all(uniqueRelatedProductIds.map(
      (id) => getProductStyles(id),
    ));
    setRelatedProductsStyles(defaultStyles.map(
      (defaultStyle) => defaultStyle.data.results[0].photos[0].thumbnail_url,
    ));
  };

  useEffect(() => {
    populateRelatedProductData();
    populateRelatedStylesData();
  }, [productId])

  const relatedCardClickHandler = useCallback((id) => {
    setProductId(id);
  }, []);

  const actionButtonHandler = useCallback((product) => {
    setComparedProduct(product);
    setComparisonModal(true);
  }, []);

  return (
    <div>
      {/* Related Items Section */}
      <h2>Related Products</h2>
      <RelatedList
        relatedProducts={relatedProducts}
        relatedProductStyles={relatedProductsStyles}
        relatedCardClickHandler={relatedCardClickHandler}
        actionButtonHandler={actionButtonHandler}
        isYourOutfit={false}
      />
      {/* This will be for the Outfit Section */}
      <h2>Given Outfit</h2>
      {/* <RelatedList /> */}
      {
        comparisonModal
        && (
          <CompareModal>
            <RelatedComparison
              product={productId}
              comparedProduct={comparedProduct}
              setComparisonModal={setComparisonModal}
            />
          </CompareModal>
        )
      }
    </div>
  );
}

export default RelatedProducts;
