/* eslint-disable no-nested-ternary */
import { COLUMNS, ORDER } from '../constants';

export const TableBlockContainer = ({
  filteredProducts,
  sortedProducts,
  onSortClick,
  sortParams,
  order,
}) => {
  return (
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
                        onSortClick(col);
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
  );
};
