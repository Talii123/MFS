mkdir ../tmp
cat tal_ajax.min.js simile-ajax-bundle.js tal_timeline.min.js timeline-bundle.js labellers.min.js timelineLocale.min.js > ../tmp/timeline.min.js
mv ../tmp/timeline.min.js .
rmdir ../tmp