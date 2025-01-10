class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1A) Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // console.log(req.query); // { duration: '5', difficulty: 'easy', sort: '2', limit: '10' }
    // console.log(queryObj); // { duration: '5', difficulty: 'easy' }

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj); // { duration: { gte: '5' }, difficulty: 'easy' }
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr)); //{ duration: { '$gte': '5' }, difficulty: 'easy' }

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    // 2) Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy); // sort('price ratingsAverage')
    } else {
      this.query = this.query.sort('-createdAt'); // decending
    }

    return this;
  }

  limitFields() {
    // 3) Field limiting (send just some fields in the respond)
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // excluding __v in the respond
    }

    return this;
  }

  paginate() {
    // 4) Pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // page=2&limit=10 is 1-10 page1, 11-20 page2, 21-30 page3
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
