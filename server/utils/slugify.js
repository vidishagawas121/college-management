const slugify = require('slugify');

const generateSlug = (text) => {
  return slugify(text || '', {
    lower: true,
    strict: true,
    trim: true,
    remove: /[*+~.()'"!:@]/g
  });
};

module.exports = generateSlug;
