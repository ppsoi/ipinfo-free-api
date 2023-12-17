export async function onRequest(context) {
    // eslint-disable-next-line no-unused-vars
    const { request, waitUntil } = context;

    const url = new URL(request.url);
    const headers_Origin = request.headers.get("Access-Control-Allow-Origin") || "*";

    const myHeaders = new Headers(request.headers);
    myHeaders.delete("Referer");
    myHeaders.delete("Origin");
    myHeaders.append("Origin", "https://ipinfo.io/");
    myHeaders.append("Referer", "https://ipinfo.io/");

    let getip;
    if (url.pathname.startsWith("/api")) {
        getip =
            request.headers.get('CF-Connecting-IP') ||
            request.headers.get('X-Forwarded-For') ||
            request.headers.get('X-Real-IP') ||
            request.headers.get('X-Client-IP') ||
            request.headers.get('X-Cluster-Client-IP') ||
            request.headers.get('X-Forwarded') ||
            request.headers.get('Forwarded-For') ||
            request.headers.get('Forwarded');
    } else {
        getip = url.pathname.replace("/api/", "");
    }

    const modifiedRequest = new Request(`https://ipinfo.io/widget/demo/${getip}${url.search}`, {
        method: request.method,
        headers: myHeaders,
        body: request.body,
    });

    const response = await fetch(modifiedRequest);

    const modifiedResponse = new Response(response.body, response);

    modifiedResponse.headers.set('Access-Control-Allow-Origin', headers_Origin);

    const headersToDelete = [
        'x-proxied-host',
        'x-proxied-path',
        'x-proxied-id',
        'proxy-domain',
        'Link',
        'via'
    ];
    headersToDelete.forEach(header => modifiedResponse.headers.delete(header));

    return modifiedResponse;
}
