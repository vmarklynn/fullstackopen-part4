const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes;
  };

  return blogs.reduce(reducer, 0);
};

const favoriteBlog = (blogs) => {
  const mostLikes = blogs.reduce((prev, current) => {
    return prev.likes >= current.likes ? prev : current;
  });
  return mostLikes;
};

const mostBlogs = (blogs) => {
  const authorCount = blogs.reduce((frequency, blog) => {
    frequency[blog.author] = ++frequency[blog.author] || 1;
    return frequency;
  }, {});

  const iterable = Object.entries(authorCount).map((blogger) => ({
    author: blogger[0],
    blogs: blogger[1],
  }));

  const top = iterable.reduce((prev, curr) => {
    return prev.blogs >= curr.blogs ? prev : curr;
  });

  return top;
};

const mostLikes = (blogs) => {
  const likeCount = blogs.reduce((frequency, blog) => {
    frequency[blog.author] = frequency[blog.author] += blog.likes || blog.likes;
    return frequency;
  }, {});

  return likeCount;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
