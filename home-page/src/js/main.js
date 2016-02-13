var SITES = [
    {
      'Reader': 'https://digg.com/reader'
    },
    {
      'Hacker-News': 'https://news.ycombinator.com/',
      'Technic-Company-Blogs': 'http://www.slicedham.co/',
      'Reddit': 'https://www.reddit.com/r/programming/',
      'Design-News': 'https://www.designernews.co/',
      'Web-Fundamentals': 'https://developers.google.com/web/fundamentals/'
    },
    {
      'Startup-News': 'http://news.dbanotes.net/',
      'Fedora Hack': 'http://hack.fdzh.org/',
      'CSDN-Geek': 'http://geek.csdn.net/',
      'Ruan-Yifeng': 'http://www.ruanyifeng.com/blog/archives.html'
    },
    {
      'Github' : 'http://github.com/',
      'Stackoverflow': 'http://stackoverflow.com/',
      'Segmentfault': 'http://segmentfault.com/',
      'Twitter' : 'https://twitter.com/',
      'CNode': 'https://cnodejs.org/'
    },
    {
      'PAT': 'http://www.patest.cn/',
      'LeetCode': 'https://leetcode.com/'
    }
];

function aTpl(data) {
  return '<a target="_blank" href="' + data.href + '">' + data.title + '</a>';
}

// sites
function siteListTpl(data) {
  var i, length, group, key, val;
  var html = [];
  for (i = 0, length = data.length; i < length; i++ ) {
    group = data[i];
    html.push('<ul>');
    for (key in group) {
      if (group.hasOwnProperty(key)) {
        val = group[key];
        html.push('<li>' + aTpl({title:key, href: val}) + '</li>');
      }
    }
    html.push('</ul>');
  }
  return html.join('');
}

function init() {
  document.getElementById('sites').innerHTML = siteListTpl(SITES);
  var bdSearchQueryEl = document.getElementById('bd-search-query');
  var ggSearchQueryEl = document.getElementById('gg-search-query');
  ggSearchQueryEl.onkeyup = function(event) {
    bdSearchQueryEl.value = ggSearchQueryEl.value;
  }
}

init();
