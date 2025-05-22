import { OWNERS, CATEGORIES } from '../constants';

export const PanelBlocksContainer = ({
  query,
  ownerFilter,
  selectedCategories,
  handleClickFilterByCategoryButton,
  onChangeQuery,
  onResetAll,
  onClearButton,
  onFilterByUserButton,
}) => {
  return (
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
              onClick={() => onFilterByUserButton(owner)}
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
              onChange={onChangeQuery}
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
                  onClick={onClearButton}
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
                category === CATEGORIES[0] && selectedCategories.length === 0
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
            onClick={onResetAll}
          >
            Reset all filters
          </a>
        </div>
      </nav>
    </div>
  );
};
