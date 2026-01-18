---
layout: default
---

<h2>Posts</h2>
{% for post in site.categories.blog %}
		<time>{{ post.date | date: "%b %-d, %Y" }}</time>
		<h3><a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a></h3>
{% endfor %}

<p>More: <a href="/crypto-weekly/">Crypto Weekly</a></p>
