const IndexReg = /\/(\/(#.+))?$/;

const InitGithubInfo = {
  BaseURL:
    'https://api.github.com/repos/dodois/dosvpn',
  get ReleaseListURL() {
    return this.BaseURL + '/releases';
  },
  get LatestReleaseURL() {
    return this.ReleaseListURL + '/latest';
  },

  init() {
    // 首页生效
    if (!IndexReg.test(location.pathname)) {
      return;
    }
    Promise.all([
      this.getRepo(),
      this.getLatestRelease(),
      this.getReleaseList(),
    ])
      .then(
        ([repo, latestRelease, releaseList]) => {
          // this.processTitle(repo);
          this.processStar(repo);
          this.processDownload(latestRelease);
          this.processDownloadNumber(releaseList);
          // console.log(latestRelease.assets.filter(item => !!item.browser_download_url.match(/\.exe$/)));
        }
      )
      .catch((err) => console.error(err));
  },
  getRepo() {
    return fetch(this.BaseURL).then((res) =>
      res.ok
        ? res.json()
        : Promise.reject(res.statusText)
    );
  },
  getLatestRelease() {
    return fetch(
      this.LatestReleaseURL
    ).then((res) =>
      res.ok
        ? res.json()
        : Promise.reject(res.statusText)
    );
  },
  getReleaseList() {
    return fetch(
      this.ReleaseListURL
    ).then((res) =>
      res.ok
        ? res.json()
        : Promise.reject(res.statusText)
    );
  },
  processTitle(repo) {
    // console.log(repo, repo.description)
    document.head.querySelector(
      'title'
    ).innerText = `DOSVPN ${
      repo.description || ''
    }`;
  },
  processStar(repo) {
    // stargazers_count
    let starSpan = document.querySelector(
      '#star-num'
    );
    starSpan.dataset.number =
      repo.stargazers_count || 0;
  },
  processDownloadNumber(releaseList) {
    // let downloadFile = releaseList.assets.filter(item => !!item.browser_download_url.match(/\.exe$/))
    let downloadSpan = document.querySelector(
      '#download-num'
    );
    let totalDownload = releaseList.reduce(
      (res, release) => {
        res += release.assets.reduce(
          (total, asset) => {
            total += asset.download_count;
            return total;
          },
          0
        );
        return res;
      },
      0
    );
    downloadSpan.dataset.number = (
      totalDownload / 1000
    ).toFixed(1);
    // console.log('list => ', releaseList)
  },
  processDownload(latestRelease) {
    // console.log('assets => ', latestRelease);
    let downloadAssets =
      latestRelease.assets &&
      latestRelease.assets.filter(
        (asset) =>
          !!asset.browser_download_url.match(
            /\.exe$/
          )
      );
    // 如果各种原因导致资源不存在的默认资源
    downloadAssets =
      downloadAssets && downloadAssets.length
        ? downloadAssets
        : [
            'https://github.com/dodois/dosvpn/releases/download/v1.1.2/Dos-VPN-Setup-1.1.2.exe',
          ];
    const downloadBtn = document.querySelector(
      '#download-btn'
    );
    downloadBtn.target = '_blank';
    downloadBtn.href =
      downloadAssets[0].browser_download_url;
  },
};

InitGithubInfo.init();
