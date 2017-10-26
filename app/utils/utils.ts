/**
 * Strictly parses string to number.
 * White spaces are removed, "," replaced by "." is there is more than 1 dot or other chars NaN is returned.
 * @param {string} source
 * @returns {number}
 */
export const parseStrToNumStrict = (source: string): number => {
  if (source === null) {
    return NaN;
  }

  if (source === undefined) {
    return NaN;
  }

  let transform = source.replace(/\s/g, "");
  transform = transform.replace(/,/g, ".");

  // we allow only digits dots and minus
  if (/[^.\-\d]/.test(transform)) {
    return NaN;
  }

  // we allow only one dot
  if ((transform.match(/\./g) || []).length > 1) {
    return NaN;
  }

  return parseFloat(transform);
};

/**
 * Triggers downloading a file directly to user browser
 */
export const userDownloadFile = async (
  url: string,
  fetchOptions: RequestInit,
  filename: string
) => {
  const response = await fetch(url, fetchOptions);
  if (response.status > 299) {
    throw new Error("Error during downloading.");
  }
  const blob = await response.blob();

  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = `${filename}.pdf`;
  link.click();
};
