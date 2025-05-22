/* eslint-disable import/no-duplicates */

import React, { useState } from 'react';
import './App.scss';

import {
  products,
  OWNERS,
  CATEGORIES,
  COLUMNS,
  ORDER,
} from './components/constants';

import { TableBlockContainer } from './components/TableContainer';
import { PanelBlocksContainer } from './components/PanelBlocksContainer';

export const App = () => {
  const [ownerFilter, setOwnerFilter] = useState(OWNERS[0]);
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [order, setOrder] = useState(ORDER.reset);
  const [sortParams, setSortParams] = useState(null);

  const getFilteredProducts = (ownerFilterParam, newQuery, categories) => {
    let filteredProducts = products;

    if (newQuery) {
      const queryNormalised = newQuery.trim().toLowerCase();

      filteredProducts = filteredProducts.filter(product => {
        const productNameNormalised = product.name.trim().toLowerCase();

        return productNameNormalised.includes(queryNormalised);
      });
    }

    if (ownerFilterParam !== OWNERS[0]) {
      filteredProducts = filteredProducts.filter(
        product => product.user.name === ownerFilterParam,
      );
    }

    if (!categories.length) {
      return filteredProducts;
    }

    filteredProducts = filteredProducts.filter(product => {
      return categories.includes(product.category.title);
    });

    return filteredProducts;
  };

  const filteredProducts = getFilteredProducts(
    ownerFilter,
    query,
    selectedCategories,
  );

  const getSortedProducts = (productsToSort, params, orderToSort) => {
    if (!orderToSort || !params) {
      return productsToSort;
    }

    let sortedProducts = [...productsToSort];

    sortedProducts = sortedProducts.sort((product1, product2) => {
      switch (true) {
        case params === COLUMNS[0]:
          return product1.id - product2.id;
        case params === COLUMNS[1]:
          return product1.name.localeCompare(product2.name);
        case params === COLUMNS[2]:
          return product1.category.title.localeCompare(product2.category.title);
        case params === COLUMNS[3]:
          return product1.user.name.localeCompare(product2.user.name);
        default:
          return null;
      }
    });

    if (orderToSort === ORDER.desc) {
      return sortedProducts.reverse();
    }

    return sortedProducts;
  };

  const sortedProducts = getSortedProducts(filteredProducts, sortParams, order);

  const handleSortByParam = col => {
    setSortParams(col);
    setOrder(order < 2 ? order + 1 : 0);
  };

  const handleClickFilterByCategoryButton = category => {
    if (category === CATEGORIES[0]) {
      setSelectedCategories([]);

      return;
    }

    setSelectedCategories(currentSelectedCategories => {
      if (currentSelectedCategories.includes(category)) {
        return currentSelectedCategories.filter(c => c !== category);
      }

      return [...currentSelectedCategories, category];
    });
  };

  const handleInputByQuery = event => setQuery(event.target.value.trimStart());
  const handleResetAllButton = () => {
    setQuery('');
    setOwnerFilter(OWNERS[0]);
    setSelectedCategories([]);
  };

  const handleClearButton = () => setQuery('');
  const handleFilterByUserButton = owner => setOwnerFilter(owner);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <PanelBlocksContainer
          query={query}
          ownerFilter={ownerFilter}
          selectedCategories={selectedCategories}
          handleClickFilterByCategoryButton={handleClickFilterByCategoryButton}
          onChangeQuery={handleInputByQuery}
          onResetAll={handleResetAllButton}
          onClearButton={handleClearButton}
          onFilterByUserButton={handleFilterByUserButton}
        />

        <TableBlockContainer
          filteredProducts={filteredProducts}
          sortedProducts={sortedProducts}
          sortParams={sortParams}
          order={order}
          onSortClick={handleSortByParam}
        />
      </div>
    </div>
  );
};
