async function getLatestVersion(api, owner, repo) {
  const resp = await api.repos.listReleases({owner, repo})
  const data = resp.data
  
  data.sort((a, b) => {
    if (a.tag_name < b.tag_name) {
      return 1
    }
    if (a.tag_name > b.tag_name) {
      return -1
    }
    return 0
  })
  
  return data[0]
}


module.exports = async ({ github, core, owner, repo }) => {
  const latest = await getLatestVersion(github.rest, owner, repo)
  core.setOutput('value', latest.tag_name.replace('v', ''))
  core.setOutput('body', latest.body)
  core.setOutput('url', latest.html_url)
}