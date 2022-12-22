const { open, readFile, writeFile } = require('fs/promises');
const path = require('path');

const rootDir = path.dirname(__dirname);


class Dockerfile {
  constructor(filename) {
    this.filename = filename;
  }
  
  get pattern() {
    return /(?<=S6_OVERLAY_VERSION=)("|'|)([\d+\.]+)\1/;
  }
  
  async getVersion() {
    // Returns the latest version of s6-overlay used in the build.
    const content = await this.load();
    const match = content.match(this.pattern);
    
    if (!match) {
      throw Error('Invalid Dockerfile');
    }
    
    return match[2];
  }
  
  async load() {
    // Returns the content of the Dockerfile.
    return await readFile(this.filename, {encoding: 'utf-8'});
  }
  
  async update(version) {
    // Updates the s6-overlay version.
    let content = await this.load();
    content = content.replace(this.pattern, `"${version}"`);
    await writeFile(this.filename, content);
  }
}


async function getLatestRelease(api, owner, repo) {
  // Returns the latest release from the GitHub repository.
  const resp = await api.repos.listReleases({owner, repo});
  const data = resp.data;
  
  data.sort((a, b) => {
    if (a.tag_name < b.tag_name) {
      return 1;
    }
    if (a.tag_name > b.tag_name) {
      return -1;
    }
    return 0;
  })
  
  return data[0];
}


module.exports = async ({ github, core, owner, repo }) => {
  const latestRelease = await getLatestRelease(github.rest, owner, repo);
  const latestVersion = latestRelease.tag_name.replace('v', '');
  const dockerFile = new Dockerfile(
    path.join(rootDir, 'docker', 'Dockerfile')
  );
  const currentVersion = await dockerFile.getVersion();
  
  console.info(`The latest version of s6-overlay on the site: ${latestVersion}`);
  console.info(`Latest version of Tixati to build: ${currentVersion}`);
  
  if (latestVersion > currentVersion) {
    await dockerFile.update(latestVersion);
    console.info('All files have been successfully edited');
  } else {
    console.info('No update required');
  }
  
  core.setOutput('latest_version', latestVersion);
  core.setOutput('latest_release', JSON.stringify(latestRelease));
  core.setOutput('build_version', currentVersion);
  core.setOutput('updated', latestVersion > currentVersion);
}
