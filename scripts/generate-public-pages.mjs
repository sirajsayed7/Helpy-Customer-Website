import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const SITE = 'https://www.helpy.qa'
const API = (process.env.HELPY_SEO_API_BASE || 'https://admin.helpyapp.tech/api/v1').replace(/\/$/, '')
const ROOT = resolve(import.meta.dirname, '..')
const DIST = resolve(ROOT, 'dist')
const SNAPSHOT = resolve(ROOT, 'seo', 'catalog-snapshot.json')
const APP_LINK = 'https://onelink.to/zv7wrj/'
const DEFAULT_IMAGE = `${SITE}/assets/doha-katara-crescent-hero.png`
const CATEGORY_IMAGES = {
  1: '/assets/ai-homecat-home_services.png',
  2: '/assets/cat-uniform-health-wellness.png',
  3: '/assets/ai-homecat-education.png',
  4: '/assets/cat-uniform-digital.png',
  8: '/assets/cat-uniform-marketplace.png',
  13: '/assets/cat-car-services-user-exact.png',
  14: '/assets/cat-pets-dog-cat-food.png',
}

const string = value => value == null ? '' : String(value).trim()
const clean = value => string(value).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/\s+/g, ' ').trim()
const summary = value => {
  const text = clean(value)
  if (text.length <= 155) return text
  const shortened = text.slice(0, 152)
  return `${shortened.slice(0, shortened.lastIndexOf(' '))}…`
}
const escape = value => string(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])
const safeImage = value => {
  const image = string(value)
  return /^(https?:\/\/|\/assets\/)/i.test(image) ? image : ''
}
const absolute = value => value?.startsWith('/') ? `${SITE}${value}` : value
const safeJson = value => JSON.stringify(value).replace(/</g, '\\u003c')

async function request(path, token, options = {}) {
  const response = await fetch(`${API}/${path}`, {
    ...options,
    signal: AbortSignal.timeout(20000),
    headers: {
      Accept: 'application/json',
      Authorization: token ? `Bearer ${token}` : 'Bearer',
      language: 'en', lan: '25.2854', long: '51.5310',
      ...options.headers,
    },
  })
  const result = await response.json()
  if (!response.ok || !result.status) throw new Error(`${path}: ${result.message || response.status}`)
  return result
}

async function fetchCatalog() {
  const guest = await request('guest-user')
  if (!guest.token) throw new Error('Guest API did not provide a token')
  const token = guest.token
  const categoryRows = (await request('get-category-list?categoryImageSize=64_64', token)).data
  if (!Array.isArray(categoryRows) || !categoryRows.length) throw new Error('No published categories returned')
  const categories = categoryRows.map(row => ({
    id: Number(row.category_id),
    name: clean(row.name_english || row.name),
    description: clean(row.description_english || row.description),
    image: safeImage(CATEGORY_IMAGES[Number(row.category_id)] || row.category_image_url || row.category_image),
  })).filter(row => Number.isInteger(row.id) && row.id > 0 && row.name)

  const pages = await Promise.all(categories.map(async category => {
    const form = new URLSearchParams({ page: '1', category_id: String(category.id), service_id: '0', sort_by: 'recently_added', limit: '100' })
    const response = await request(`featured-services-List?${form}`, token, {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: form,
    })
    return Array.isArray(response.data?.data) ? response.data.data : []
  }))

  const businesses = new Map()
  const seenServices = new Set()
  for (const row of pages.flat()) {
    const serviceId = Number(row.service_vendor_mapp_id)
    const categoryId = Number(row.category_id)
    const creator = row.created_by && typeof row.created_by === 'object' ? row.created_by : {}
    const businessId = Number(creator.id)
    if (!Number.isInteger(serviceId) || serviceId <= 0 || !Number.isInteger(businessId) || businessId <= 0 || seenServices.has(serviceId)) continue
    seenServices.add(serviceId)
    const name = clean(creator.name_english || creator.name || row.created_by_name)
    if (!name) continue
    const images = Array.isArray(row.all_service_images) ? row.all_service_images : []
    const service = {
      id: serviceId,
      categoryId,
      name: clean(row.name_english || row.name),
      description: clean(row.description_english || row.description),
      image: safeImage(row.service_image_url || images[0] || row.service_image),
    }
    if (!businesses.has(businessId)) businesses.set(businessId, {
      id: businessId,
      name,
      about: clean(creator.about_me_english || creator.about_me),
      image: safeImage(creator.vendor_profile_image_url || creator.user_profile_image_url || creator.profile_photo),
      services: [],
    })
    businesses.get(businessId).services.push(service)
  }
  const snapshot = {
    categories,
    businesses: [...businesses.values()].sort((a, b) => a.name.localeCompare(b.name)),
  }
  if (!snapshot.businesses.length) throw new Error('No published businesses returned')
  return snapshot
}

