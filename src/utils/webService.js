import * as appConfig from '../../appConfig';

const getDefaultV3Url = () => String(appConfig.API_ENDPOINT_V3 ?? '').trim();

const getDefaultParts = () => {
  try {
    const parsedUrl = new URL(getDefaultV3Url());
    const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);

    return {
      protocol: parsedUrl.protocol || 'http:',
      pathname: parsedUrl.pathname,
      filename: pathSegments[pathSegments.length - 1] || '',
    };
  } catch (error) {
    return {
      protocol: 'http:',
      pathname: '',
      filename: '',
    };
  }
};

const ensureProtocol = (value, protocol) => {
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(value)) {
    return value;
  }

  if (value.startsWith('//')) {
    return `${protocol}${value}`;
  }

  return `${protocol}//${value}`;
};

export const normalizeWebServiceUrl = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  const trimmedValue = String(value).trim();
  if (!trimmedValue) {
    return '';
  }

  const { protocol, pathname: defaultPathname, filename } = getDefaultParts();

  try {
    const parsedUrl = new URL(ensureProtocol(trimmedValue, protocol));
    const sanitizedPath = (parsedUrl.pathname || '').replace(/\/+$/, '');

    if (!sanitizedPath || sanitizedPath === '/') {
      parsedUrl.pathname = defaultPathname || parsedUrl.pathname;
    } else if (!/\.dll$/i.test(sanitizedPath) && filename) {
      parsedUrl.pathname = `${sanitizedPath}/${filename}`.replace(/\/+/g, '/');
    }

    return parsedUrl.toString();
  } catch (error) {
    return trimmedValue;
  }
};

export const getWebServiceLabel = (value) => {
  const normalizedUrl = normalizeWebServiceUrl(value);

  try {
    const parsedUrl = new URL(normalizedUrl);
    const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
    const filename = pathSegments[pathSegments.length - 1] || parsedUrl.host;

    return filename.replace(/\.dll$/i, '');
  } catch (error) {
    return normalizedUrl.replace(/^.*[\\/]/, '').replace(/\.dll$/i, '');
  }
};