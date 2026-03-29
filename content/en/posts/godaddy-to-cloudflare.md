+++
title = 'Godaddy To Cloudflare Transition'
date = 2026-03-29T14:27:24-04:00
draft = false
+++
# Past experiecne with Goaddy
Buying a domain name is fairly straightforward with [godaddy](https://www.godaddy.com/), but after some time I experienced several frustrations.
    * The api accesse to setup ddns(Dynamic Domain Name System) is behind a paywall requiring you to have many domains with them.
    * After initial login any change to a DNS (Domain Name System) record requires authentication.
    * SSL cert. purchase is expensive, despite competition having much cheaper alternatives.

## Making the cloudflare switch
My experience with [cloudflare](https://www.cloudflare.com/) has been much better they offer their [API](https://developers.cloudflare.com/api/) for free. 
cloudflare also has a feature to hookup a a github repository directly to cloudflare for hosting.
This blog is actually hosted that very way. Cloudflare has many features I have not had the chance try yet, and I am quite excited to try them.

## Note Worthy cloudflare Offerings
* [Workers & Pages](https://workers.new/templates/) this blog uses the pages feature, but I want to try deploying another application through them.
* They have [database](https://developers.cloudflare.com/directory/?product-group=Storage) hosting available.
* Secretes Store for saving api keys.
* [Containers](https://developers.cloudflare.com/containers/container-package/) are in beta, so docker support.
* [AI Services](https://developers.cloudflare.com/directory/?product-group=AI) 
