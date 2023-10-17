export const LISTINGPAGE_ACTIONS = {
  FETCH_LISTING: 'FETCH_LISTING',
  FETCHED_LISTING: 'FETCHED_LISTING',
  FAILED_FETCH_LISTING: 'FAILED_FETCH_LISTING',
};

export const sortByData = [
  {title: 'Popularity', orderBy: 'popularity', orderWay: 'desc'},
  {title: 'Price - Low to High', orderBy: 'price', orderWay: 'asc'},
  {title: 'Price - High to Low', orderBy: 'price', orderWay: 'desc'},
];
