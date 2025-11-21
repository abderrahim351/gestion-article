// src/modules/auth/permissions.js
function canManageRoles(user) {
  if (!user) return false;
  return user.role === 'ADMIN';
}

function canEditArticle(user, article) {
  if (!user || !article) return false;

  // ADMIN & EDITOR peuvent tout modifier
  if (user.role === 'ADMIN' || user.role === 'EDITOR') return true;

  // WRITER peut modifier seulement ses articles
  if (user.role === 'WRITER') {
    return article.author.toString() === user.id.toString();
  }

  // READER ne peut rien modifier
  return false;
}

module.exports = {
  canManageRoles,
  canEditArticle,
};
