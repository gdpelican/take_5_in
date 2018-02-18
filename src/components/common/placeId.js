import query   from 'query-string'

export default function() {
  let idFromRoute  = document.location.pathname.match(/^\/place\/(\d+)/) || []
  return idFromRoute[1] || query.parse(location.search).placeid
}
