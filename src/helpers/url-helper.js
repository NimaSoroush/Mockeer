const removeLastDirectoryPartOfUrl = (url) => {
  const urlArray = url.split('/');
  urlArray.pop();
  return (urlArray.join('/'));
};


module.exports = { removeLastDirectoryPartOfUrl };