const categoryUrl = id => `/categories/${id}/`
const businessUrl = id => `/businesses/${id}/`
const categoryName = (catalog, id) => catalog.categories.find(item => item.id === id)?.name || 'Services'
const categoryTitle = name => `${name} in Qatar`
const imageTag = (src, alt, className = '') => src ? `<img class="${className}" src="${escape(src)}" alt="${escape(alt)}" loading="lazy">` : ''
const breadcrumb = items => `<nav class="crumbs" aria-label="Breadcrumb">${items.map((item, index) => item.url ? `<a href="${escape(item.url)}">${escape(item.label)}</a><span aria-hidden="true">/</span>` : `<span aria-current="page">${escape(item.label)}</span>`).join('')}</nav>`

function layout({ title, description, path, image, body, breadcrumbs = [], indexable = true }) {
  const url = `${SITE}${path}`
  const fullTitle = `${title} | Helpy`
  const excerpt = summary(description)
  const preview = absolute(image) || DEFAULT_IMAGE
  const schema = {
    '@context': 'https://schema.org', '@type': 'WebPage',
    '@id': url, url, name: fullTitle, description: excerpt,
    ...(breadcrumbs.length ? { breadcrumb: { '@type': 'BreadcrumbList', itemListElement: breadcrumbs.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: item.label, item: `${SITE}${item.url || path}` })) } } : {}),
  }
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escape(fullTitle)}</title><meta name="description" content="${escape(excerpt)}">
<link rel="canonical" href="${escape(url)}">${indexable ? '' : '<meta name="robots" content="noindex,follow">'}<meta name="theme-color" content="#0967ff">
<meta property="og:type" content="website"><meta property="og:site_name" content="Helpy"><meta property="og:url" content="${escape(url)}">
<meta property="og:title" content="${escape(fullTitle)}"><meta property="og:description" content="${escape(excerpt)}">
<meta property="og:image" content="${escape(preview)}"><meta property="og:image:alt" content="${escape(title)}"><meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escape(fullTitle)}"><meta name="twitter:description" content="${escape(excerpt)}"><meta name="twitter:image" content="${escape(preview)}">
<link rel="icon" type="image/png" href="/favicon.png"><link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/catalog.css"><script type="application/ld+json">${safeJson(schema)}</script>
</head><body>
<header class="site-header"><div class="header-inner"><a class="brand" href="/" aria-label="Helpy home">${imageTag('/assets/helpy-logo-transparent.png', 'Helpy')}</a><nav class="site-nav" aria-label="Main navigation"><a href="/categories/">Categories</a><a href="/businesses/">Businesses</a><a class="nav-app" href="${APP_LINK}">Get the app</a></nav></div></header>
<main class="container">${breadcrumbs.length ? breadcrumb(breadcrumbs) : ''}${body}</main>
<footer class="site-footer"><div class="footer-inner"><span>Helpy · Services across Qatar</span><div><a href="/">Website</a><a href="/categories/">Categories</a><a href="/businesses/">Businesses</a><a href="${APP_LINK}">Download app</a></div></div></footer>
</body></html>`
}

const categoryCard = (category, count) => `<a class="tile category-tile" href="${categoryUrl(category.id)}"><span class="category-art">${imageTag(category.image, '')}</span><span class="tile-body"><strong>${escape(category.name)}</strong><span>${count ? `${count} ${count === 1 ? 'business' : 'businesses'}` : 'Explore category'}</span></span><span class="tile-arrow" aria-hidden="true">↗</span></a>`
const businessCard = (business, catalog) => {
  const cover = business.services.find(service => service.image)?.image || business.image
  const categories = [...new Set(business.services.map(service => categoryName(catalog, service.categoryId)))]
  return `<a class="tile business-tile" href="${businessUrl(business.id)}"><span class="business-art">${imageTag(cover, '')}</span><span class="tile-body"><strong>${escape(business.name)}</strong><span>${escape(categories.join(' · '))}</span><small>${business.services.length} ${business.services.length === 1 ? 'service' : 'services'}</small></span><span class="tile-arrow" aria-hidden="true">↗</span></a>`
}

async function writePage(path, html) {
  const folder = resolve(DIST, path.replace(/^\//, ''))
  await mkdir(folder, { recursive: true })
  await writeFile(resolve(folder, 'index.html'), html)
}

async function main() {
  let catalog
  if (process.env.HELPY_SEO_SNAPSHOT_ONLY === '1') {
    catalog = JSON.parse(await readFile(SNAPSHOT, 'utf8'))
  } else {
    try {
      catalog = await fetchCatalog()
      await mkdir(resolve(ROOT, 'seo'), { recursive: true })
      await writeFile(SNAPSHOT, `${JSON.stringify(catalog, null, 2)}\n`)
    } catch (error) {
      console.warn(`Live SEO catalog unavailable: ${error.message}. Using the saved public snapshot.`)
      catalog = JSON.parse(await readFile(SNAPSHOT, 'utf8'))
    }
  }
  if (!Array.isArray(catalog.categories) || !Array.isArray(catalog.businesses) || !catalog.categories.length) throw new Error('Public catalog snapshot is empty')

  const categoriesBody = `<section class="hero"><span class="eyebrow">EXPLORE HELPY</span><h1>Find services by category</h1><p>Browse services from local businesses across Qatar, then choose the provider that fits your plans.</p></section><section class="section"><div class="section-heading"><h2>Browse categories</h2><a href="/businesses/">View all businesses →</a></div><div class="category-grid">${catalog.categories.map(category => categoryCard(category, catalog.businesses.filter(business => business.services.some(service => service.categoryId === category.id)).length)).join('')}</div></section>`
  await writePage('/categories/', layout({ title: 'Browse Service Categories', description: 'Explore Helpy service categories and discover local businesses offering services across Qatar.', path: '/categories/', body: categoriesBody, breadcrumbs: [{ label: 'Home', url: '/' }, { label: 'Categories' }] }))

  const businessesBody = `<section class="hero"><span class="eyebrow">LOCAL BUSINESSES</span><h1>Browse businesses in Qatar</h1><p>Explore services offered by businesses currently published on Helpy.</p></section><section class="section"><div class="section-heading"><h2>All businesses</h2><a href="/categories/">Browse by category →</a></div><div class="business-grid">${catalog.businesses.map(business => businessCard(business, catalog)).join('')}</div></section>`
  await writePage('/businesses/', layout({ title: 'Browse Local Businesses', description: 'Discover businesses and their services on Helpy in Qatar.', path: '/businesses/', body: businessesBody, breadcrumbs: [{ label: 'Home', url: '/' }, { label: 'Businesses' }] }))

  for (const category of catalog.categories) {
    const businesses = catalog.businesses.filter(business => business.services.some(service => service.categoryId === category.id))
    const description = category.description || `Explore ${category.name.toLowerCase()} services from local businesses in Qatar on Helpy.`
    const body = `<section class="hero hero-detail"><span class="eyebrow">SERVICE CATEGORY</span><div class="hero-detail-row"><div><h1>${escape(category.name)} in Qatar</h1><p>${escape(description)}</p></div>${category.image ? imageTag(category.image, '', 'hero-category-image') : ''}</div></section><section class="section"><div class="section-heading"><h2>${businesses.length ? `Businesses offering ${escape(category.name.toLowerCase())}` : 'Businesses'}</h2><a href="/categories/">All categories →</a></div>${businesses.length ? `<div class="business-grid">${businesses.map(business => businessCard(business, catalog)).join('')}</div>` : '<p class="empty">No businesses are currently listed in this category.</p>'}</section>`
    await writePage(categoryUrl(category.id), layout({ title: categoryTitle(category.name), description, path: categoryUrl(category.id), image: category.image, body, indexable: businesses.length > 0, breadcrumbs: [{ label: 'Home', url: '/' }, { label: 'Categories', url: '/categories/' }, { label: category.name }] }))
  }

  for (const business of catalog.businesses) {
    const cover = business.services.find(service => service.image)?.image || business.image
    const description = business.about || `Explore services offered by ${business.name} on Helpy in Qatar.`
    const cards = business.services.map(service => `<article class="service-card">${service.image ? imageTag(service.image, '', 'service-image') : ''}<div class="service-content"><span class="service-category">${escape(categoryName(catalog, service.categoryId))}</span><h2>${escape(service.name)}</h2>${service.description ? `<p>${escape(service.description)}</p>` : ''}<div class="service-actions"><a class="button desktop-action" href="/?serviceVendorMapId=${service.id}#service-detail">View service &amp; availability</a><a class="button mobile-action" href="${APP_LINK}">Open in the Helpy app</a></div></div></article>`).join('')
    const body = `<section class="hero business-hero"><span class="eyebrow">HELPY BUSINESS</span><div class="hero-detail-row"><div><h1>${escape(business.name)}</h1><p>${escape(description)}</p><span class="hero-count">${business.services.length} ${business.services.length === 1 ? 'service' : 'services'} on Helpy</span></div>${cover ? imageTag(cover, '', 'hero-business-image') : ''}</div></section><section class="section"><div class="section-heading"><h2>Services from ${escape(business.name)}</h2><a href="/businesses/">All businesses →</a></div><div class="service-grid">${cards}</div></section>`
    await writePage(businessUrl(business.id), layout({ title: business.name, description, path: businessUrl(business.id), image: cover, body, breadcrumbs: [{ label: 'Home', url: '/' }, { label: 'Businesses', url: '/businesses/' }, { label: business.name }] }))
  }

  const indexedCategories = catalog.categories.filter(category => catalog.businesses.some(business => business.services.some(service => service.categoryId === category.id)))
  const paths = ['/', '/categories/', '/businesses/', ...indexedCategories.map(category => categoryUrl(category.id)), ...catalog.businesses.map(business => businessUrl(business.id))]
  await writeFile(resolve(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(path => `  <url><loc>${SITE}${path}</loc></url>`).join('\n')}\n</urlset>\n`)
  console.log(`Generated ${catalog.categories.length + catalog.businesses.length + 2} public catalog pages from ${catalog.categories.length} categories and ${catalog.businesses.length} businesses; ${paths.length - 1} are in the sitemap.`)
}

await main()
