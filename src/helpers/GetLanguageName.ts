export const getLanguageName = (code: string) => new Intl.DisplayNames(['en'], { type: 'language' }).of(code);
