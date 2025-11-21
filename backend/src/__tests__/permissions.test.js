const { canManageRoles, canEditArticle } = require('../modules/auth/permissions');

describe('Permissions - rôles', () => {
  it('ADMIN peut gérer les rôles', () => {
    const admin = { id: '1', role: 'ADMIN' };
    expect(canManageRoles(admin)).toBe(true);
  });

  it('EDITOR / WRITER / READER ne peuvent pas gérer les rôles', () => {
    const editor = { id: '2', role: 'EDITOR' };
    const writer = { id: '3', role: 'WRITER' };
    const reader = { id: '4', role: 'READER' };

    expect(canManageRoles(editor)).toBe(false);
    expect(canManageRoles(writer)).toBe(false);
    expect(canManageRoles(reader)).toBe(false);
    expect(canManageRoles(null)).toBe(false);
  });
});

describe('Permissions - articles', () => {
  const articleOwnerId = 'abc123';

  it('ADMIN peut éditer tous les articles', () => {
    const admin = { id: '1', role: 'ADMIN' };
    const article = { author: articleOwnerId };
    expect(canEditArticle(admin, article)).toBe(true);
  });

  it('WRITER peut éditer seulement ses propres articles', () => {
    const writerOwner = { id: articleOwnerId, role: 'WRITER' };
    const writerOther = { id: 'other', role: 'WRITER' };
    const article = { author: articleOwnerId };

    expect(canEditArticle(writerOwner, article)).toBe(true);
    expect(canEditArticle(writerOther, article)).toBe(false);
  });

  it('READER ne peut pas éditer', () => {
    const reader = { id: '6', role: 'READER' };
    const article = { author: articleOwnerId };

    expect(canEditArticle(reader, article)).toBe(false);
  });
});
