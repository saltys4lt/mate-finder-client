export default async () => {
  const url = location.href;
  await navigator.clipboard.writeText(url);
};
