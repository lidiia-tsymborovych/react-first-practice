import usersFromServer from '../api/users';
import categoriesFromServer from '../api/categories';
import productsFromServer from '../api/products';

export const OWNERS = ['All', ...usersFromServer.map(user => user.name)];
export const COLUMNS = ['ID', 'PRODUCT', 'CATEGORY', 'USER'];

export const CATEGORIES = [
  'All',
  ...categoriesFromServer.map(category => category.title),
];

export const ORDER = {
  asc: 1,
  desc: 2,
  reset: 0,
};

export const products = productsFromServer.map(product => {
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
