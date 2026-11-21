---
layout: default
---

<h2>Posts</h2>
<ul class="post-list">
{% for post in site.categories.blog %}
<li>
<span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>
<h3><a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a></h3>
</li>
{% endfor %}
</ul>

<p>More: <a href="/crypto-weekly/">Crypto Weekly</a></p>

<h2>Research notes</h2>
<p><a href="/riemannzeta/">Zeros on the critical line</a> · Explore the first ten zeros and read the Lean formalization of the 83.625% bound.</p>
