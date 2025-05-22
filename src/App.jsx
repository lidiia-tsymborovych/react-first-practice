/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    categFromServer => categFromServer.id === product.categoryId,
  );
  const user = usersFromServer.find(
    userFromServer => userFromServer.id === category.ownerId,
  );

  return {
    ...product,
    category,
    user,
  };
});

const OWNERS = ['All', ...usersFromServer.map(user => user.name)];
const COLUMNS = ['ID', 'PRODUCT', 'CATEGORY', 'USER'];

const CATEGORIES = [
  'All',
  ...categoriesFromServer.map(category => category.title),
];

const ORDER = {
  asc: 1,
  desc: 2,
  reset: 0,
};

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

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              {OWNERS.map(owner => (
                <a
                  key={owner}
                  data-cy="FilterUser"
                  href="#/"
                  className={ownerFilter === owner ? 'is-active' : ''}
                  onClick={() => setOwnerFilter(owner)}
                >
                  {owner}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => setQuery(event.target.value.trimStart())}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              {CATEGORIES.map(category => (
                <a
                  key={category}
                  href="#/"
                  data-cy="AllCategories"
                  className={`button mr-2 my-1 ${
                    category === CATEGORIES[0] &&
                    selectedCategories.length === 0
                      ? 'is-success'
                      : ''
                  } ${selectedCategories.includes(category) ? 'is-info' : ''}`}
                  onClick={() => {
                    handleClickFilterByCategoryButton(category);
                  }}
                >
                  {category}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className={`button is-link is-fullwidth ${query || ownerFilter !== OWNERS[0] ? 'is-outlined' : ''} `}
                onClick={() => {
                  setQuery('');
                  setOwnerFilter(OWNERS[0]);
                  setSelectedCategories([]);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!filteredProducts.length && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              {filteredProducts.length > 0 && (
                <tr>
                  {COLUMNS.map(col => (
                    <th key={col}>
                      <span className="is-flex is-flex-wrap-nowrap">
                        {col}
                        <a
                          href="#/"
                          onClick={() => {
                            setSortParams(col);
                            setOrder(order < 2 ? order + 1 : 0);
                          }}
                        >
                          <span className="icon">
                            <i
                              data-cy="SortIcon"
                              className={`fas ${
                                sortParams === col
                                  ? order === ORDER.asc
                                    ? 'fa-sort-up'
                                    : order === ORDER.desc
                                      ? 'fa-sort-down'
                                      : 'fa-sort'
                                  : 'fa-sort'
                              }`}
                            />
                          </span>
                        </a>
                      </span>
                    </th>
                  ))}
                </tr>
              )}
            </thead>

            <tbody>
              {sortedProducts.map(product => {
                const { user, category } = product;

                return (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{`${category.icon} ${category.title}`}</td>

                    <td
                      data-cy="ProductUser"
                      className={
                        user.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                      }
                    >
                      {user.name}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
