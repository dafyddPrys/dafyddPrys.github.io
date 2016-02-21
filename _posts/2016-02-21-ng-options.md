---
layout: post
title:  "ng-options with disabled flag"
date:   2016-02-21 17:46:00 +0000
---

Since February 2015, we can set options in an ng-options attribute to be disabled based on a condition. [This commit shows the chages in the angular code base.](https://github.com/angular/angular.js/commit/91061e443fba7aa10ce78279c90e331571ef3ac4?diff=unified)

An example of this would be:

    'ng-options': 'o.value as o.name disable when o.unavailable for o in options'

This means we do NOT have to write our own directive or some custom solution to get options in a dropdown dynamically disabled/enables, [like some more popular stackOverflow answers suggest.](http://stackoverflow.com/questions/16202254/ng-options-with-disabled-rows/33875459#33875459)

[I have made a plunk with an example of this functionality here.](http://plnkr.co/edit/1nQtATwQlhWKmiWARDVP)