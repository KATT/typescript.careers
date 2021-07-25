export async function fetchJSON(opts: { url: string }) {
  const res = await fetch(opts.url, {
    // headers: {
    //   'content-type': 'application/json',
    // },
    method: 'GET',
  });

  if (!res.ok) {
    console.log('text', await res.text());
    throw new Error('fetchJSON failed');
  }

  const json = await res.json();

  return json as unknown;
}