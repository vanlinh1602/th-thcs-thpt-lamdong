/* eslint-disable @typescript-eslint/ban-ts-comment */
import type { ConvertedToObjectType, TranslationJsonType } from './types';

export const translations: ConvertedToObjectType<TranslationJsonType> =
  {} as any;

export const convertLanguageJsonToObject = (
  json: any,
  objToConvertTo = translations,
  current?: string
) => {
  Object.keys(json).forEach((key) => {
    const currentLookupKey = current ? `${current}.${key}` : key;
    if (typeof json[key] === 'object') {
      // @ts-expect-error
      objToConvertTo[key] = {};
      convertLanguageJsonToObject(
        json[key],
        // @ts-expect-error
        objToConvertTo[key],
        currentLookupKey
      );
    } else {
      // @ts-expect-error
      objToConvertTo[key] = currentLookupKey;
    }
  });
};
